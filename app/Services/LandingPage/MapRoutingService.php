<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\MapRoutingServiceInterface;
use App\Contracts\Interfaces\RoomRepositoryInterface;
use App\Models\Room;
use App\Services\LandingPage\Map\MapDirectionsBuilder;
use App\Services\LandingPage\Map\MapEntryFinder;
use App\Services\LandingPage\Map\MapGeometry;
use App\Services\LandingPage\Map\MapGraph;
use App\Services\LandingPage\Map\MapPathFinder;
use App\Services\LandingPage\Map\MapPolylineBuilder;
use InvalidArgumentException;
use RuntimeException;

/**
 * Menghitung rute jalan kaki antar ruangan di denah sekolah.
 *
 * Ruangan ditempelkan ke koridor terdekat, Dijkstra mencari jalur terpendek pada graf koridor,
 * lalu hasilnya dirangkum menjadi petunjuk arah. Koordinat memakai persen (0-100) dari gambar denah.
 */
class MapRoutingService implements MapRoutingServiceInterface
{
    protected float $walkingSpeed;

    /**
     * Inisialisasi MapRoutingService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected RoomRepositoryInterface $roomRepository,
        protected MapGraph $graph,
        protected MapEntryFinder $entries,
        protected MapPathFinder $paths,
        protected MapPolylineBuilder $polyline,
        protected MapDirectionsBuilder $directions,
        protected MapGeometry $geometry,
    ) {
        $this->walkingSpeed = (float) config('map.walking_speed', 1.2);
    }

    /**
     * Hitung rute terpendek dari ruangan asal ke ruangan tujuan beserta petunjuk arahnya.
     *
     * @return array<string, mixed>
     *
     * @throws RuntimeException
     * @throws InvalidArgumentException
     */
    public function calculateRoute(int|string $fromIdentifier, int|string $toIdentifier): array
    {
        $origin = $this->roomRepository->findByIdentifierOrFail($fromIdentifier);
        $destination = $this->roomRepository->findByIdentifierOrFail($toIdentifier);

        if (! $origin->is_active || ! $destination->is_active) {
            throw new RuntimeException(trans('alert.room_inactive'));
        }

        if ($origin->id === $destination->id) {
            throw new InvalidArgumentException(trans('alert.same_room'));
        }

        $adjacency = $this->graph->load();
        $starts = $this->entries->candidates($origin, $this->graph);
        $ends = $this->entries->candidates($destination, $this->graph);

        if (! $starts || ! $ends) {
            $missing = ! $starts ? $origin->name : $destination->name;

            throw new RuntimeException(trans('alert.room_not_connected', ['room' => $missing]));
        }

        $result = $this->paths->shortestPath($adjacency, $starts, $ends);

        if ($result === null) {
            throw new RuntimeException(trans('alert.route_not_found'));
        }

        [$points, $segments] = $this->polyline->build($result, $starts, $ends, $this->graph);
        $legs = $this->polyline->mergeLegs($points, $segments);

        return $this->summarize($origin, $destination, $legs, $segments);
    }

    /**
     * Susun respons rute dari leg: jarak, estimasi waktu, titik jalur, jalur yang dilewati, dan petunjuk arah.
     *
     * @param  array<int, array<string, mixed>>  $legs
     * @param  array<int, array{corridor: bool, name: string|null}>  $segments
     * @return array<string, mixed>
     */
    private function summarize(Room $origin, Room $destination, array $legs, array $segments): array
    {
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
            'steps' => $this->directions->build($legs, $origin, $destination, $this->graph),
        ];
    }

    /**
     * Nama jalur yang dilalui, tanpa duplikat dan urut sesuai perjalanan.
     *
     * @param  array<int, array{corridor: bool, name: string|null}>  $segments
     * @return array<int, string>
     */
    private function viaNames(array $segments): array
    {
        $via = [];

        foreach (array_column($segments, 'name') as $name) {
            if ($name !== null && ! in_array($name, $via, true)) {
                $via[] = $name;
            }
        }

        return $via;
    }

    /**
     * Ringkasan ruangan asal atau tujuan beserta titik masuknya pada jalur.
     *
     * @param  array{x: float, y: float}  $point
     * @return array<string, mixed>
     */
    private function roomSummary(Room $room, array $point): array
    {
        return [
            'id' => $room->id,
            'name' => $room->name,
            'slug' => $room->slug,
            'point' => $this->geometry->publicPoint($point),
        ];
    }
}
