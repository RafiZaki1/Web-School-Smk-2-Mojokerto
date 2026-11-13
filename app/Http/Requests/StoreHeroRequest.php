<?php

namespace App\Http\Requests;

class StoreHeroRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi banner beranda baru.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'school_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'background_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'button_text' => ['nullable', 'string', 'max:255'],
            'button_url' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
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
            'title.required' => 'Judul banner wajib diisi.',
            'title.string' => 'Judul banner harus berupa teks.',
            'title.max' => 'Judul banner maksimal :max karakter.',
            'school_name.required' => 'Nama sekolah wajib diisi.',
            'school_name.string' => 'Nama sekolah harus berupa teks.',
            'school_name.max' => 'Nama sekolah maksimal :max karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'background_image.image' => 'Latar belakang harus berupa gambar.',
            'background_image.mimes' => 'Latar belakang harus berformat JPG, PNG, atau WEBP.',
            'background_image.max' => 'Ukuran latar belakang maksimal 5 MB.',
            'button_text.string' => 'Teks tombol harus berupa teks.',
            'button_text.max' => 'Teks tombol maksimal :max karakter.',
            'button_url.string' => 'Tautan tombol harus berupa teks.',
            'button_url.max' => 'Tautan tombol maksimal :max karakter.',
            'is_active.boolean' => 'Status tampil harus berupa benar atau salah.',
            'sort_order.integer' => 'Urutan harus berupa angka.',
        ];
    }
}
