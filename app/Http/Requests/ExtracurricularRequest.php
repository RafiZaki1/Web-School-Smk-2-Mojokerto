<?php

namespace App\Http\Requests;

use App\Rules\ImageOrPath;

class ExtracurricularRequest extends ContentRequest
{
    /**
     * Ambil aturan validasi data ekstrakurikuler.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:50'],
            'cover_image' => ['nullable', new ImageOrPath],
            'summary' => ['nullable', 'string', 'max:1000'],
            'schedule' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'members' => ['nullable', 'string', 'max:100'],
            'about_title' => ['nullable', 'string', 'max:255'],
            'about' => ['nullable', 'string'],
            'gallery_title' => ['nullable', 'string', 'max:255'],
            'gallery' => ['nullable', 'array', 'max:20'],
            'gallery.*' => ['nullable', new ImageOrPath],
            'achievements' => ['nullable', 'array', 'max:30'],
            'achievements.*' => ['nullable'],
            'testimonials' => ['nullable', 'array', 'max:10'],
            'testimonials.*.quote' => ['nullable', 'string', 'max:1000'],
            'testimonials.*.author' => ['nullable', 'string', 'max:255'],
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
            'name.required' => 'Nama ekstrakurikuler wajib diisi.',
            'name.string' => 'Nama ekstrakurikuler harus berupa teks.',
            'name.max' => 'Nama ekstrakurikuler maksimal :max karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal :max karakter.',
            'tagline.string' => 'Tagline harus berupa teks.',
            'tagline.max' => 'Tagline maksimal :max karakter.',
            'icon.string' => 'Ikon harus berupa teks.',
            'icon.max' => 'Ikon maksimal :max karakter.',
            'summary.string' => 'Ringkasan harus berupa teks.',
            'summary.max' => 'Ringkasan maksimal :max karakter.',
            'schedule.string' => 'Jadwal harus berupa teks.',
            'schedule.max' => 'Jadwal maksimal :max karakter.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal :max karakter.',
            'members.string' => 'Jumlah anggota harus berupa teks.',
            'members.max' => 'Jumlah anggota maksimal :max karakter.',
            'about_title.string' => 'Judul tentang harus berupa teks.',
            'about_title.max' => 'Judul tentang maksimal :max karakter.',
            'about.string' => 'Isi tentang harus berupa teks.',
            'gallery_title.string' => 'Judul galeri harus berupa teks.',
            'gallery_title.max' => 'Judul galeri maksimal :max karakter.',
            'gallery.array' => 'Galeri harus berupa daftar foto.',
            'gallery.max' => 'Galeri maksimal :max foto.',
            'achievements.array' => 'Pencapaian harus berupa daftar.',
            'achievements.max' => 'Pencapaian maksimal :max item.',
            'testimonials.array' => 'Testimoni harus berupa daftar.',
            'testimonials.max' => 'Testimoni maksimal :max item.',
            'testimonials.*.quote.string' => 'Kutipan testimoni harus berupa teks.',
            'testimonials.*.quote.max' => 'Kutipan testimoni maksimal :max karakter.',
            'testimonials.*.author.string' => 'Nama pemberi testimoni harus berupa teks.',
            'testimonials.*.author.max' => 'Nama pemberi testimoni maksimal :max karakter.',
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
            'name' => 'nama ekstrakurikuler',
            'cover_image' => 'foto sampul',
            'gallery.*' => 'foto dokumentasi',
        ];
    }
}
