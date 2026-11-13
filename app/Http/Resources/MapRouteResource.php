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

            'path' => data_get($this->resource, 'path', []),

            'via' => data_get($this->resource, 'via', []),

            'steps' => data_get($this->resource, 'steps', []),
        ];
    }

    /**
     * Ambil data ruangan asal atau tujuan dari hasil rute berdasarkan kuncinya.
     */
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
