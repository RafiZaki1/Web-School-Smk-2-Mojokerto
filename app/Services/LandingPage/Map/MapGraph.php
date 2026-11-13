<?php

namespace App\Services\LandingPage\Map;

use App\Contracts\Interfaces\MapRepositoryInterface;
use App\Models\MapNode;
use Illuminate\Support\Collection;
use RuntimeException;

class MapGraph
{
    /** @var Collection<int, MapNode> */
    protected Collection $nodes;

    /** @var array<int, array{id: int, a: int, b: int, weight: float, name: string|null}> */
    protected array $edges = [];

    /** @var array<string, string|null> */
    protected array $edgeNames = [];

    /**
     * Inisialisasi MapGraph dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MapGeometry $geometry,
        protected MapRepositoryInterface $mapRepository,
    ) {
        $this->nodes = collect();
    }

    /**
     * Muat titik dan sisi yang dapat dilalui, lalu bangun graf bertetangga berbobot jarak.
     *
     * @return array<int, array<int, float>>
     *
     * @throws RuntimeException
     */
    public function load(): array
    {
        $this->nodes = $this->mapRepository->getWalkableNodes()->keyBy('id');
        $edges = $this->mapRepository->getWalkableEdges();

        if ($this->nodes->isEmpty() || $edges->isEmpty()) {
            throw new RuntimeException(trans('alert.walkway_data_missing'));
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

            $weight = (float) $edge->distance > 0
                ? (float) $edge->distance
                : $this->geometry->meters($this->nodePoint($a), $this->nodePoint($b));

            $graph[$a][$b] = min($graph[$a][$b] ?? INF, $weight);
            $graph[$b][$a] = min($graph[$b][$a] ?? INF, $weight);
            $this->edges[] = ['id' => $edge->id, 'a' => $a, 'b' => $b, 'weight' => $weight, 'name' => $edge->name];
            $this->edgeNames[$this->pairKey($a, $b)] = $edge->name;
        }

        return $graph;
    }

    /**
     * Titik waypoint yang sudah dimuat.
     *
     * @return Collection<int, MapNode>
     */
    public function nodes(): Collection
    {
        return $this->nodes;
    }

    /**
     * Ruas koridor yang sudah dimuat.
     *
     * @return array<int, array{id: int, a: int, b: int, weight: float, name: string|null}>
     */
    public function edges(): array
    {
        return $this->edges;
    }

    /**
     * Koordinat titik waypoint berdasarkan id.
     *
     * @return array{x: float, y: float}
     */
    public function nodePoint(int $id): array
    {
        $node = $this->nodes[$id];

        return ['x' => (float) $node->x, 'y' => (float) $node->y];
    }

    /**
     * Nama jalur di antara dua titik waypoint yang bertetangga.
     */
    public function edgeName(int $a, int $b): ?string
    {
        return $this->edgeNames[$this->pairKey($a, $b)] ?? null;
    }

    /**
     * Node di ujung ruas bila proyeksi jatuh tepat di ujungnya.
     *
     * @param  array<string, mixed>  $candidate
     */
    public function endpointNode(array $candidate): ?int
    {
        if (! $candidate['edge']) {
            return $candidate['node'];
        }

        if ($candidate['t'] <= MapGeometry::EPS) {
            return $candidate['edge']['a'];
        }

        if ($candidate['t'] >= 1 - MapGeometry::EPS) {
            return $candidate['edge']['b'];
        }

        return null;
    }

    /**
     * Pasangan dua node dalam bentuk kunci tanpa urutan.
     */
    private function pairKey(int $a, int $b): string
    {
        return min($a, $b).'-'.max($a, $b);
    }
}
