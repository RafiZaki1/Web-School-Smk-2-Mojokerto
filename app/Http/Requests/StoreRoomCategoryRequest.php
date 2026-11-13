<?php

namespace App\Http\Requests;

class StoreRoomCategoryRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi kategori ruangan baru.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:room_categories,slug'],
            'icon' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
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
            'name.required' => 'Nama kategori wajib diisi.',
            'name.string' => 'Nama kategori harus berupa teks.',
            'name.max' => 'Nama kategori maksimal :max karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal :max karakter.',
            'slug.unique' => 'Slug sudah digunakan kategori lain.',
            'icon.string' => 'Ikon harus berupa teks.',
            'icon.max' => 'Ikon maksimal :max karakter.',
            'is_active.boolean' => 'Status aktif harus berupa benar atau salah.',
        ];
    }
}
