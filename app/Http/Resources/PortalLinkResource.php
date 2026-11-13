<?php

namespace App\Http\Resources;

use App\Models\PortalLink;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PortalLink
 */
class PortalLinkResource extends JsonResource
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
            'key' => $this->key,
            'label' => $this->label,
            'url' => $this->url,
            'is_active' => (bool) $this->is_active,
            'sort_order' => (int) $this->sort_order,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
