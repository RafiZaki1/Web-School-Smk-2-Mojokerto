<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MapEdge extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_node_id',
        'to_node_id',
        'name',
        'distance',
        'is_walkable',
    ];

    protected $casts = [
        'from_node_id' => 'integer',
        'to_node_id' => 'integer',
        'distance' => 'float',
        'is_walkable' => 'boolean',
    ];

    public function fromNode(): BelongsTo
    {
        return $this->belongsTo(MapNode::class, 'from_node_id');
    }

    public function toNode(): BelongsTo
    {
        return $this->belongsTo(MapNode::class, 'to_node_id');
    }

    public function scopeWalkable(Builder $query): Builder
    {
        return $query->where('is_walkable', true);
    }
}
