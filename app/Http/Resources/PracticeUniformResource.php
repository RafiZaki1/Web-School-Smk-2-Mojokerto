<?php

namespace App\Http\Resources;

use App\Enums\MajorCodeEnum;
use App\Http\Resources\Concerns\FormatsImageUrl;
use App\Models\PracticeUniform;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PracticeUniform
 */
class PracticeUniformResource extends JsonResource
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
            'major_code' => $this->major_code,
            'major_label' => MajorCodeEnum::tryFrom((string) $this->major_code)?->label() ?? $this->major_code,
            'name' => $this->name,
            'description' => $this->description,
            'image' => $this->formatImageUrl($this->image),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
