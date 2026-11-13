<?php

namespace App\Http\Resources;

use App\Enums\MajorCodeEnum;
use App\Http\Resources\Concerns\FormatsImageUrl;
use App\Models\IndustryPartner;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin IndustryPartner
 */
class IndustryPartnerResource extends JsonResource
{
    use FormatsImageUrl;

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
            'name' => $this->name,
            'logo' => $this->formatImageUrl($this->logo),
            'major_codes' => $this->major_codes ?? [],
            'major_labels' => array_values(array_filter(array_map(fn ($code) => MajorCodeEnum::tryFrom($code)?->label(), $this->major_codes ?? []))),
            'city' => $this->city,
            'website' => $this->website,
            'description' => $this->description,
            'is_active' => (bool) $this->is_active,
            'sort_order' => (int) $this->sort_order,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
