<?php

namespace App\Http\Requests;

class StoreMapNodeRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi titik (node) peta baru.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'x' => ['required', 'numeric', 'between:0,100'],
            'y' => ['required', 'numeric', 'between:0,100'],
            'is_walkable' => ['nullable', 'boolean'],
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
            'name.required' => 'Nama titik wajib diisi.',
            'name.string' => 'Nama titik harus berupa teks.',
            'name.max' => 'Nama titik maksimal :max karakter.',
            'x.required' => 'Koordinat X wajib diisi.',
            'x.numeric' => 'Koordinat X harus berupa angka.',
            'x.between' => 'Koordinat X harus antara :min sampai :max.',
            'y.required' => 'Koordinat Y wajib diisi.',
            'y.numeric' => 'Koordinat Y harus berupa angka.',
            'y.between' => 'Koordinat Y harus antara :min sampai :max.',
            'is_walkable.boolean' => 'Status dapat dilalui harus berupa benar atau salah.',
        ];
    }
}
