<?php

namespace App\Http\Requests;

use App\Enums\AlumniServiceStatusEnum;
use Illuminate\Validation\Rule;

/**
 * Auto-save tabel kerja TU: status dropdown atau catatan, dikirim per kolom.
 */
class UpdateAlumniServiceRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi perubahan pengajuan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'required', Rule::enum(AlumniServiceStatusEnum::class)],
            'admin_note' => ['sometimes', 'nullable', 'string', 'max:1000'],
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
            'status.required' => 'Status wajib dipilih.',
            'status.enum' => 'Status pengajuan tidak valid.',
            'admin_note.max' => 'Catatan maksimal :max karakter.',
        ];
    }
}
