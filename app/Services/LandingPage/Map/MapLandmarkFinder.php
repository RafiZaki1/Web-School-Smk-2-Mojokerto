<?php

namespace App\Services\LandingPage\Map;

use App\Contracts\Interfaces\RoomRepositoryInterface;
use App\Models\Room;

class MapLandmarkFinder
{
    /** @var string Slug kategori ruang kelas yang hanya dipakai bila tidak ada patokan lain. */
    private const CLASSROOM_CATEGORY_SLUG = 'ruang-kelas';

    /**
     * Inisialisasi MapLandmarkFinder dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MapGeometry $geometry,
        protected RoomRepositoryInterface $roomRepository,
    ) {}

    /**
     * Nama node di titik belok, atau node terdekat dalam radius 3 meter.
     *
     * @param  array<string, mixed>  $point
     */
    public function landmarkAt(array $point, MapGraph $graph): ?string
    {
        $nodes = $graph->nodes();

        if (! empty($point['node']) && isset($nodes[$point['node']])) {
            return $nodes[$point['node']]->name;
        }

        $nearest = $nodes
            ->map(fn ($node) => ['name' => $node->name, 'd' => $this->geometry->meters($point, ['x' => (float) $node->x, 'y' => (float) $node->y])])
            ->sortBy('d')
            ->first();

        return $nearest && $nearest['d'] <= 3 ? $nearest['name'] : null;
    }

    /**
     * Ruangan aktif yang bisa dijadikan patokan, kecuali asal dan tujuan.
     *
     * @param  array<int, int>  $exclude
     * @return array<int, array{name: string, is_class: bool, rect: array{x1: float, y1: float, x2: float, y2: float}}>
     */
    public function landmarkRooms(array $exclude): array
    {
        return $this->roomRepository->active()
            ->reject(fn (Room $room) => in_array($room->id, $exclude, true) || $room->map_x === null)
            ->map(fn (Room $room) => [
                'name' => $room->name,
                'is_class' => $room->category?->slug === self::CLASSROOM_CATEGORY_SLUG,
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
     * Fasilitas, kantor, dan lab diutamakan; kelas hanya dipakai bila tidak ada patokan lain.
     *
     * @param  array<string, mixed>  $leg
     * @param  array<int, array<string, mixed>>  $rooms
     * @return array<int, string>
     */
    public function passingRooms(array $leg, array $rooms): array
    {
        $tolerance = (float) config('map.landmark_tolerance_meters', 4.0);
        $horizontal = abs($leg['to']['y'] - $leg['from']['y']) < MapGeometry::EPS;
        $vertical = abs($leg['to']['x'] - $leg['from']['x']) < MapGeometry::EPS;
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
     * Ruangan berada di samping ruas lurus horizontal atau vertikal bila sebagian besar sisinya sejajar
     * dengan ruas dan jaraknya dekat. Mengembalikan posisi relatif (0..1) di sepanjang ruas, atau null.
     *
     * @param  array<string, mixed>  $leg
     * @param  array{x1: float, y1: float, x2: float, y2: float}  $rect
     */
    private function alongsideAxis(array $leg, array $rect, bool $horizontal, float $tolerance): ?float
    {
        [$along, $across, $lo, $hi, $min, $max, $scale] = $horizontal
            ? ['x', 'y', $rect['x1'], $rect['x2'], $rect['y1'], $rect['y2'], $this->geometry->metersPerY]
            : ['y', 'x', $rect['y1'], $rect['y2'], $rect['x1'], $rect['x2'], $this->geometry->metersPerX];

        $start = $leg['from'][$along];
        $end = $leg['to'][$along];
        $overlap = min($hi, max($start, $end)) - max($lo, min($start, $end));

        if ($overlap <= 0 || $overlap < min(0.35 * ($hi - $lo), 0.5 * abs($end - $start))) {
            return null;
        }

        $line = $leg['from'][$across];
        $gap = max($min - $line, 0, $line - $max) * $scale;

        if ($gap > $tolerance) {
            return null;
        }

        $middle = (max($lo, min($start, $end)) + min($hi, max($start, $end))) / 2;

        return abs($middle - $start) / max(abs($end - $start), MapGeometry::EPS);
    }

    /**
     * Pengecekan berbasis sampel untuk ruas diagonal: ruangan dianggap di samping bila salah satu sampel dekat.
     *
     * @param  array<string, mixed>  $leg
     * @param  array{x1: float, y1: float, x2: float, y2: float}  $rect
     */
    private function alongsideSampled(array $leg, array $rect, float $tolerance): ?float
    {
        for ($s = 1; $s < 20; $s++) {
            $t = $s / 20;
            $point = [
                'x' => $leg['from']['x'] + ($leg['to']['x'] - $leg['from']['x']) * $t,
                'y' => $leg['from']['y'] + ($leg['to']['y'] - $leg['from']['y']) * $t,
            ];

            if ($this->geometry->rectDistanceMeters($rect, $point) <= $tolerance) {
                return $t;
            }
        }

        return null;
    }
}
