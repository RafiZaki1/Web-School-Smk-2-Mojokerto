<?php

namespace App\Http\Resources;

use App\Enums\AlumniServiceStatusEnum;
use App\Enums\AlumniServiceTypeEnum;
use App\Models\AlumniServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Status pengajuan untuk perangkat pengaju sendiri (lonceng dan halaman layanan alumni).
 * NISN dan nomor HP tidak dikirim balik.
 *
 * @mixin AlumniServiceRequest
 */
class AlumniServiceTrackResource extends JsonResource
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
            'ticket_code' => $this->ticket_code,
            'full_name' => $this->full_name,
            'class_name' => $this->class_name,
            'service_type' => $this->service_type,
            'service_type_label' => AlumniServiceTypeEnum::tryFrom((string) $this->service_type)?->label(),
            'status' => $this->status,
            'status_label' => AlumniServiceStatusEnum::tryFrom((string) $this->status)?->label(),
            'admin_note' => $this->admin_note,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
