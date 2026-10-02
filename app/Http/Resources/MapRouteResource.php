<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MapRouteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'origin' => $this->place('origin'),
            'destination' => $this->place('destination'),
            'distance' => (int) data_get($this->resource, 'distance', 0),
            'estimated_minutes' => (int) data_get($this->resource, 'estimated_minutes', 0),
            // Titik belok rute dalam persen gambar denah (0-100), siap digambar sebagai polyline
            'path' => data_get($this->resource, 'path', []),
            // Nama jalur/koridor yang dilalui, berurutan
            'via' => data_get($this->resource, 'via', []),
            // Petunjuk arah: depart, turn-left/right, slight-left/right, straight, u-turn, arrive
            'steps' => data_get($this->resource, 'steps', []),
        ];
    }

    protected function place(string $key): array
    {
        return [
            'id' => data_get($this->resource, "{$key}.id"),
            'name' => data_get($this->resource, "{$key}.name"),
            'slug' => data_get($this->resource, "{$key}.slug"),
            'point' => data_get($this->resource, "{$key}.point"),
        ];
    }
}
