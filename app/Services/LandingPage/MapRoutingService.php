<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\MapRepositoryInterface;
use App\Contracts\Interfaces\MapRoutingServiceInterface;
use App\Contracts\Interfaces\RoomRepositoryInterface;
use App\Models\Room;
use Illuminate\Support\Collection;
use InvalidArgumentException;
use RuntimeException;
use SplPriorityQueue;

/**
 * Menghitung rute jalan kaki antar ruangan di denah sekolah.
 *
 * - Ruangan "ditempelkan" ke koridor terdekat (proyeksi tegak lurus), jadi
 *   garis rute masuk/keluar ruangan tidak menembus bangunan lain.
 * - Dijkstra (priority queue) mencari jalur terpendek pada graf koridor.
 * - Hasilnya dirangkum menjadi petunjuk arah: keluar, belok kiri/kanan di
 *   persimpangan mana, lewat koridor apa, melewati ruangan apa, lalu tiba.
 *
 * Koordinat memakai persen (0-100) dari gambar denah; perhitungan jarak
 * dikonversi ke meter dengan skala dari config/map.php.
 */
class MapRoutingService implements MapRoutingServiceInterface
{
    private const EPS = 0.0001;

    protected float $metersPerX;

    protected float $metersPerY;

    protected float $walkingSpeed;

    /** @var Collection<int, \App\Models\MapNode> */
    protected Collection $nodes;

    /** @var array<int, array{id:int, a:int, b:int, weight:float, name:?string}> */
    protected array $edges = [];

    /** @var array<string, ?string> nama jalur per pasangan node "a-b" */
    protected array $edgeNames = [];

    public function __construct(
        protected RoomRepositoryInterface $roomRepository,
        protected MapRepositoryInterface $mapRepository,
    ) {
        $width = (float) config('map.width_meters', 200);
        $this->metersPerX = $width / 100;
        $this->metersPerY = $width * (float) config('map.image_aspect', 584 / 1024) / 100;
        $this->walkingSpeed = (float) config('map.walking_speed', 1.2);
    }

    /**
     * Calculate shortest path from origin room to destination room.
     */
    public function calculateRoute(int|string $fromIdentifier, int|string $toIdentifier): array
    {
        $origin = $this->roomRepository->findByIdentifierOrFail($fromIdentifier);
        $destination = $this->roomRepository->findByIdentifierOrFail($toIdentifier);

        if (! $origin->is_active || ! $destination->is_active) {
            throw new RuntimeException('Salah satu ruangan tujuan atau asal tidak aktif.');
        }

        if ($origin->id === $destination->id) {
            throw new InvalidArgumentException('Lokasi asal dan tujuan tidak boleh sama.');
        }

        $graph = $this->loadGraph();

        $starts = $this->entryCandidates($origin);
        $ends = $this->entryCandidates($destination);

        if (! $starts || ! $ends) {
            $missing = ! $starts ? $origin->name : $destination->name;
            throw new RuntimeException("{$missing} belum terhubung ke jalur pejalan kaki pada denah.");
        }

        $result = $this->shortestPath($graph, $starts, $ends);

        if ($result === null) {
            throw new RuntimeException('Tidak ditemukan jalur pejalan kaki yang terhubung antara kedua ruangan tersebut.');
        }

        [$points, $segments] = $this->buildPolyline($result, $starts, $ends);
        $legs = $this->mergeLegs($points, $segments);

        $distance = array_sum(array_column($legs, 'length'));
        $estimatedMinutes = max(1, (int) ceil(($distance / $this->walkingSpeed) / 60));

        $simplified = array_map(fn (array $leg) => $leg['from'], $legs);
        $simplified[] = end($legs)['to'];

        return [
            'origin' => $this->roomSummary($origin, $simplified[0]),
            'destination' => $this->roomSummary($destination, end($simplified)),
            'distance' => (int) round($distance),
            'estimated_minutes' => $estimatedMinutes,
            'path' => array_map(fn (array $p) => ['x' => round($p['x'], 2), 'y' => round($p['y'], 2)], $simplified),
            'via' => $this->viaNames($segments),
            'steps' => $this->buildSteps($legs, $origin, $destination),
        ];
    }

    // ------------------------------------------------------------------
    // Graf koridor
    // ------------------------------------------------------------------

