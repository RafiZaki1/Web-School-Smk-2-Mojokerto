<?php

namespace App\Http\Resources;

use App\Enums\GuestVisitStatusEnum;
use App\Models\GuestVisit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin GuestVisit
 */
class GuestVisitResource extends JsonResource
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
            'visitor_name' => $this->visitor_name,
            'institution' => $this->institution,
            'phone' => $this->phone,
            'purpose' => $this->purpose,
            'visit_date' => $this->visit_date?->format('Y-m-d'),
            'visit_time' => $this->visit_time ? substr((string) $this->visit_time, 0, 5) : null,
            'participants' => (int) $this->participants,
            'person_to_meet' => $this->person_to_meet,
            'status' => $this->status,
            'status_label' => GuestVisitStatusEnum::tryFrom((string) $this->status)?->label() ?? $this->status,
            'note' => $this->note,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
