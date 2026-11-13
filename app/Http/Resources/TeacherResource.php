<?php

namespace App\Http\Resources;

use App\Enums\TeacherGroupEnum;
use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
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
            'position' => $this->position,
            'group' => $this->group,
            'group_label' => TeacherGroupEnum::tryFrom($this->group)?->label() ?? $this->group,
            'subject' => $this->subject,
            'photo' => $this->formatImageUrl($this->photo),
            'is_published' => (bool) $this->is_published,
            'sort_order' => (int) $this->sort_order,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