    /** @return array<int, array<int, float>> */
    protected function loadGraph(): array
    {
        $this->nodes = $this->mapRepository->getWalkableNodes()->keyBy('id');
        $edges = $this->mapRepository->getWalkableEdges();

        if ($this->nodes->isEmpty() || $edges->isEmpty()) {
            throw new RuntimeException('Data jalur pejalan kaki (waypoint/edges) belum tersedia.');
        }

        $graph = [];
        $this->edges = [];
        $this->edgeNames = [];

        foreach ($edges as $edge) {
            $a = (int) $edge->from_node_id;
            $b = (int) $edge->to_node_id;
            if (! isset($this->nodes[$a], $this->nodes[$b])) {
                continue;
            }

            // Jarak tersimpan dipakai bila diisi admin, selain itu dihitung dari koordinat
            $weight = (float) $edge->distance > 0
                ? (float) $edge->distance
                : $this->meters($this->nodePoint($a), $this->nodePoint($b));

            $graph[$a][$b] = min($graph[$a][$b] ?? INF, $weight);
            $graph[$b][$a] = min($graph[$b][$a] ?? INF, $weight);

            $this->edges[] = ['id' => $edge->id, 'a' => $a, 'b' => $b, 'weight' => $weight, 'name' => $edge->name];
            $this->edgeNames[$this->pairKey($a, $b)] = $edge->name;
        }

        return $graph;
    }

    /**
     * Titik-titik masuk sebuah ruangan ke jaringan koridor.
     * Tiap kandidat berisi proyeksi pusat ruangan ke sebuah ruas koridor
     * beserta "kaki" jalur tegak lurus dari pusat ruangan ke ruas itu.
     */
    protected function entryCandidates(Room $room): array
    {
        $hasHotspot = $room->map_x !== null && $room->map_y !== null;

        if (! $hasHotspot) {
            // Tanpa hotspot, ruangan hanya bisa memakai node waypoint-nya langsung
            if ($room->map_node_id && isset($this->nodes[$room->map_node_id])) {
                $point = $this->nodePoint((int) $room->map_node_id);

                return [[
                    'edge' => null,
                    'node' => (int) $room->map_node_id,
                    'point' => $point,
                    'leg' => [$point],
                    'leg_cost' => 0.0,
                    'links' => [(int) $room->map_node_id => 0.0],
                ]];
            }

            return [];
        }

        $rect = [
            'x1' => (float) $room->map_x,
            'y1' => (float) $room->map_y,
            'x2' => (float) $room->map_x + (float) ($room->map_width ?? 0),
            'y2' => (float) $room->map_y + (float) ($room->map_height ?? 0),
        ];
        $center = ['x' => ($rect['x1'] + $rect['x2']) / 2, 'y' => ($rect['y1'] + $rect['y2']) / 2];

        // Bila admin menentukan node pintu, hanya ruas yang menyentuh node itu yang dipakai
        $edges = $room->map_node_id && isset($this->nodes[$room->map_node_id])
            ? array_filter($this->edges, fn (array $e) => $e['a'] === (int) $room->map_node_id || $e['b'] === (int) $room->map_node_id)
            : $this->edges;

        $tolerance = (float) config('map.entry_tolerance_meters', 6.5);
        $candidates = [];
        $nearest = null;

        foreach ($edges as $edge) {
            $a = $this->nodePoint($edge['a']);
            $b = $this->nodePoint($edge['b']);
            [$t, $rawT] = $this->projectT($center, $a, $b);
            $point = ['x' => $a['x'] + ($b['x'] - $a['x']) * $t, 'y' => $a['y'] + ($b['y'] - $a['y']) * $t];
            $leg = $this->entryLeg($center, $point, $a, $b);

            // Titik masuk yang hanya selisih beberapa meter dari persimpangan ditarik ke
            // persimpangannya, agar tidak muncul langkah "jalan lurus ±1 m".
            foreach ([[0.0, $a], [1.0, $b]] as [$endT, $end]) {
                if (abs($t - $endT) > self::EPS && $this->meters($point, $end) <= 3.0) {
                    $snappedLeg = $this->entryLeg($center, $end, $a, $b);
                    if (count($snappedLeg) === 2 || $this->rectDistanceMeters($rect, $snappedLeg[1]) < self::EPS) {
                        [$t, $point, $leg] = [$endT, $end, $snappedLeg];
                    }
                    break;
                }
            }

            $legCost = $this->polylineMeters($leg);
            $candidate = [
                'edge' => $edge,
                'node' => null,
                't' => $t,
                'clamped' => $rawT < -self::EPS || $rawT > 1 + self::EPS,
                'point' => $point,
                'leg' => $leg,
                'leg_cost' => $legCost,
                'links' => [
                    $edge['a'] => $legCost + $edge['weight'] * $t,
                    $edge['b'] => $legCost + $edge['weight'] * (1 - $t),
                ],
                'gap' => $this->rectDistanceMeters($rect, $point),
            ];

            if ($candidate['gap'] <= $tolerance) {
                $candidates[] = $candidate;
            }

            if ($nearest === null || $candidate['gap'] < $nearest['gap']) {
                $nearest = $candidate;
            }
        }

        // Ruas yang benar-benar berada di depan ruangan lebih diutamakan daripada ujung ruas
        $aligned = array_values(array_filter($candidates, fn (array $c) => ! $c['clamped']));
        $candidates = $aligned ?: $candidates;

        return $candidates ?: ($nearest ? [$nearest] : []);
    }

