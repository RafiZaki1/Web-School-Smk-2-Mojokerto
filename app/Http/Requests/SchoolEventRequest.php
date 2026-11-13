<?php

namespace App\Http\Requests;

use App\Enums\SchoolEventCategoryEnum;
use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class SchoolEventRequest extends ContentRequest
{
    /**
     * Ambil aturan validasi data agenda sekolah.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', Rule::enum(SchoolEventCategoryEnum::class)],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'starts_on' => [$this->requiredOnCreate(), 'date_format:Y-m-d'],
            'ends_on' => ['nullable', 'date_format:Y-m-d', ...($this->filled('starts_on') ? ['after_or_equal:starts_on'] : [])],
            'time_label' => ['nullable', 'string', 'max:100'],
            'cover_image' => ['nullable', new ImageOrPath],
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
            'title.required' => 'Nama agenda wajib diisi.',
            'title.string' => 'Nama agenda harus berupa teks.',
            'title.max' => 'Nama agenda maksimal :max karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal :max karakter.',
            'category.enum' => 'Kategori yang dipilih tidak valid.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal :max karakter.',
            'starts_on.required' => 'Tanggal mulai wajib diisi.',
            'starts_on.date_format' => 'Tanggal mulai harus berformat tahun-bulan-tanggal (YYYY-MM-DD).',
            'ends_on.date_format' => 'Tanggal selesai harus berformat tahun-bulan-tanggal (YYYY-MM-DD).',
            'ends_on.after_or_equal' => 'Tanggal selesai tidak boleh sebelum tanggal mulai.',
            'time_label.string' => 'Keterangan waktu harus berupa teks.',
            'time_label.max' => 'Keterangan waktu maksimal :max karakter.',
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
            'title' => 'nama agenda',
            'category' => 'kategori',
            'starts_on' => 'tanggal mulai',
            'ends_on' => 'tanggal selesai',
            'time_label' => 'waktu',
            'cover_image' => 'foto sampul',
        ];
    }
}
