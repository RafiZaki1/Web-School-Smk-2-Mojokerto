<?php

namespace App\Http\Resources;

use App\Helpers\DateLabel;
use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AchievementResource extends JsonResource
{
    use FormatsImageUrl;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $student = trim($this->student_name.($this->student_class ? ' '.$this->student_class : ''));

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'card_title' => $this->card_title ?: $this->title,
            'rank' => $this->rank,
            'level' => $this->level,
            'category' => $this->category,
            'subtitle' => $this->subtitle ?: "{$this->rank} • {$student}",
            'student_name' => $this->student_name,
            'student_class' => $this->student_class,
            'student_photo' => $this->formatImageUrl($this->student_photo),
            'cover_image' => $this->formatImageUrl($this->cover_image),
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'year' => $this->start_date?->year,
            'date_label' => DateLabel::monthYear($this->start_date),
            'date_range_label' => DateLabel::range($this->start_date, $this->end_date),
            'location' => $this->location,
            'organizer' => $this->organizer,
            'summary' => $this->summary,
            'description' => $this->description,
            'paragraphs' => $this->paragraphs($this->description),
            'document' => $this->formatImageUrl($this->document),
            'testimonial' => $this->testimonial,
            'gallery_title' => $this->gallery_title,
            'gallery_description' => $this->gallery_description,
            'gallery' => $this->formatImageUrls($this->gallery),
            'is_published' => (bool) $this->is_published,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /** Pecah teks per baris kosong menjadi paragraf. */
    protected function paragraphs(?string $text): array
    {
        return array_values(array_filter(array_map('trim', preg_split('/\R{2,}/', (string) $text))));
    }
}
