<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlumniResource extends JsonResource
{
    use FormatsImageUrl;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'major_code' => $this->major_code,
            'graduation_year' => (int) $this->graduation_year,
            'career' => $this->career,
            'photo' => $this->formatImageUrl($this->photo),
            'is_featured' => (bool) $this->is_featured,
            'sort_order' => (int) $this->sort_order,
        ];
    }
}
