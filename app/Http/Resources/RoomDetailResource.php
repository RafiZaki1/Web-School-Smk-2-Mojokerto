<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomDetailResource extends JsonResource
{
    use FormatsImageUrl;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'building_name' => $this->building_name,
            'description' => $this->description,
            'image' => $this->formatImageUrl($this->image),
            'open_hours' => $this->open_hours,
            'is_active' => (bool) $this->is_active,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
                'icon' => $this->category->icon,
            ] : null,
            'hotspot' => ($this->map_x !== null && $this->map_y !== null) ? [
                'x' => (float) $this->map_x,
                'y' => (float) $this->map_y,
                'width' => (float) ($this->map_width ?? 0),
                'height' => (float) ($this->map_height ?? 0),
            ] : null,
            'map_node_id' => $this->map_node_id,
            'map_node' => new MapNodeResource($this->whenLoaded('mapNode')),
            'facilities' => FacilityResource::collection($this->whenLoaded('facilities')),
        ];
    }
}
