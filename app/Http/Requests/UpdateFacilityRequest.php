<?php

namespace App\Http\Requests;

class UpdateFacilityRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi pembaruan fasilitas pada ruangan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'quantity' => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
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
            'name.required' => 'Nama fasilitas wajib diisi.',
            'name.string' => 'Nama fasilitas harus berupa teks.',
            'name.max' => 'Nama fasilitas maksimal :max karakter.',
            'icon.string' => 'Ikon harus berupa teks.',
            'icon.max' => 'Ikon maksimal :max karakter.',
            'quantity.integer' => 'Jumlah harus berupa angka.',
            'quantity.min' => 'Jumlah minimal :min.',
            'description.string' => 'Deskripsi harus berupa teks.',
        ];
    }
}
