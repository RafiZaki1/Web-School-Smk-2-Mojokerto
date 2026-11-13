<?php

namespace App\Http\Requests;

class StoreRoomRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi ruangan baru.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:rooms,slug'],
            'building_name' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:room_categories,id'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:5120'],
            'open_hours' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'map_x' => ['nullable', 'numeric', 'between:0,100'],
            'map_y' => ['nullable', 'numeric', 'between:0,100'],
            'map_width' => ['nullable', 'numeric', 'between:0,100'],
            'map_height' => ['nullable', 'numeric', 'between:0,100'],
            'map_node_id' => ['nullable', 'integer', 'exists:map_nodes,id'],
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
            'name.required' => 'Nama ruangan wajib diisi.',
            'name.string' => 'Nama ruangan harus berupa teks.',
            'name.max' => 'Nama ruangan maksimal :max karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal :max karakter.',
            'slug.unique' => 'Slug sudah digunakan ruangan lain.',
            'building_name.string' => 'Nama gedung harus berupa teks.',
            'building_name.max' => 'Nama gedung maksimal :max karakter.',
            'category_id.integer' => 'Kategori ruangan harus berupa angka.',
            'category_id.exists' => 'Kategori ruangan tidak ditemukan.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'image.image' => 'Foto ruangan harus berupa gambar.',
            'image.mimes' => 'Foto ruangan harus berformat JPG, PNG, WEBP, atau SVG.',
            'image.max' => 'Ukuran foto ruangan maksimal 5 MB.',
            'open_hours.string' => 'Jam operasional harus berupa teks.',
            'open_hours.max' => 'Jam operasional maksimal :max karakter.',
            'is_active.boolean' => 'Status aktif harus berupa benar atau salah.',
            'map_x.numeric' => 'Posisi X pada peta harus berupa angka.',
            'map_x.between' => 'Posisi X pada peta harus antara :min sampai :max.',
            'map_y.numeric' => 'Posisi Y pada peta harus berupa angka.',
            'map_y.between' => 'Posisi Y pada peta harus antara :min sampai :max.',
            'map_width.numeric' => 'Lebar pada peta harus berupa angka.',
            'map_width.between' => 'Lebar pada peta harus antara :min sampai :max.',
            'map_height.numeric' => 'Tinggi pada peta harus berupa angka.',
            'map_height.between' => 'Tinggi pada peta harus antara :min sampai :max.',
            'map_node_id.integer' => 'Titik peta harus berupa angka.',
            'map_node_id.exists' => 'Titik peta tidak ditemukan.',
        ];
    }
}
