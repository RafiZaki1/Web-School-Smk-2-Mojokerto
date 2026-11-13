<?php

namespace App\Http\Resources;

use App\Enums\UploadDirectoryEnum;
use App\Http\Resources\Concerns\FormatsImageUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteContentResource extends JsonResource
{
    use FormatsImageUrl;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->key,
            'value' => $this->withUrls($this->value ?? []),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Ubah path unggahan (site-contents/...) di dalam JSON menjadi URL penuh.
     *
     * @param  array<string, mixed>  $value
     * @return array<string, mixed>
     */
    protected function withUrls(array $value): array
    {
        return array_map(function ($item) {
            if (is_array($item)) {
                return $this->withUrls($item);
            }

            return is_string($item) && str_starts_with($item, UploadDirectoryEnum::SITE_CONTENTS->value.'/')
                ? $this->formatImageUrl($item)
                : $item;
        }, $value);
    }
}
