<?php

namespace App\Http\Resources;

use App\Enums\AdministrationStatusEnum;
use App\Enums\GraduationStatusEnum;
use App\Enums\MajorCodeEnum;
use App\Models\Graduate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Data siswa lengkap untuk tabel kerja TU (termasuk tanggal lahir).
 *
 * @mixin Graduate
 */
class GraduateResource extends JsonResource
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
            'nisn' => $this->nisn,
            'full_name' => $this->full_name,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'class_name' => $this->class_name,
            'major_code' => $this->major_code,
            'major_label' => MajorCodeEnum::tryFrom((string) $this->major_code)?->label(),
            'graduation_year' => (int) $this->graduation_year,
            'status' => $this->status,
            'status_label' => GraduationStatusEnum::tryFrom((string) $this->status)?->label(),
            'administration_status' => $this->administration_status,
            'administration_label' => AdministrationStatusEnum::tryFrom((string) $this->administration_status)?->label(),
            'note' => $this->note,
            'is_archived' => (bool) $this->is_archived,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
