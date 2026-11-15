<?php

namespace App\Http\Requests;

/**
 * Buka atau tutup portal siswa Bank Mini beserta pengumumannya.
 */
class StatusLayananRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi status layanan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'tutup' => ['required', 'boolean'],
            'pesan' => ['nullable', 'string', 'max:300'],
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
            'tutup.required' => 'Pilih buka atau tutup.',
            'tutup.boolean' => 'Status layanan tidak valid.',
            'pesan.string' => 'Pengumuman harus berupa teks.',
            'pesan.max' => 'Pengumuman maksimal :max karakter.',
        ];
    }
}