    /**
     * Dijkstra dengan simpul virtual S (asal) dan E (tujuan).
     *
     * @return array{nodes: array<int,int>, start: int, end: int, direct: bool}|null
     */
    protected function shortestPath(array $graph, array $starts, array $ends): ?array
    {
        $dist = [];
        $prev = [];
        $startOf = [];
        $queue = new SplPriorityQueue;
        $queue->setExtractFlags(SplPriorityQueue::EXTR_BOTH);

        foreach ($starts as $index => $candidate) {
            foreach ($candidate['links'] as $node => $cost) {
                if ($cost < ($dist[$node] ?? INF)) {
                    $dist[$node] = $cost;
                    $prev[$node] = null;
                    $startOf[$node] = $index;
                    $queue->insert($node, -$cost);
                }
            }
        }

        // Biaya node -> E terbaik per node
        $endLinks = [];
        foreach ($ends as $index => $candidate) {
            foreach ($candidate['links'] as $node => $cost) {
                if ($cost < ($endLinks[$node][0] ?? INF)) {
                    $endLinks[$node] = [$cost, $index];
                }
            }
        }

        $best = INF;
        $bestEnd = null;

        // Asal & tujuan di ruas koridor yang sama: jalan langsung tanpa lewat node
        foreach ($starts as $si => $start) {
            foreach ($ends as $ei => $end) {
                if ($start['edge'] && $end['edge'] && $start['edge']['id'] === $end['edge']['id']) {
                    $cost = $start['leg_cost'] + abs($start['t'] - $end['t']) * $start['edge']['weight'] + $end['leg_cost'];
                    if ($cost < $best) {
                        $best = $cost;
                        $bestEnd = ['direct' => true, 'start' => $si, 'end' => $ei, 'node' => null];
                    }
                }
            }
        }

        while (! $queue->isEmpty()) {
            ['data' => $node, 'priority' => $priority] = $queue->extract();
            $d = -$priority;

            if ($d > ($dist[$node] ?? INF) + self::EPS) {
                continue;
            }
            if ($d >= $best) {
                break;
            }

            if (isset($endLinks[$node]) && $d + $endLinks[$node][0] < $best) {
                $best = $d + $endLinks[$node][0];
                $bestEnd = ['direct' => false, 'start' => null, 'end' => $endLinks[$node][1], 'node' => $node];
            }

            foreach ($graph[$node] ?? [] as $neighbor => $weight) {
                $next = $d + $weight;
                if ($next < ($dist[$neighbor] ?? INF) - self::EPS) {
                    $dist[$neighbor] = $next;
                    $prev[$neighbor] = $node;
                    $queue->insert($neighbor, -$next);
                }
            }
        }

        if ($bestEnd === null) {
            return null;
        }

        if ($bestEnd['direct']) {
            return ['nodes' => [], 'start' => $bestEnd['start'], 'end' => $bestEnd['end'], 'direct' => true];
        }

        $path = [];
        for ($node = $bestEnd['node']; $node !== null; $node = $prev[$node]) {
            array_unshift($path, $node);
        }

        return ['nodes' => $path, 'start' => $startOf[$path[0]], 'end' => $bestEnd['end'], 'direct' => false];
    }

    // ------------------------------------------------------------------
    // Polyline & ruas
    // ------------------------------------------------------------------

