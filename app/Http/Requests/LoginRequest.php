<?php

namespace App\Http\Requests;

class LoginRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi login admin.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'login' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
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
            'login.required' => 'Username atau email wajib diisi.',
            'login.string' => 'Username atau email harus berupa teks.',
            'login.max' => 'Username atau email maksimal :max karakter.',
            'password.required' => 'Password wajib diisi.',
            'password.string' => 'Password harus berupa teks.',
        ];
    }
}
