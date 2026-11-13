<?php

namespace App\Http\Requests;

use App\Enums\GraduationReleaseModeEnum;
use Illuminate\Validation\Rule;

/**
 * Pengaturan pengumuman kelulusan. Dikirim per kolom oleh auto-save, jadi semua kolom opsional.
 * Kewajiban waktu rilis untuk mode Timer dicek controller setelah digabung dengan nilai tersimpan.
 */
class GraduationSettingRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi pengaturan kelulusan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'active_year' => ['sometimes', 'required', 'integer', 'between:2000,2100'],
            'release_mode' => ['sometimes', 'required', Rule::enum(GraduationReleaseModeEnum::class)],
            'release_at' => ['sometimes', 'nullable', 'date'],
            'closed_message' => ['sometimes', 'nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Ambil pesan galat kustom untuk setiap aturan validasi.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'active_year.required' => 'Tahun lulus angkatan aktif wajib diisi.',
            'active_year.integer' => 'Tahun lulus harus berupa angka.',
            'active_year.between' => 'Tahun lulus harus antara :min dan :max.',
            'release_mode.required' => 'Mode pengumuman wajib dipilih.',
            'release_mode.enum' => 'Mode pengumuman tidak valid.',
            'release_at.date' => 'Tanggal dan jam rilis tidak valid.',
            'closed_message.max' => 'Pesan maksimal :max karakter.',
        ];
    }
}
