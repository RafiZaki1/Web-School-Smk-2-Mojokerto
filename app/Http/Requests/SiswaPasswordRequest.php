<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class SiswaPasswordRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi ganti password siswa. Password baru tidak boleh sama dengan NISN.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'password_lama' => ['required', 'string', 'max:255'],
            'password_baru' => [
                'required', 'string', 'min:8', 'max:255', 'confirmed', 'different:password_lama',
                Rule::notIn([(string) $this->user('siswa')?->nisn]),
            ],
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
            'password_lama.required' => 'Password lama wajib diisi.',
            'password_lama.string' => 'Password lama harus berupa teks.',
            'password_lama.max' => 'Password lama maksimal :max karakter.',
            'password_baru.required' => 'Password baru wajib diisi.',
            'password_baru.string' => 'Password baru harus berupa teks.',
            'password_baru.min' => 'Password baru minimal :min karakter.',
            'password_baru.max' => 'Password baru maksimal :max karakter.',
            'password_baru.confirmed' => 'Konfirmasi password baru tidak sama.',
            'password_baru.different' => 'Password baru harus berbeda dari password lama.',
            'password_baru.not_in' => 'Password baru terlalu mudah ditebak. Gunakan kombinasi lain.',
        ];
    }
}
