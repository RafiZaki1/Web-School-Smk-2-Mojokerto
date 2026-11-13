<?php

namespace App\Http\Requests;

class SiteContentRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi isi konten halaman.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'value' => ['required', 'array'],
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
            'value.required' => 'Isi konten wajib diisi.',
            'value.array' => 'Isi konten harus berupa data terstruktur.',
        ];
    }
}
