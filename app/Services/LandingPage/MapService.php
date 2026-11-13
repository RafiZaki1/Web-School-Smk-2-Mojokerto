<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\MapRepositoryInterface;
use App\Contracts\Interfaces\MapServiceInterface;
use App\Models\MapEdge;
use App\Models\MapNode;
use Illuminate\Database\Eloquent\Collection;

class MapService implements MapServiceInterface
{
    /**
     * Inisialisasi MapService dengan dependensi yang disuntikkan oleh service container.
     */
    public function __construct(
        protected MapRepositoryInterface $mapRepository,
    ) {}

    /**
     * Ambil seluruh titik peta.
     */
    public function getAllNodes(): Collection
    {
        return $this->mapRepository->getAllNodes();
    }

    /**
     * Ambil titik peta yang dapat dilalui.
     */
    public function getWalkableNodes(): Collection
    {
        return $this->mapRepository->getWalkableNodes();
    }

    /**
     * Ambil titik peta berdasarkan id, atau gagal.
     */
    public function getNodeById(int|string $id): MapNode
    {
        return $this->mapRepository->findNodeOrFail($id);
    }

    /**
     * Simpan titik peta baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function createNode(array $data): MapNode
    {
        return $this->mapRepository->createNode($data);
    }

    /**
     * Perbarui titik peta.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateNode(int|string $id, array $data): MapNode
    {
        $node = $this->getNodeById($id);

        return $this->mapRepository->updateNode($node, $data);
    }

    /**
     * Hapus titik peta.
     */
    public function deleteNode(int|string $id): bool
    {
        $node = $this->getNodeById($id);

        return $this->mapRepository->deleteNode($node);
    }

    /**
     * Ambil seluruh sisi peta.
     */
    public function getAllEdges(): Collection
    {
        return $this->mapRepository->getAllEdges();
    }

    /**
     * Ambil sisi peta yang dapat dilalui.
     */
    public function getWalkableEdges(): Collection
    {
        return $this->mapRepository->getWalkableEdges();
    }

    /**
     * Ambil sisi peta berdasarkan id, atau gagal.
     */
    public function getEdgeById(int|string $id): MapEdge
    {
        return $this->mapRepository->findEdgeOrFail($id);
    }

    /**
     * Simpan sisi peta baru. Jarak kosong dianggap 0 dan dihitung otomatis saat merute.
     *
     * @param  array<string, mixed>  $data
     */
    public function createEdge(array $data): MapEdge
    {
        $data['distance'] ??= 0;

        return $this->mapRepository->createEdge($data);
    }

    /**
     * Perbarui sisi peta.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateEdge(int|string $id, array $data): MapEdge
    {
        $edge = $this->getEdgeById($id);

        return $this->mapRepository->updateEdge($edge, $data);
    }

    /**
     * Hapus sisi peta.
     */
    public function deleteEdge(int|string $id): bool
    {
        $edge = $this->getEdgeById($id);

        return $this->mapRepository->deleteEdge($edge);
    }
}
