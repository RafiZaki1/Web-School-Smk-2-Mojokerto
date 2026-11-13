<?php

namespace App\Http\Resources;

use App\Models\SchoolRule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SchoolRule
 */
class SchoolRuleResource extends JsonResource
{
    /**
     * Ubah data menjadi array respons API.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'section' => $this->section,
            'content' => $this->content,
            'is_active' => (bool) $this->is_active,
            'sort_order' => (int) $this->sort_order,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
