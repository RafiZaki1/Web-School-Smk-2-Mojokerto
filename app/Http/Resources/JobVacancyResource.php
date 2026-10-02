<?php

namespace App\Http\Resources;

use App\Helpers\DateLabel;
use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobVacancyResource extends JsonResource
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
            'title' => $this->title,
            'company' => $this->company,
            'location' => $this->location,
            'category' => $this->category,
            'employment_type' => $this->employment_type,
            'closes_at' => $this->closes_at?->toDateString(),
            'closes_label' => DateLabel::short($this->closes_at),
            'status' => $this->status,
            'poster' => $this->formatImageUrl($this->poster),
            'banner' => [
                'color' => $this->banner_color,
                'headline' => $this->banner_headline ?: $this->title,
                'subtitle' => $this->banner_subtitle ?: $this->company,
            ],
            'description' => $this->description,
            'responsibilities' => $this->responsibilities ?? [],
            'qualifications' => $this->qualifications ?? [],
            'contact_phone' => $this->contact_phone,
            'contact_email' => $this->contact_email,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
