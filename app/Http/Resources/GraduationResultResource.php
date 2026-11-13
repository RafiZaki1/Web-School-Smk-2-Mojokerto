<?php

namespace App\Http\Resources;

use App\Enums\AdministrationStatusEnum;
use App\Enums\GraduationStatusEnum;
use App\Enums\MajorCodeEnum;
use App\Models\Graduate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Hasil cek kelulusan untuk siswa yang bersangkutan. Tanggal lahir tidak dikirim balik.
 *
 * @mixin Graduate
 */
class GraduationResultResource extends JsonResource
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
            'nisn' => $this->nisn,
            'full_name' => $this->full_name,
            'class_name' => $this->class_name,
            'major_label' => MajorCodeEnum::tryFrom((string) $this->major_code)?->label(),
            'graduation_year' => (int) $this->graduation_year,
            'status' => $this->status,
            'status_label' => GraduationStatusEnum::tryFrom((string) $this->status)?->label(),
            'administration_status' => $this->administration_status,
            'administration_label' => AdministrationStatusEnum::tryFrom((string) $this->administration_status)?->label(),
            'note' => $this->note,
        ];
    }
}
