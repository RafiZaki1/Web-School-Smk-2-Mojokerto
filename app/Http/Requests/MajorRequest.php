<?php

namespace App\Http\Requests;

use App\Rules\ImageOrPath;

class MajorRequest extends ContentRequest
{
    /**
     * Ambil aturan validasi data jurusan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'code' => [$this->requiredOnCreate(), 'string', 'max:30'],
            'name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'accreditation' => ['nullable', 'string', 'max:100'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', new ImageOrPath],
            'accent_color' => ['nullable', 'string', 'max:20'],
            'competencies' => ['nullable', 'array', 'max:20'],
            'competencies.*.icon' => ['nullable', 'string', 'max:50'],
            'competencies.*.title' => ['nullable', 'string', 'max:255'],
            'careers' => ['nullable', 'array', 'max:20'],
            'careers.*.icon' => ['nullable', 'string', 'max:50'],
            'careers.*.title' => ['nullable', 'string', 'max:255'],
            'careers.*.description' => ['nullable', 'string', 'max:500'],
            'facility_title' => ['nullable', 'string', 'max:255'],
            'facilities' => ['nullable', 'array', 'max:30'],
            'facilities.*.title' => ['nullable', 'string', 'max:255'],
            'facilities.*.image' => ['nullable', new ImageOrPath],
            'partners' => ['nullable', 'array', 'max:30'],
            'partners.*.name' => ['nullable', 'string', 'max:255'],
            'partners.*.logo' => ['nullable', new ImageOrPath(2048)],
            'lab_room_slug' => ['nullable', 'string', 'max:255'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
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
            'code.required' => 'Kode jurusan wajib diisi.',
            'code.string' => 'Kode jurusan harus berupa teks.',
            'code.max' => 'Kode jurusan maksimal :max karakter.',
            'name.required' => 'Nama jurusan wajib diisi.',
            'name.string' => 'Nama jurusan harus berupa teks.',
            'name.max' => 'Nama jurusan maksimal :max karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal :max karakter.',
            'tagline.string' => 'Tagline harus berupa teks.',
            'tagline.max' => 'Tagline maksimal :max karakter.',
            'accreditation.string' => 'Akreditasi harus berupa teks.',
            'accreditation.max' => 'Akreditasi maksimal :max karakter.',
            'summary.string' => 'Ringkasan harus berupa teks.',
            'summary.max' => 'Ringkasan maksimal :max karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'accent_color.string' => 'Warna aksen harus berupa teks.',
            'accent_color.max' => 'Warna aksen maksimal :max karakter.',
            'competencies.array' => 'Kompetensi harus berupa daftar.',
            'competencies.max' => 'Kompetensi maksimal :max item.',
            'competencies.*.icon.string' => 'Ikon kompetensi harus berupa teks.',
            'competencies.*.icon.max' => 'Ikon kompetensi maksimal :max karakter.',
            'competencies.*.title.string' => 'Judul kompetensi harus berupa teks.',
            'competencies.*.title.max' => 'Judul kompetensi maksimal :max karakter.',
            'careers.array' => 'Prospek karier harus berupa daftar.',
            'careers.max' => 'Prospek karier maksimal :max item.',
            'careers.*.icon.string' => 'Ikon prospek karier harus berupa teks.',
            'careers.*.icon.max' => 'Ikon prospek karier maksimal :max karakter.',
            'careers.*.title.string' => 'Judul prospek karier harus berupa teks.',
            'careers.*.title.max' => 'Judul prospek karier maksimal :max karakter.',
            'careers.*.description.string' => 'Deskripsi prospek karier harus berupa teks.',
            'careers.*.description.max' => 'Deskripsi prospek karier maksimal :max karakter.',
            'facility_title.string' => 'Judul fasilitas harus berupa teks.',
            'facility_title.max' => 'Judul fasilitas maksimal :max karakter.',
            'facilities.array' => 'Fasilitas harus berupa daftar.',
            'facilities.max' => 'Fasilitas maksimal :max item.',
            'facilities.*.title.string' => 'Nama fasilitas harus berupa teks.',
            'facilities.*.title.max' => 'Nama fasilitas maksimal :max karakter.',
            'partners.array' => 'Mitra harus berupa daftar.',
            'partners.max' => 'Mitra maksimal :max item.',
            'partners.*.name.string' => 'Nama mitra harus berupa teks.',
            'partners.*.name.max' => 'Nama mitra maksimal :max karakter.',
            'lab_room_slug.string' => 'Slug ruang lab harus berupa teks.',
            'lab_room_slug.max' => 'Slug ruang lab maksimal :max karakter.',
            'is_published.boolean' => 'Status terbit harus berupa benar atau salah.',
            'sort_order.integer' => 'Urutan harus berupa angka.',
            'sort_order.min' => 'Urutan minimal :min.',
        ];
    }

    /**
     * Ambil nama atribut yang ramah untuk pesan galat.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'code' => 'kode jurusan',
            'name' => 'nama jurusan',
            'image' => 'foto jurusan',
            'facilities.*.image' => 'foto fasilitas',
            'partners.*.logo' => 'logo mitra',
        ];
    }
}
