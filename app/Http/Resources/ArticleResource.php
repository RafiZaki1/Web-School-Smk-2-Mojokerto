<?php

namespace App\Http\Resources;

use App\Helpers\DateLabel;
use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ArticleResource extends JsonResource
{
    use FormatsImageUrl;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $paragraphs = array_values(array_filter(array_map('trim', preg_split('/\R{2,}/', (string) $this->body))));

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => $this->category,
            'author' => $this->author,
            'published_at' => $this->published_at?->toDateString(),
            'published_label' => DateLabel::long($this->published_at),
            'cover_image' => $this->formatImageUrl($this->cover_image),
            'excerpt' => Str::limit($paragraphs[0] ?? '', 180),
            'body' => $this->body,
            'paragraphs' => $paragraphs,
            'gallery' => $this->formatImageUrls($this->gallery),
            'is_published' => (bool) $this->is_published,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
