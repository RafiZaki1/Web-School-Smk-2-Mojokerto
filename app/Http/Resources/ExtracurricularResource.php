<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExtracurricularResource extends JsonResource
{
    use FormatsImageUrl;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'tagline' => $this->tagline,
            'icon' => $this->icon,
            'cover_image' => $this->formatImageUrl($this->cover_image),
            'summary' => $this->summary,
            'schedule' => $this->schedule,
            'location' => $this->location,
            'members' => $this->members,
            'about_title' => $this->about_title,
            'about' => $this->about,
            'gallery_title' => $this->gallery_title,
            'gallery' => $this->formatImageUrls($this->gallery),
            'achievements' => $this->achievements ?? [],
            'testimonials' => $this->testimonials ?? [],
            'is_published' => (bool) $this->is_published,
            'sort_order' => (int) $this->sort_order,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
