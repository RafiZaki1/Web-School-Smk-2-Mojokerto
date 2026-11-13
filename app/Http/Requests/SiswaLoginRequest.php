<?php

namespace App\Http\Requests;

class SiswaLoginRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi login siswa. Field bernama "username" (isinya NISN) supaya halaman
     * login maupun kodenya tidak memberi tahu bahwa akun siswa memakai NISN.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'max:255'],
            'remember' => ['nullable', 'boolean'],
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
            'username.required' => 'Username wajib diisi.',
            'username.string' => 'Username harus berupa teks.',
            'username.max' => 'Username maksimal :max karakter.',
            'password.required' => 'Password wajib diisi.',
            'password.string' => 'Password harus berupa teks.',
            'password.max' => 'Password maksimal :max karakter.',
            'remember.boolean' => 'Pilihan "ingat saya" tidak valid.',
        ];
    }
}
