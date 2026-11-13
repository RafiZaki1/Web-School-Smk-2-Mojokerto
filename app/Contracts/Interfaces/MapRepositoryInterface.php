<?php

namespace App\Contracts\Interfaces;

use App\Models\MapEdge;
use App\Models\MapNode;
use Illuminate\Database\Eloquent\Collection;

interface MapRepositoryInterface
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
     * Kontrak method findNodeOrFail.
     *
     * @param  int|string  $id
     * @return MapNode
     */
    public function findNodeOrFail(int|string $id): MapNode;

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
     * @param  MapNode  $node
     * @param  array  $data
     * @return MapNode
     */
    public function updateNode(MapNode $node, array $data): MapNode;

    /**
     * Kontrak method deleteNode.
     *
     * @param  MapNode  $node
     * @return bool
     */
    public function deleteNode(MapNode $node): bool;

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
     * Kontrak method findEdgeOrFail.
     *
     * @param  int|string  $id
     * @return MapEdge
     */
    public function findEdgeOrFail(int|string $id): MapEdge;

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
     * @param  MapEdge  $edge
     * @param  array  $data
     * @return MapEdge
     */
    public function updateEdge(MapEdge $edge, array $data): MapEdge;

    /**
     * Kontrak method deleteEdge.
     *
     * @param  MapEdge  $edge
     * @return bool
     */
    public function deleteEdge(MapEdge $edge): bool;
}