    /**
     * Susun titik jalur lengkap: pusat ruangan asal -> koridor -> node -> koridor -> pusat ruangan tujuan.
     * Tiap ruas ditandai apakah bagian koridor atau kaki keluar/masuk ruangan.
     *
     * @return array{0: array<int, array{x:float, y:float, node:?int}>, 1: array<int, array{corridor:bool, name:?string}>}
     */
    protected function buildPolyline(array $result, array $starts, array $ends): array
    {
        $start = $starts[$result['start']];
        $end = $ends[$result['end']];

        $points = [];
        $segments = [];
        $push = function (array $point, ?int $node, bool $corridor, ?string $name = null) use (&$points, &$segments) {
            if ($points) {
                $segments[] = ['corridor' => $corridor, 'name' => $name];
            }
            $points[] = ['x' => $point['x'], 'y' => $point['y'], 'node' => $node];
        };

        // Kaki keluar dari ruangan asal
        foreach ($start['leg'] as $point) {
            $push($point, null, false);
        }
        $points[count($points) - 1]['node'] = $start['node'] ?? $this->endpointNode($start);

        if ($result['direct']) {
            $push($end['point'], $this->endpointNode($end), true, $start['edge']['name'] ?? null);
        } else {
            $previous = null;
            foreach ($result['nodes'] as $i => $node) {
                $name = $i === 0
                    ? ($start['edge']['name'] ?? null)
                    : ($this->edgeNames[$this->pairKey($previous, $node)] ?? null);
                $push($this->nodePoint($node), $node, true, $name);
                $previous = $node;
            }
            $push($end['point'], $end['node'] ?? $this->endpointNode($end), true, $end['edge']['name'] ?? null);
        }

        // Kaki masuk ke ruangan tujuan (urutan dibalik)
        foreach (array_slice(array_reverse($end['leg']), 1) as $point) {
            $push($point, null, false);
        }

        return $this->dedupe($points, $segments);
    }

    /** Buang titik berurutan yang sama (mis. proyeksi tepat di node). */
    protected function dedupe(array $points, array $segments): array
    {
        $outPoints = [$points[0]];
        $outSegments = [];

        for ($k = 1; $k < count($points); $k++) {
            $lastIndex = count($outPoints) - 1;
            if (abs($points[$k]['x'] - $outPoints[$lastIndex]['x']) < self::EPS && abs($points[$k]['y'] - $outPoints[$lastIndex]['y']) < self::EPS) {
                $outPoints[$lastIndex]['node'] ??= $points[$k]['node'];

                continue;
            }
            $outPoints[] = $points[$k];
            $outSegments[] = $segments[$k - 1];
        }

        return [$outPoints, $outSegments];
    }

    /**
     * Gabungkan ruas segaris searah (dan sejenis: koridor/ruangan) menjadi satu "leg".
     *
     * @return array<int, array{from:array, to:array, length:float, corridor:bool, names:array<int,string>}>
     */
    protected function mergeLegs(array $points, array $segments): array
    {
        $legs = [];
        for ($k = 0; $k < count($points) - 1; $k++) {
            $from = $points[$k];
            $to = $points[$k + 1];
            $segment = $segments[$k];
            $current = $legs ? count($legs) - 1 : null;

            if ($current !== null
                && $legs[$current]['corridor'] === $segment['corridor']
                && $this->isStraight($legs[$current]['from'], $legs[$current]['to'], $to)) {
                $legs[$current]['to'] = $to;
                $legs[$current]['length'] += $this->meters($from, $to);
                if ($segment['name'] !== null && ! in_array($segment['name'], $legs[$current]['names'], true)) {
                    $legs[$current]['names'][] = $segment['name'];
                }

                continue;
            }

            $legs[] = [
                'from' => $from,
                'to' => $to,
                'length' => $this->meters($from, $to),
                'corridor' => $segment['corridor'],
                'names' => $segment['name'] !== null ? [$segment['name']] : [],
            ];
        }

        return $legs;
    }

    // ------------------------------------------------------------------
    // Petunjuk arah
    // ------------------------------------------------------------------

