<?php

namespace App\Http\Requests;

/**
 * Pesan atau pertanyaan dari pengunjung website lewat Buku Tamu.
 */
class GuestMessageRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi pesan buku tamu.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', 'required_without:phone'],
            'phone' => ['nullable', 'string', 'regex:/^[0-9+\-\s]{8,20}$/', 'required_without:email'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
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
            'name.required' => 'Nama wajib diisi.',
            'name.max' => 'Nama maksimal :max karakter.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal :max karakter.',
            'email.required_without' => 'Isi email atau nomor HP agar kami bisa membalas.',
            'phone.regex' => 'Nomor HP hanya boleh berisi angka, 8 sampai 20 digit.',
            'phone.required_without' => 'Isi email atau nomor HP agar kami bisa membalas.',
            'subject.required' => 'Subjek wajib diisi.',
            'subject.max' => 'Subjek maksimal :max karakter.',
            'message.required' => 'Pesan wajib diisi.',
            'message.min' => 'Pesan minimal :min karakter.',
            'message.max' => 'Pesan maksimal :max karakter.',
        ];
    }
}
