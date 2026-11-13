<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MapEdge extends Model
{
    use HasFactory;

    /** @var array<int, string> */
    protected $fillable = [
        'from_node_id',
        'to_node_id',
        'name',
        'distance',
        'is_walkable',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'from_node_id' => 'integer',
        'to_node_id' => 'integer',
        'distance' => 'float',
        'is_walkable' => 'boolean',
    ];

    /**
     * Ambil titik asal sisi peta.
     */
    public function fromNode(): BelongsTo
    {
        return $this->belongsTo(MapNode::class, 'from_node_id');
    }

    /**
     * Ambil titik tujuan sisi peta.
     */
    public function toNode(): BelongsTo
    {
        return $this->belongsTo(MapNode::class, 'to_node_id');
    }

    /**
     * Batasi query hanya pada sisi yang dapat dilalui.
     */
    public function scopeWalkable(Builder $query): Builder
    {
        return $query->where('is_walkable', true);
    }
}
