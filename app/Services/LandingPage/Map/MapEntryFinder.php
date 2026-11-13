<?php

namespace App\Services\LandingPage\Map;

use App\Models\Room;

class MapEntryFinder
{
    /** @var float Jarak maksimal (meter) dari persegi ruangan agar ruas dianggap bisa dimasuki. */
    private const SNAP_DISTANCE_METERS = 3.0;

    /**
     * Inisialisasi MapEntryFinder dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MapGeometry $geometry,
    ) {}

    /**
     * Titik-titik masuk sebuah ruangan ke jaringan koridor. Setiap kandidat berisi proyeksi
     * pusat ruangan ke sebuah ruas koridor beserta kaki jalur tegak lurus dari pusat ruangan.
     *
     * @return array<int, array<string, mixed>>
     */
    public function candidates(Room $room, MapGraph $graph): array
    {
        if ($room->map_x === null || $room->map_y === null) {
            return $this->nodeCandidates($room, $graph);
        }

        $rect = $this->roomRect($room);
        $center = ['x' => ($rect['x1'] + $rect['x2']) / 2, 'y' => ($rect['y1'] + $rect['y2']) / 2];
        $tolerance = (float) config('map.entry_tolerance_meters', 6.5);

        [$candidates, $nearest] = $this->scan($this->edgesFor($room, $graph), $center, $rect, $graph, $tolerance);

        $aligned = array_values(array_filter($candidates, fn (array $c) => ! $c['clamped']));
        $candidates = $aligned ?: $candidates;

        return $candidates ?: ($nearest ? [$nearest] : []);
    }

    /**
     * Ruangan tanpa hotspot hanya bisa memakai node waypoint miliknya secara langsung.
     *
     * @return array<int, array<string, mixed>>
     */
    private function nodeCandidates(Room $room, MapGraph $graph): array
    {
        if (! $room->map_node_id || ! isset($graph->nodes()[$room->map_node_id])) {
            return [];
        }

        $point = $graph->nodePoint((int) $room->map_node_id);

        return [[
            'edge' => null,
            'node' => (int) $room->map_node_id,
            'point' => $point,
            'leg' => [$point],
            'leg_cost' => 0.0,
            'links' => [(int) $room->map_node_id => 0.0],
        ]];
    }

    /**
     * Persegi ruangan dalam koordinat persen denah.
     *
     * @return array{x1: float, y1: float, x2: float, y2: float}
     */
    private function roomRect(Room $room): array
    {
        return [
            'x1' => (float) $room->map_x,
            'y1' => (float) $room->map_y,
            'x2' => (float) $room->map_x + (float) ($room->map_width ?? 0),
            'y2' => (float) $room->map_y + (float) ($room->map_height ?? 0),
        ];
    }

    /**
     * Ruas yang dipertimbangkan. Bila admin menentukan node pintu, hanya ruas yang menyentuh node itu.
     *
     * @return array<int, array{id: int, a: int, b: int, weight: float, name: string|null}>
     */
    private function edgesFor(Room $room, MapGraph $graph): array
    {
        if ($room->map_node_id && isset($graph->nodes()[$room->map_node_id])) {
            return array_values(array_filter(
                $graph->edges(),
                fn (array $e) => $e['a'] === (int) $room->map_node_id || $e['b'] === (int) $room->map_node_id
            ));
        }

        return $graph->edges();
    }

    /**
     * Hitung kandidat untuk setiap ruas dan kumpulkan yang berada dalam toleransi serta ruas terdekat.
     *
     * @param  array<int, array{id: int, a: int, b: int, weight: float, name: string|null}>  $edges
     * @param  array{x: float, y: float}  $center
     * @param  array{x1: float, y1: float, x2: float, y2: float}  $rect
     * @return array{0: array<int, array<string, mixed>>, 1: array<string, mixed>|null}
     */
    private function scan(array $edges, array $center, array $rect, MapGraph $graph, float $tolerance): array
    {
        $candidates = [];
        $nearest = null;

        foreach ($edges as $edge) {
            $candidate = $this->candidateFor($edge, $center, $rect, $graph);

            if ($candidate['gap'] <= $tolerance) {
                $candidates[] = $candidate;
            }

            if ($nearest === null || $candidate['gap'] < $nearest['gap']) {
                $nearest = $candidate;
            }
        }

        return [$candidates, $nearest];
    }

    /**
     * Kandidat masuk pada satu ruas: proyeksi pusat ruangan, kaki jalur, dan jaraknya ke persegi ruangan.
     *
     * @param  array{id: int, a: int, b: int, weight: float, name: string|null}  $edge
     * @param  array{x: float, y: float}  $center
     * @param  array{x1: float, y1: float, x2: float, y2: float}  $rect
     * @return array<string, mixed>
     */
    private function candidateFor(array $edge, array $center, array $rect, MapGraph $graph): array
    {
        $a = $graph->nodePoint($edge['a']);
        $b = $graph->nodePoint($edge['b']);

        [$t, $rawT] = $this->geometry->projectT($center, $a, $b);
        $point = ['x' => $a['x'] + ($b['x'] - $a['x']) * $t, 'y' => $a['y'] + ($b['y'] - $a['y']) * $t];
        $leg = $this->geometry->entryLeg($center, $point, $a, $b);

        [$t, $point, $leg] = $this->snapToJunction($center, $rect, $a, $b, $t, $point, $leg);

        $legCost = $this->geometry->polylineMeters($leg);

        return [
            'edge' => $edge,
            'node' => null,
            't' => $t,
            'clamped' => $rawT < -MapGeometry::EPS || $rawT > 1 + MapGeometry::EPS,
            'point' => $point,
            'leg' => $leg,
            'leg_cost' => $legCost,
            'links' => [
                $edge['a'] => $legCost + $edge['weight'] * $t,
                $edge['b'] => $legCost + $edge['weight'] * (1 - $t),
            ],
            'gap' => $this->geometry->rectDistanceMeters($rect, $point),
        ];
    }

    /**
     * Titik masuk yang hanya selisih beberapa meter dari persimpangan ditarik ke persimpangan itu,
     * agar tidak muncul langkah "jalan lurus ±1 m".
     *
     * @param  array{x: float, y: float}  $center
     * @param  array{x1: float, y1: float, x2: float, y2: float}  $rect
     * @param  array{x: float, y: float}  $a
     * @param  array{x: float, y: float}  $b
     * @param  array{x: float, y: float}  $point
     * @param  array<int, array{x: float, y: float}>  $leg
     * @return array{0: float, 1: array{x: float, y: float}, 2: array<int, array{x: float, y: float}>}
     */
    private function snapToJunction(array $center, array $rect, array $a, array $b, float $t, array $point, array $leg): array
    {
        foreach ([[0.0, $a], [1.0, $b]] as [$endT, $end]) {
            if (abs($t - $endT) > MapGeometry::EPS && $this->geometry->meters($point, $end) <= self::SNAP_DISTANCE_METERS) {
                $snappedLeg = $this->geometry->entryLeg($center, $end, $a, $b);

                if (count($snappedLeg) === 2 || $this->geometry->rectDistanceMeters($rect, $snappedLeg[1]) < MapGeometry::EPS) {
                    return [$endT, $end, $snappedLeg];
                }

                break;
            }
        }

        return [$t, $point, $leg];
    }
}
