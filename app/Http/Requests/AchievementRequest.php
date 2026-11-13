<?php

namespace App\Http\Requests;

use App\Enums\AchievementCategoryEnum;
use App\Enums\AchievementLevelEnum;
use App\Enums\AchievementRankEnum;
use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class AchievementRequest extends ContentRequest
{
    /**
     * Ambil aturan validasi data prestasi.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'card_title' => ['nullable', 'string', 'max:255'],
            'rank' => [$this->requiredOnCreate(), Rule::enum(AchievementRankEnum::class)],
            'level' => [$this->requiredOnCreate(), Rule::enum(AchievementLevelEnum::class)],
            'category' => ['nullable', Rule::enum(AchievementCategoryEnum::class)],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'student_name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'student_class' => ['nullable', 'string', 'max:100'],
            'student_photo' => ['nullable', new ImageOrPath(2048)],
            'cover_image' => ['nullable', new ImageOrPath],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'location' => ['nullable', 'string', 'max:255'],
            'organizer' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'document' => ['nullable', ImageOrPath::document()],
            'testimonial' => ['nullable', 'array'],
            'testimonial.quote' => ['nullable', 'string', 'max:1000'],
            'testimonial.name' => ['nullable', 'string', 'max:255'],
            'testimonial.position' => ['nullable', 'string', 'max:255'],
            'gallery_title' => ['nullable', 'string', 'max:255'],
            'gallery_description' => ['nullable', 'string', 'max:1000'],
            'gallery' => ['nullable', 'array', 'max:20'],
            'gallery.*' => ['nullable', new ImageOrPath],
            'is_published' => ['nullable', 'boolean'],
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
            'title.required' => 'Judul prestasi wajib diisi.',
            'title.string' => 'Judul prestasi harus berupa teks.',
            'title.max' => 'Judul prestasi maksimal :max karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal :max karakter.',
            'card_title.string' => 'Judul kartu harus berupa teks.',
            'card_title.max' => 'Judul kartu maksimal :max karakter.',
            'rank.required' => 'Predikat wajib diisi.',
            'rank.enum' => 'Predikat yang dipilih tidak valid.',
            'level.required' => 'Tingkat wajib diisi.',
            'level.enum' => 'Tingkat yang dipilih tidak valid.',
            'category.enum' => 'Kategori yang dipilih tidak valid.',
            'subtitle.string' => 'Subjudul harus berupa teks.',
            'subtitle.max' => 'Subjudul maksimal :max karakter.',
            'student_name.required' => 'Nama siswa wajib diisi.',
            'student_name.string' => 'Nama siswa harus berupa teks.',
            'student_name.max' => 'Nama siswa maksimal :max karakter.',
            'student_class.string' => 'Kelas siswa harus berupa teks.',
            'student_class.max' => 'Kelas siswa maksimal :max karakter.',
            'start_date.date' => 'Tanggal mulai tidak valid.',
            'end_date.date' => 'Tanggal selesai tidak valid.',
            'end_date.after_or_equal' => 'Tanggal selesai tidak boleh sebelum tanggal mulai.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal :max karakter.',
            'organizer.string' => 'Penyelenggara harus berupa teks.',
            'organizer.max' => 'Penyelenggara maksimal :max karakter.',
            'summary.string' => 'Ringkasan harus berupa teks.',
            'summary.max' => 'Ringkasan maksimal :max karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'testimonial.array' => 'Testimoni harus berupa data terstruktur.',
            'testimonial.quote.string' => 'Kutipan testimoni harus berupa teks.',
            'testimonial.quote.max' => 'Kutipan testimoni maksimal :max karakter.',
            'testimonial.name.string' => 'Nama pemberi testimoni harus berupa teks.',
            'testimonial.name.max' => 'Nama pemberi testimoni maksimal :max karakter.',
            'testimonial.position.string' => 'Jabatan pemberi testimoni harus berupa teks.',
            'testimonial.position.max' => 'Jabatan pemberi testimoni maksimal :max karakter.',
            'gallery_title.string' => 'Judul galeri harus berupa teks.',
            'gallery_title.max' => 'Judul galeri maksimal :max karakter.',
            'gallery_description.string' => 'Deskripsi galeri harus berupa teks.',
            'gallery_description.max' => 'Deskripsi galeri maksimal :max karakter.',
            'gallery.array' => 'Galeri harus berupa daftar foto.',
            'gallery.max' => 'Galeri maksimal :max foto.',
            'is_published.boolean' => 'Status terbit harus berupa benar atau salah.',
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
            'title' => 'judul prestasi',
            'rank' => 'predikat',
            'level' => 'tingkat',
            'student_name' => 'nama siswa',
            'end_date' => 'tanggal selesai',
            'gallery.*' => 'foto galeri',
        ];
    }
}
