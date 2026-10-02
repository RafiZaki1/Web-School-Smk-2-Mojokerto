<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MapEdgeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'from_node_id' => $this->from_node_id,
            'to_node_id' => $this->to_node_id,
            'name' => $this->name,
            'distance' => (float) $this->distance,
            'is_walkable' => (bool) $this->is_walkable,
            'from_node' => new MapNodeResource($this->whenLoaded('fromNode')),
            'to_node' => new MapNodeResource($this->whenLoaded('toNode')),
        ];
    }
}