    /**
     * Langkah: keluar ruangan (+ belok ke koridor pertama), tiap belokan di
     * persimpangan, lalu tiba (dengan sisi kiri/kanan/depan ruangan tujuan).
     */
    protected function buildSteps(array $legs, Room $origin, Room $destination): array
    {
        $rooms = $this->landmarkRooms([$origin->id, $destination->id]);
        $originCenter = $legs[0]['from'];
        $destinationCenter = end($legs)['to'];
        $arrivalIndex = count($legs);
        $legs = $this->collapseJogs($legs);
        $corridorLegs = array_keys(array_filter($legs, fn (array $leg) => $leg['corridor']));
        $steps = [];

        if (! $corridorLegs) {
            // Asal & tujuan bersebelahan tanpa melewati koridor
            $steps[] = $this->step('depart', "Keluar dari {$origin->name}", $this->sentence([$this->walkPhrase($legs[0], [])]), $legs[0]['length'], $originCenter, 0);
        } else {
            $first = $corridorLegs[0];
            $lastCorridor = end($corridorLegs);
            $exitLength = array_sum(array_column(array_slice($legs, 0, $first), 'length'));

            // 1. Keluar ruangan lalu masuk koridor pertama
            $corridor = $legs[$first];
            $turn = $first > 0 ? $this->turnBetween($this->vector($originCenter, $corridor['from']), $corridor['dir']) : 'straight';
            $description = $turn === 'straight'
                ? $this->sentence([$this->walkPhrase($corridor, $rooms, true)])
                : $this->sentence([$this->turnPhrase($turn, $corridor), 'lalu '.$this->walkPhrase($corridor, $rooms)]);
            $steps[] = $this->step('depart', "Keluar dari {$origin->name}", $description, $exitLength + $corridor['length'], $originCenter, 0);

            // 2. Belokan berikutnya di sepanjang koridor
            for ($i = $first + 1; $i <= $lastCorridor; $i++) {
                $leg = $legs[$i];
                $turn = $this->turnBetween($legs[$i - 1]['dir'], $leg['dir']);
                $marker = $leg['marker'] ?? $leg['from'];
                $landmark = $this->landmarkAt($marker);
                $walk = $this->walkPhrase($leg, $rooms);

                $steps[] = [
                    ...$this->step($turn, $this->turnTitle($turn, $leg), $this->sentence([$landmark ? "Dari {$landmark}, {$walk}" : ucfirst($walk)]), $leg['length'], $marker, $leg['index']),
                    'landmark' => $landmark,
                ];
            }
        }

        // 3. Tiba: sisi ruangan dilihat dari arah koridor terakhir
        $last = $corridorLegs ? $legs[end($corridorLegs)] : $legs[0];
        $side = $this->turnBetween($last['dir'], $this->vector($last['to'], $destinationCenter));
        $steps[] = $this->step(
            'arrive',
            "Tiba di {$destination->name}",
            "{$destination->name} ada {$this->sidePhrase($side)}.",
            0,
            $destinationCenter,
            $arrivalIndex
        );

        return array_map(fn (array $step, int $i) => ['index' => $i + 1, ...$step], $steps, array_keys($steps));
    }

    /**
     * Ruas koridor yang sangat pendek (sambungan antar koridor yang sedikit
     * bergeser) dilebur ke ruas berikutnya agar tidak muncul langkah
     * "belok, jalan 2 m, belok lagi". Arah tiap leg disimpan di 'dir'.
     */
    protected function collapseJogs(array $legs, float $minimum = 3.0): array
    {
        $result = [];
        $carry = null;

        foreach ($legs as $index => $leg) {
            $leg['index'] = $index;
            $leg['dir'] = $this->vector($leg['from'], $leg['to']);
            $hasNextCorridor = isset($legs[$index + 1]) && $legs[$index + 1]['corridor'];

            if ($carry) {
                // Geometri leg tetap; titik penanda langkah pindah ke awal sambungan
                $leg['marker'] = $carry['marker'] ?? $carry['from'];
                $leg['index'] = $carry['index'];
                $leg['length'] += $carry['length'];
                $carry = null;
            }

            if ($leg['corridor'] && $hasNextCorridor && $leg['length'] < $minimum) {
                $carry = $leg;

                continue;
            }

            $result[] = $leg;
        }

        return $result;
    }

    protected function step(string $type, string $title, string $description, float $distance, array $point, int $pathIndex): array
    {
        return [
            'type' => $type,
            'title' => $title,
            'description' => $description,
            'distance' => (int) round($distance),
            'point' => $this->publicPoint($point),
            'path_index' => $pathIndex,
        ];
    }

