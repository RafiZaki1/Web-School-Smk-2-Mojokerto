<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'building_name',
        'category_id',
        'description',
        'image',
        'open_hours',
        'is_active',
        'map_x',
        'map_y',
        'map_width',
        'map_height',
        'map_node_id',
    ];

    protected $casts = [
        'category_id' => 'integer',
        'is_active' => 'boolean',
        'map_x' => 'float',
        'map_y' => 'float',
        'map_width' => 'float',
        'map_height' => 'float',
        'map_node_id' => 'integer',
    ];

    /**
     * Get the category that the room belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(RoomCategory::class, 'category_id');
    }

    /**
     * Get the associated waypoint map node for routing.
     */
    public function mapNode(): BelongsTo
    {
        return $this->belongsTo(MapNode::class, 'map_node_id');
    }

    /**
     * Get the facilities associated with the room.
     */
    public function facilities(): HasMany
    {
        return $this->hasMany(Facility::class);
    }

    /**
     * Scope a query to only include active rooms.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order rooms.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('id', 'asc');
    }
}
