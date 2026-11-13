<?php

namespace App\Contracts\Interfaces;

use App\Models\MapEdge;
use App\Models\MapNode;
use Illuminate\Database\Eloquent\Collection;

interface MapServiceInterface
{
    /**
     * Kontrak method getAllNodes.
     *
     * @return Collection
     */
    public function getAllNodes(): Collection;

    /**
     * Kontrak method getWalkableNodes.
     *
     * @return Collection
     */
    public function getWalkableNodes(): Collection;

    /**
     * Kontrak method getNodeById.
     *
     * @param  int|string  $id
     * @return MapNode
     */
    public function getNodeById(int|string $id): MapNode;

    /**
     * Kontrak method createNode.
     *
     * @param  array  $data
     * @return MapNode
     */
    public function createNode(array $data): MapNode;

    /**
     * Kontrak method updateNode.
     *
     * @param  int|string  $id
     * @param  array  $data
     * @return MapNode
     */
    public function updateNode(int|string $id, array $data): MapNode;

    /**
     * Kontrak method deleteNode.
     *
     * @param  int|string  $id
     * @return bool
     */
    public function deleteNode(int|string $id): bool;

    /**
     * Kontrak method getAllEdges.
     *
     * @return Collection
     */
    public function getAllEdges(): Collection;

    /**
     * Kontrak method getWalkableEdges.
     *
     * @return Collection
     */
    public function getWalkableEdges(): Collection;

    /**
     * Kontrak method getEdgeById.
     *
     * @param  int|string  $id
     * @return MapEdge
     */
    public function getEdgeById(int|string $id): MapEdge;

    /**
     * Kontrak method createEdge.
     *
     * @param  array  $data
     * @return MapEdge
     */
    public function createEdge(array $data): MapEdge;

    /**
     * Kontrak method updateEdge.
     *
     * @param  int|string  $id
     * @param  array  $data
     * @return MapEdge
     */
    public function updateEdge(int|string $id, array $data): MapEdge;

    /**
     * Kontrak method deleteEdge.
     *
     * @param  int|string  $id
     * @return bool
     */
    public function deleteEdge(int|string $id): bool;
}
