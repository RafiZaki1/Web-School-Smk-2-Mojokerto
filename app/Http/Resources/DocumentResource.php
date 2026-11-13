<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Number;

class DocumentResource extends JsonResource
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
            'category' => $this->category,
            'description' => $this->description,
            'file' => $this->formatImageUrl($this->file),

            'download_url' => url("/api/v1/public/documents/{$this->slug}/download"),
            'file_type' => $this->file_type ?: strtolower(pathinfo((string) $this->file, PATHINFO_EXTENSION)) ?: null,
            'file_size' => $this->file_size,
            'file_size_label' => $this->file_size ? Number::fileSize($this->file_size, precision: 1) : null,
            'download_count' => (int) $this->download_count,
            'is_published' => (bool) $this->is_published,
            'sort_order' => (int) $this->sort_order,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_label' => $this->updated_at?->locale('id')->translatedFormat('j M Y'),
        ];
    }
}
