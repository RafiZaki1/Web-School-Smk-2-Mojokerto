<?php

namespace App\Http\Requests;

use App\Enums\GuestMessageStatusEnum;
use Illuminate\Validation\Rule;

/**
 * Perubahan status dan catatan pesan buku tamu oleh TU (auto-save per kolom).
 */
class UpdateGuestMessageRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi perubahan pesan buku tamu.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'required', Rule::enum(GuestMessageStatusEnum::class)],
            'admin_note' => ['sometimes', 'nullable', 'string', 'max:2000'],
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
            'status.required' => 'Status pesan wajib dipilih.',
            'status.enum' => 'Status pesan tidak valid.',
            'admin_note.max' => 'Catatan maksimal :max karakter.',
        ];
    }
}
