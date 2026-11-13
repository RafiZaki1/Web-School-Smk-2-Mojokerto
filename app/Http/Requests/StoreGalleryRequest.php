<?php

namespace App\Http\Requests;

class StoreGalleryRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi foto galeri baru.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'category' => ['nullable', 'string', 'max:100'],
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
            'title.required' => 'Judul foto wajib diisi.',
            'title.string' => 'Judul foto harus berupa teks.',
            'title.max' => 'Judul foto maksimal :max karakter.',
            'image.required' => 'Foto wajib diunggah.',
            'image.image' => 'Berkas harus berupa gambar.',
            'image.mimes' => 'Foto harus berformat JPG, PNG, atau WEBP.',
            'image.max' => 'Ukuran foto maksimal 5 MB.',
            'category.string' => 'Kategori harus berupa teks.',
            'category.max' => 'Kategori maksimal :max karakter.',
            'is_active.boolean' => 'Status tampil harus berupa benar atau salah.',
            'sort_order.integer' => 'Urutan harus berupa angka.',
        ];
    }
}
