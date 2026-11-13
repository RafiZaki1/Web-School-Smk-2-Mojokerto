<?php

namespace App\Http\Resources;

use App\Enums\MajorCodeEnum;
use App\Http\Resources\Concerns\FormatsImageUrl;
use App\Models\InternshipDocumentation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin InternshipDocumentation
 */
class InternshipDocumentationResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'image' => $this->formatImageUrl($this->image),
            'major_code' => $this->major_code,
            'major_label' => MajorCodeEnum::tryFrom((string) $this->major_code)?->label(),
            'industry_partner_id' => $this->industry_partner_id,
            'industry_partner' => $this->whenLoaded('industryPartner', fn () => $this->industryPartner?->name),
            'activity_date' => $this->activity_date?->format('Y-m-d'),
            'is_published' => (bool) $this->is_published,
            'sort_order' => (int) $this->sort_order,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
