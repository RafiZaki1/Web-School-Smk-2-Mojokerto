<?php

namespace App\Http\Resources;

use App\Models\GraduationSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Pengaturan pengumuman kelulusan untuk dashboard TU.
 *
 * @mixin GraduationSetting
 */
class GraduationSettingResource extends JsonResource
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
            'active_year' => (int) $this->active_year,
            'release_mode' => $this->mode()->value,
            'release_mode_label' => $this->mode()->label(),
            'release_at' => $this->release_at?->toISOString(),
            'closed_message' => $this->closed_message,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
