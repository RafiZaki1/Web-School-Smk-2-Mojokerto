<?php

namespace App\Contracts\Repositories;

use App\Contracts\Interfaces\MapRepositoryInterface;
use App\Models\MapEdge;
use App\Models\MapNode;
use Illuminate\Database\Eloquent\Collection;

class MapRepository implements MapRepositoryInterface
{
    /**
     * Ambil seluruh titik peta diurutkan dari id.
     */
    public function getAllNodes(): Collection
    {
        return MapNode::query()->orderBy('id')->get();
    }

    /**
     * Ambil titik peta yang dapat dilalui.
     */
    public function getWalkableNodes(): Collection
    {
        return MapNode::query()->walkable()->orderBy('id')->get();
    }

    /**
     * Cari titik peta berdasarkan id, atau gagal.
     */
    public function findNodeOrFail(int|string $id): MapNode
    {
        return MapNode::query()->whereKey($id)->firstOrFail();
    }

    /**
     * Simpan titik peta baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function createNode(array $data): MapNode
    {
        return MapNode::create($data);
    }

    /**
     * Perbarui titik peta dan kembalikan data terbarunya.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateNode(MapNode $node, array $data): MapNode
    {
        $node->update($data);

        return $node->fresh();
    }

    /**
     * Hapus titik peta. Sisi dan ruangan yang terhubung ikut diperbarui oleh relasi database.
     */
    public function deleteNode(MapNode $node): bool
    {
        return (bool) $node->delete();
    }

    /**
     * Ambil seluruh sisi peta beserta titik asal dan tujuannya.
     */
    public function getAllEdges(): Collection
    {
        return MapEdge::query()->with(['fromNode', 'toNode'])->orderBy('id')->get();
    }

    /**
     * Ambil sisi peta yang dapat dilalui beserta titik asal dan tujuannya.
     */
    public function getWalkableEdges(): Collection
    {
        return MapEdge::query()
            ->walkable()
            ->with(['fromNode', 'toNode'])
            ->orderBy('id')
            ->get();
    }

    /**
     * Cari sisi peta berdasarkan id beserta relasinya, atau gagal.
     */
    public function findEdgeOrFail(int|string $id): MapEdge
    {
        return MapEdge::query()->with(['fromNode', 'toNode'])->whereKey($id)->firstOrFail();
    }

    /**
     * Simpan sisi peta baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function createEdge(array $data): MapEdge
    {
        return MapEdge::create($data);
    }

    /**
     * Perbarui sisi peta dan muat ulang relasinya.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateEdge(MapEdge $edge, array $data): MapEdge
    {
        $edge->update($data);

        return $edge->fresh(['fromNode', 'toNode']);
    }

    /**
     * Hapus sisi peta.
     */
    public function deleteEdge(MapEdge $edge): bool
    {
        return (bool) $edge->delete();
    }
}
