<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeResource extends JsonResource
{
    /**
     * Transform the aggregated home data into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'hero' => HeroResource::make($this->resource['hero'] ?? null),
            'galleries' => GalleryResource::collection($this->resource['galleries'] ?? []),
            'school_profile' => SchoolProfileResource::make($this->resource['school_profile'] ?? null),
            'statistics' => $this->resource['statistics'] ?? [],
        ];
    }
}
