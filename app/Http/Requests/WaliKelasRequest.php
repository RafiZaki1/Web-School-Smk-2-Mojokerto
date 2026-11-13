<?php

namespace App\Http\Requests;

class WaliKelasRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi akun wali kelas. Password wajib hanya saat akun baru dibuat
     * (dicek di controller karena bergantung pada data yang sudah ada).
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'teacher_id' => ['nullable', 'integer', 'exists:teachers,id'],
            'nama' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'min:4', 'max:50', 'alpha_dash:ascii'],
            'password' => ['nullable', 'string', 'min:8', 'max:255'],
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
            'teacher_id.integer' => 'Guru tidak valid.',
            'teacher_id.exists' => 'Guru tidak ditemukan di data guru.',
            'nama.required' => 'Nama wali kelas wajib diisi.',
            'nama.string' => 'Nama wali kelas harus berupa teks.',
            'nama.max' => 'Nama wali kelas maksimal :max karakter.',
            'username.required' => 'Username wajib diisi.',
            'username.string' => 'Username harus berupa teks.',
            'username.min' => 'Username minimal :min karakter.',
            'username.max' => 'Username maksimal :max karakter.',
            'username.alpha_dash' => 'Username hanya boleh huruf, angka, tanda minus, dan garis bawah.',
            'password.string' => 'Password harus berupa teks.',
            'password.min' => 'Password minimal :min karakter.',
            'password.max' => 'Password maksimal :max karakter.',
        ];
    }
}
