<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MapNode extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'name',
        'x',
        'y',
        'is_walkable',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'x' => 'float',
        'y' => 'float',
        'is_walkable' => 'boolean',
    ];

    /**
     * Ambil ruangan yang terhubung dengan titik ini.
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class, 'map_node_id');
    }

    /**
     * Ambil sisi yang berangkat dari titik ini.
     */
    public function outgoingEdges(): HasMany
    {
        return $this->hasMany(MapEdge::class, 'from_node_id');
    }

    /**
     * Ambil sisi yang menuju titik ini.
     */
    public function incomingEdges(): HasMany
    {
        return $this->hasMany(MapEdge::class, 'to_node_id');
    }

    /**
     * Batasi query hanya pada titik yang dapat dilalui.
     */
    public function scopeWalkable(Builder $query): Builder
    {
        return $query->where('is_walkable', true);
    }
}
