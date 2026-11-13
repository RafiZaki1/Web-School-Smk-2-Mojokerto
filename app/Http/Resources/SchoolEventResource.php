<?php

namespace App\Http\Resources;

use App\Helpers\DateLabel;
use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class SchoolEventResource extends JsonResource
{
    use FormatsImageUrl;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $end = $this->ends_on ?? $this->starts_on;
        $today = now()->startOfDay();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => $this->category,
            'description' => $this->description,
            'excerpt' => Str::limit(trim((string) preg_split('/\R{2,}/', (string) $this->description)[0]), 160),
            'location' => $this->location,
            'starts_on' => $this->starts_on?->toDateString(),
            'ends_on' => $this->ends_on?->toDateString(),
            'date_label' => DateLabel::range($this->starts_on, $this->ends_on),
            'day' => $this->starts_on?->format('d'),
            'month_short' => $this->starts_on?->locale('id')->translatedFormat('M'),
            'year' => $this->starts_on?->format('Y'),
            'time_label' => $this->time_label,

            'status' => $this->starts_on?->gt($today) ? 'upcoming' : ($end?->gte($today) ? 'ongoing' : 'past'),
            'cover_image' => $this->formatImageUrl($this->cover_image),
            'is_published' => (bool) $this->is_published,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
