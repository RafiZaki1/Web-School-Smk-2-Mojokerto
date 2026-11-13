<?php

namespace App\Http\Requests;

class GraduationCheckRequest extends ApiRequest
{
    /**
     * Rapikan NISN agar spasi atau tanda baca dari salinan tidak menggagalkan pencarian.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('nisn')) {
            $this->merge(['nisn' => preg_replace('/\D/', '', (string) $this->input('nisn'))]);
        }
    }

    /**
     * Ambil aturan validasi cek kelulusan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nisn' => ['required', 'digits_between:8,20'],
            'full_name' => ['required', 'string', 'min:3', 'max:255'],
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
            'nisn.required' => 'NISN wajib diisi.',
            'nisn.digits_between' => 'NISN harus :min sampai :max digit angka.',
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'full_name.min' => 'Nama lengkap minimal :min huruf.',
        ];
    }
}