    /** Klasifikasi belokan dari vektor arah sebelumnya ke vektor arah berikutnya. */
    protected function turnBetween(array $v1, array $v2): string
    {
        // Sumbu y gambar mengarah ke bawah, jadi cross > 0 berarti belok kanan
        $cross = $v1[0] * $v2[1] - $v1[1] * $v2[0];
        $dot = $v1[0] * $v2[0] + $v1[1] * $v2[1];
        $angle = rad2deg(atan2($cross, $dot));
        $abs = abs($angle);

        return match (true) {
            $abs < 30 => 'straight',
            $abs > 150 => 'u-turn',
            $abs < 60 => $angle > 0 ? 'slight-right' : 'slight-left',
            default => $angle > 0 ? 'turn-right' : 'turn-left',
        };
    }

    protected function turnWord(string $turn): string
    {
        return match ($turn) {
            'turn-left' => 'belok kiri',
            'turn-right' => 'belok kanan',
            'slight-left' => 'serong ke kiri',
            'slight-right' => 'serong ke kanan',
            'u-turn' => 'putar balik',
            default => 'jalan lurus',
        };
    }

    protected function turnTitle(string $turn, array $leg): string
    {
        $word = ucfirst($this->turnWord($turn));
        $name = $leg['names'][0] ?? null;

        if ($turn === 'straight') {
            return $name ? "Lurus terus ke {$name}" : 'Lurus terus';
        }

        return $name ? "{$word} ke {$name}" : $word;
    }

    protected function turnPhrase(string $turn, array $leg): string
    {
        $name = $leg['names'][0] ?? null;

        return $this->turnWord($turn).($name ? " ke {$name}" : '');
    }

    protected function sidePhrase(string $turn): string
    {
        return match ($turn) {
            'turn-left', 'slight-left' => 'di sebelah kiri Anda',
            'turn-right', 'slight-right' => 'di sebelah kanan Anda',
            'u-turn' => 'di belakang Anda',
            default => 'tepat di depan Anda',
        };
    }

    /** "jalan lurus ±58 m ke arah utara menyusuri X, melewati A dan B" */
    protected function walkPhrase(array $leg, array $rooms, bool $withFirstName = false): string
    {
        $phrase = 'jalan lurus '.$this->formatDistance($leg['length']).' ke arah '.$this->compass($leg);

        // Nama jalur pertama biasanya sudah disebut di judul/belokan; sebutkan lanjutannya saja
        $names = $withFirstName ? $leg['names'] : array_slice($leg['names'], 1);
        if ($names) {
            $phrase .= ' menyusuri '.$this->joinNames(array_slice($names, 0, 2));
        }

        $passes = $this->passingRooms($leg, $rooms);
        if ($passes) {
            $phrase .= ', melewati '.$this->joinNames($passes);
        }

        return $phrase;
    }

    protected function compass(array $leg): string
    {
        [$dx, $dy] = $this->vector($leg['from'], $leg['to']);

        if (abs($dx) >= abs($dy)) {
            return $dx > 0 ? 'timur' : 'barat';
        }

        return $dy > 0 ? 'selatan' : 'utara';
    }

    /** Nama node di titik belok (atau node terdekat dalam radius 3 m). */
    protected function landmarkAt(array $point): ?string
    {
        if (! empty($point['node']) && isset($this->nodes[$point['node']])) {
            return $this->nodes[$point['node']]->name;
        }

        $nearest = $this->nodes
            ->map(fn ($node) => ['name' => $node->name, 'd' => $this->meters($point, ['x' => (float) $node->x, 'y' => (float) $node->y])])
            ->sortBy('d')
            ->first();

        return $nearest && $nearest['d'] <= 3 ? $nearest['name'] : null;
    }

    /** Ruangan yang bisa dijadikan patokan, kecuali asal & tujuan. */
    protected function landmarkRooms(array $exclude): array
    {
        return $this->roomRepository->active()
            ->reject(fn (Room $room) => in_array($room->id, $exclude, true) || $room->map_x === null)
            ->map(fn (Room $room) => [
                'name' => $room->name,
                'is_class' => $room->category?->slug === 'ruang-kelas',
                'rect' => [
                    'x1' => (float) $room->map_x,
                    'y1' => (float) $room->map_y,
                    'x2' => (float) $room->map_x + (float) $room->map_width,
                    'y2' => (float) $room->map_y + (float) $room->map_height,
                ],
            ])
            ->values()
            ->all();
    }

