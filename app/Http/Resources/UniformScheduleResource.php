<?php

namespace App\Http\Resources;

use App\Enums\WeekdayEnum;
use App\Http\Resources\Concerns\FormatsImageUrl;
use App\Models\UniformSchedule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin UniformSchedule
 */
class UniformScheduleResource extends JsonResource
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
            'day' => $this->day,
            'day_label' => WeekdayEnum::tryFrom((string) $this->day)?->label() ?? $this->day,
            'name' => $this->name,
            'description' => $this->description,
            'image' => $this->formatImageUrl($this->image),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
