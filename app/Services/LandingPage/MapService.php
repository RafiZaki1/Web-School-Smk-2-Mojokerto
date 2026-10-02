<?php

namespace App\Services\LandingPage;

use App\Contracts\Interfaces\MapRepositoryInterface;
use App\Contracts\Interfaces\MapServiceInterface;
use App\Models\MapEdge;
use App\Models\MapNode;
use Illuminate\Database\Eloquent\Collection;

class MapService implements MapServiceInterface
{
    public function __construct(
        protected MapRepositoryInterface $mapRepository,
    ) {}

    public function getAllNodes(): Collection
    {
        return $this->mapRepository->getAllNodes();
    }

    public function getWalkableNodes(): Collection
    {
        return $this->mapRepository->getWalkableNodes();
    }

    public function getNodeById(int|string $id): MapNode
    {
        return $this->mapRepository->findNodeOrFail($id);
    }

    public function createNode(array $data): MapNode
    {
        return $this->mapRepository->createNode($data);
    }

    public function updateNode(int|string $id, array $data): MapNode
    {
        $node = $this->getNodeById($id);
        return $this->mapRepository->updateNode($node, $data);
    }

    public function deleteNode(int|string $id): bool
    {
        $node = $this->getNodeById($id);
        return $this->mapRepository->deleteNode($node);
    }

    public function getAllEdges(): Collection
    {
        return $this->mapRepository->getAllEdges();
    }

    public function getWalkableEdges(): Collection
    {
        return $this->mapRepository->getWalkableEdges();
    }

    public function getEdgeById(int|string $id): MapEdge
    {
        return $this->mapRepository->findEdgeOrFail($id);
    }

    public function createEdge(array $data): MapEdge
    {
        $data['distance'] ??= 0;

        return $this->mapRepository->createEdge($data);
    }

    public function updateEdge(int|string $id, array $data): MapEdge
    {
        $edge = $this->getEdgeById($id);
        return $this->mapRepository->updateEdge($edge, $data);
    }

    public function deleteEdge(int|string $id): bool
    {
        $edge = $this->getEdgeById($id);
        return $this->mapRepository->deleteEdge($edge);
    }
}
