<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MajorResource extends JsonResource
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
            'code' => $this->code,
            'name' => $this->name,
            'tagline' => $this->tagline,
            'accreditation' => $this->accreditation,
            'summary' => $this->summary,
            'description' => $this->description,
            'image' => $this->formatImageUrl($this->image),
            'accent_color' => $this->accent_color,
            'competencies' => $this->competencies ?? [],
            'careers' => $this->careers ?? [],
            'facility_title' => $this->facility_title,
            'facilities' => collect($this->facilities ?? [])
                ->map(fn (array $item) => [...$item, 'image' => $this->formatImageUrl($item['image'] ?? null)])
                ->all(),
            'partners' => collect($this->partners ?? [])
                ->map(fn (array $item) => [...$item, 'logo' => $this->formatImageUrl($item['logo'] ?? null)])
                ->all(),
            'lab_room_slug' => $this->lab_room_slug,
            'is_published' => (bool) $this->is_published,
            'sort_order' => (int) $this->sort_order,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