    /**
     * Maksimal dua ruangan yang dilewati sepanjang leg, berurutan dari awal leg.
     * Fasilitas/kantor/lab diutamakan; kelas hanya dipakai bila tak ada patokan lain.
     */
    protected function passingRooms(array $leg, array $rooms): array
    {
        $tolerance = (float) config('map.landmark_tolerance_meters', 4.0);
        $horizontal = abs($leg['to']['y'] - $leg['from']['y']) < self::EPS;
        $vertical = abs($leg['to']['x'] - $leg['from']['x']) < self::EPS;
        $found = [];

        foreach ($rooms as $room) {
            $match = $horizontal || $vertical
                ? $this->alongsideAxis($leg, $room['rect'], $horizontal, $tolerance)
                : $this->alongsideSampled($leg, $room['rect'], $tolerance);

            if ($match !== null) {
                $found[] = ['name' => $room['name'], 'is_class' => $room['is_class'], 't' => $match];
            }
        }

        usort($found, fn ($a, $b) => $a['t'] <=> $b['t']);
        $landmarks = array_values(array_filter($found, fn ($room) => ! $room['is_class']));
        $chosen = $landmarks ?: $found;

        return array_values(array_unique(array_column(array_slice($chosen, 0, 2), 'name')));
    }

    /**
     * Ruangan berada di samping ruas lurus bila sebagian besar sisinya sejajar
     * ruas (bukan hanya bersinggungan di ujung) dan jaraknya dekat.
     * Mengembalikan posisi relatif (0..1) di sepanjang ruas, atau null.
     */
    protected function alongsideAxis(array $leg, array $rect, bool $horizontal, float $tolerance): ?float
    {
        [$along, $across, $lo, $hi, $min, $max, $scale] = $horizontal
            ? ['x', 'y', $rect['x1'], $rect['x2'], $rect['y1'], $rect['y2'], $this->metersPerY]
            : ['y', 'x', $rect['y1'], $rect['y2'], $rect['x1'], $rect['x2'], $this->metersPerX];

        $start = $leg['from'][$along];
        $end = $leg['to'][$along];
        $overlap = min($hi, max($start, $end)) - max($lo, min($start, $end));

        // Ruangan panjang di samping ruas pendek tetap dihitung bila menutupi separuh ruas
        if ($overlap <= 0 || $overlap < min(0.35 * ($hi - $lo), 0.5 * abs($end - $start))) {
            return null;
        }

        $line = $leg['from'][$across];
        $gap = max($min - $line, 0, $line - $max) * $scale;
        if ($gap > $tolerance) {
            return null;
        }

        $middle = (max($lo, min($start, $end)) + min($hi, max($start, $end))) / 2;

        return abs($middle - $start) / max(abs($end - $start), self::EPS);
    }

    protected function alongsideSampled(array $leg, array $rect, float $tolerance): ?float
    {
        for ($s = 1; $s < 20; $s++) {
            $t = $s / 20;
            $point = [
                'x' => $leg['from']['x'] + ($leg['to']['x'] - $leg['from']['x']) * $t,
                'y' => $leg['from']['y'] + ($leg['to']['y'] - $leg['from']['y']) * $t,
            ];
            if ($this->rectDistanceMeters($rect, $point) <= $tolerance) {
                return $t;
            }
        }

        return null;
    }

    /** Urutan nama jalur yang dilalui, tanpa duplikat. */
    protected function viaNames(array $segments): array
    {
        $via = [];
        foreach (array_column($segments, 'name') as $name) {
            if ($name !== null && ! in_array($name, $via, true)) {
                $via[] = $name;
            }
        }

        return $via;
    }

    protected function roomSummary(Room $room, array $point): array
    {
        return [
            'id' => $room->id,
            'name' => $room->name,
            'slug' => $room->slug,
            'point' => $this->publicPoint($point),
        ];
    }

    // ------------------------------------------------------------------
    // Geometri
    // ------------------------------------------------------------------

    protected function nodePoint(int $id): array
    {
        $node = $this->nodes[$id];

        return ['x' => (float) $node->x, 'y' => (float) $node->y];
    }

