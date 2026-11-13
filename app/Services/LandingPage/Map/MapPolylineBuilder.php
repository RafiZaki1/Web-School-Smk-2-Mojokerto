<?php

namespace App\Services\LandingPage\Map;

class MapPolylineBuilder
{
    /**
     * Inisialisasi MapPolylineBuilder dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MapGeometry $geometry,
    ) {}

    /**
     * Susun titik jalur lengkap: pusat ruangan asal, koridor, node, koridor, lalu pusat ruangan tujuan.
     * Setiap ruas ditandai apakah bagian koridor atau kaki keluar dan masuk ruangan.
     *
     * @param  array<string, mixed>  $result
     * @param  array<int, array<string, mixed>>  $starts
     * @param  array<int, array<string, mixed>>  $ends
     * @return array{0: array<int, array{x: float, y: float, node: int|null}>, 1: array<int, array{corridor: bool, name: string|null}>}
     */
    public function build(array $result, array $starts, array $ends, MapGraph $graph): array
    {
        $start = $starts[$result['start']];
        $end = $ends[$result['end']];
        $points = [];
        $segments = [];

        foreach ($start['leg'] as $point) {
            $this->push($points, $segments, $point, null, false);
        }

        $points[count($points) - 1]['node'] = $start['node'] ?? $graph->endpointNode($start);

        if ($result['direct']) {
            $this->push($points, $segments, $end['point'], $graph->endpointNode($end), true, $start['edge']['name'] ?? null);
        } else {
            $this->corridor($points, $segments, $result['nodes'], $start, $end, $graph);
        }

        foreach (array_slice(array_reverse($end['leg']), 1) as $point) {
            $this->push($points, $segments, $point, null, false);
        }

        return $this->dedupe($points, $segments);
    }

    /**
     * Gabungkan ruas segaris yang searah dan sejenis (koridor atau ruangan) menjadi satu leg.
     *
     * @param  array<int, array{x: float, y: float, node: int|null}>  $points
     * @param  array<int, array{corridor: bool, name: string|null}>  $segments
     * @return array<int, array<string, mixed>>
     */
    public function mergeLegs(array $points, array $segments): array
    {
        $legs = [];

        for ($k = 0; $k < count($points) - 1; $k++) {
            $from = $points[$k];
            $to = $points[$k + 1];
            $segment = $segments[$k];
            $current = $legs ? count($legs) - 1 : null;

            if ($current !== null
                && $legs[$current]['corridor'] === $segment['corridor']
                && $this->geometry->isStraight($legs[$current]['from'], $legs[$current]['to'], $to)) {
                $legs[$current]['to'] = $to;
                $legs[$current]['length'] += $this->geometry->meters($from, $to);

                if ($segment['name'] !== null && ! in_array($segment['name'], $legs[$current]['names'], true)) {
                    $legs[$current]['names'][] = $segment['name'];
                }

                continue;
            }

            $legs[] = [
                'from' => $from,
                'to' => $to,
                'length' => $this->geometry->meters($from, $to),
                'corridor' => $segment['corridor'],
                'names' => $segment['name'] !== null ? [$segment['name']] : [],
            ];
        }

        return $legs;
    }

    /**
     * Tambahkan bagian koridor dari node pertama hingga node terakhir di jalur.
     *
     * @param  array<int, array{x: float, y: float, node: int|null}>  $points
     * @param  array<int, array{corridor: bool, name: string|null}>  $segments
     * @param  array<int, int>  $nodes
     * @param  array<string, mixed>  $start
     * @param  array<string, mixed>  $end
     */
    private function corridor(array &$points, array &$segments, array $nodes, array $start, array $end, MapGraph $graph): void
    {
        $previous = null;

        foreach ($nodes as $i => $node) {
            $name = $i === 0
                ? ($start['edge']['name'] ?? null)
                : $graph->edgeName($previous, $node);

            $this->push($points, $segments, $graph->nodePoint($node), $node, true, $name);
            $previous = $node;
        }

        $this->push($points, $segments, $end['point'], $end['node'] ?? $graph->endpointNode($end), true, $end['edge']['name'] ?? null);
    }

    /**
     * Tambahkan satu titik dan ruas penghubung dari titik sebelumnya.
     *
     * @param  array<int, array{x: float, y: float, node: int|null}>  $points
     * @param  array<int, array{corridor: bool, name: string|null}>  $segments
     * @param  array{x: float, y: float}  $point
     */
    private function push(array &$points, array &$segments, array $point, ?int $node, bool $corridor, ?string $name = null): void
    {
        if ($points) {
            $segments[] = ['corridor' => $corridor, 'name' => $name];
        }

        $points[] = ['x' => $point['x'], 'y' => $point['y'], 'node' => $node];
    }

    /**
     * Buang titik yang berurutan dan berada di koordinat yang sama, sambil mempertahankan node-nya.
     *
     * @param  array<int, array{x: float, y: float, node: int|null}>  $points
     * @param  array<int, array{corridor: bool, name: string|null}>  $segments
     * @return array{0: array<int, array{x: float, y: float, node: int|null}>, 1: array<int, array{corridor: bool, name: string|null}>}
     */
    private function dedupe(array $points, array $segments): array
    {
        $outPoints = [$points[0]];
        $outSegments = [];

        for ($k = 1; $k < count($points); $k++) {
            $lastIndex = count($outPoints) - 1;

            if (abs($points[$k]['x'] - $outPoints[$lastIndex]['x']) < MapGeometry::EPS && abs($points[$k]['y'] - $outPoints[$lastIndex]['y']) < MapGeometry::EPS) {
                $outPoints[$lastIndex]['node'] ??= $points[$k]['node'];

                continue;
            }

            $outPoints[] = $points[$k];
            $outSegments[] = $segments[$k - 1];
        }

        return [$outPoints, $outSegments];
    }

    /**
     * Gabungkan ruas koridor yang sangat pendek (sambungan yang sedikit bergeser) ke ruas berikutnya,
     * agar tidak muncul langkah "belok, jalan 2 m, belok lagi". Arah tiap leg disimpan di dir.
     *
     * @param  array<int, array<string, mixed>>  $legs
     * @return array<int, array<string, mixed>>
     */
    public function collapseJogs(array $legs, float $minimum = 3.0): array
    {
        $result = [];
        $carry = null;

        foreach ($legs as $index => $leg) {
            $leg['index'] = $index;
            $leg['dir'] = $this->geometry->vector($leg['from'], $leg['to']);
            $hasNextCorridor = isset($legs[$index + 1]) && $legs[$index + 1]['corridor'];

            if ($carry) {
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
}
