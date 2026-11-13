<?php

namespace App\Http\Resources;

use App\Enums\AlumniServiceStatusEnum;
use App\Enums\AlumniServiceTypeEnum;
use App\Enums\MajorCodeEnum;
use App\Models\AlumniServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Baris antrean layanan alumni untuk tabel kerja TU. Token perangkat tidak pernah dikirim.
 *
 * @mixin AlumniServiceRequest
 */
class AlumniServiceRequestResource extends JsonResource
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
            'ticket_code' => $this->ticket_code,
            'nisn' => $this->nisn,
            'full_name' => $this->full_name,
            'graduation_year' => (int) $this->graduation_year,
            'class_name' => $this->class_name,
            'major_code' => $this->major_code,
            'major_label' => MajorCodeEnum::tryFrom((string) $this->major_code)?->label(),
            'service_type' => $this->service_type,
            'service_type_label' => AlumniServiceTypeEnum::tryFrom((string) $this->service_type)?->label(),
            'purpose' => $this->purpose,
            'phone' => $this->phone,
            'status' => $this->status,
            'status_label' => AlumniServiceStatusEnum::tryFrom((string) $this->status)?->label(),
            'admin_note' => $this->admin_note,
            'processed_at' => $this->processed_at?->toISOString(),
            'approved_at' => $this->approved_at?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