    /** Node di ujung ruas bila proyeksi jatuh tepat di ujungnya. */
    protected function endpointNode(array $candidate): ?int
    {
        if (! $candidate['edge']) {
            return $candidate['node'];
        }
        if ($candidate['t'] <= self::EPS) {
            return $candidate['edge']['a'];
        }
        if ($candidate['t'] >= 1 - self::EPS) {
            return $candidate['edge']['b'];
        }

        return null;
    }

    /**
     * Kaki jalur dari pusat ruangan ke titik di koridor. Untuk koridor lurus
     * horizontal/vertikal dibuat siku agar tidak memotong bangunan sebelah.
     */
    protected function entryLeg(array $center, array $point, array $a, array $b): array
    {
        $aligned = abs($center['x'] - $point['x']) < self::EPS || abs($center['y'] - $point['y']) < self::EPS;
        if ($aligned) {
            return [$center, $point];
        }

        $horizontal = abs($a['y'] - $b['y']) < self::EPS;
        $vertical = abs($a['x'] - $b['x']) < self::EPS;

        if ($horizontal) {
            return [$center, ['x' => $point['x'], 'y' => $center['y']], $point];
        }
        if ($vertical) {
            return [$center, ['x' => $center['x'], 'y' => $point['y']], $point];
        }

        return [$center, $point];
    }

    /** @return array{0: float, 1: float} [t terpotong 0..1, t asli] */
    protected function projectT(array $p, array $a, array $b): array
    {
        $ax = $a['x'] * $this->metersPerX;
        $ay = $a['y'] * $this->metersPerY;
        $dx = $b['x'] * $this->metersPerX - $ax;
        $dy = $b['y'] * $this->metersPerY - $ay;
        $lengthSq = $dx * $dx + $dy * $dy;

        if ($lengthSq < self::EPS) {
            return [0.0, 0.0];
        }

        $t = (($p['x'] * $this->metersPerX - $ax) * $dx + ($p['y'] * $this->metersPerY - $ay) * $dy) / $lengthSq;

        return [max(0.0, min(1.0, $t)), $t];
    }

    protected function rectDistanceMeters(array $rect, array $point): float
    {
        $dx = max($rect['x1'] - $point['x'], 0, $point['x'] - $rect['x2']) * $this->metersPerX;
        $dy = max($rect['y1'] - $point['y'], 0, $point['y'] - $rect['y2']) * $this->metersPerY;

        return sqrt($dx * $dx + $dy * $dy);
    }

    protected function meters(array $a, array $b): float
    {
        $dx = ($b['x'] - $a['x']) * $this->metersPerX;
        $dy = ($b['y'] - $a['y']) * $this->metersPerY;

        return sqrt($dx * $dx + $dy * $dy);
    }

    protected function polylineMeters(array $points): float
    {
        $total = 0.0;
        for ($i = 1; $i < count($points); $i++) {
            $total += $this->meters($points[$i - 1], $points[$i]);
        }

        return $total;
    }

    /** Vektor arah dalam meter (sumbu y ke bawah seperti gambar). */
    protected function vector(array $from, array $to): array
    {
        return [($to['x'] - $from['x']) * $this->metersPerX, ($to['y'] - $from['y']) * $this->metersPerY];
    }

    protected function isStraight(array $a, array $b, array $c): bool
    {
        $v1 = $this->vector($a, $b);
        $v2 = $this->vector($b, $c);
        $cross = $v1[0] * $v2[1] - $v1[1] * $v2[0];
        $dot = $v1[0] * $v2[0] + $v1[1] * $v2[1];
        $norm = hypot($v1[0], $v1[1]) * hypot($v2[0], $v2[1]);

        return $norm > 0 && $dot > 0 && abs($cross) / $norm < 0.035;
    }

    protected function pairKey(int $a, int $b): string
    {
        return min($a, $b).'-'.max($a, $b);
    }

    protected function publicPoint(array $point): array
    {
        return ['x' => round($point['x'], 2), 'y' => round($point['y'], 2)];
    }

    protected function formatDistance(float $meters): string
    {
        $rounded = $meters >= 20 ? (int) (round($meters / 5) * 5) : max(1, (int) round($meters));

        return "±{$rounded} m";
    }

    protected function joinNames(array $names): string
    {
        if (count($names) <= 1) {
            return $names[0] ?? '';
        }

        $last = array_pop($names);

        return implode(', ', $names).' dan '.$last;
    }

    protected function sentence(array $parts): string
    {
        $text = implode(', ', array_filter($parts));

        return ucfirst($text).'.';
    }
}
