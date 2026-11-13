<?php

namespace App\Http\Requests;

class RoomSearchRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi pencarian ruangan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'q' => ['required', 'string'],
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
            'q.required' => "Parameter pencarian 'q' wajib diisi.",
            'q.string' => "Parameter pencarian 'q' harus berupa teks.",
        ];
    }
}
