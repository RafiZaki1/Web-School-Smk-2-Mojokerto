<?php

namespace App\Http\Requests;

use App\Enums\JobCategoryEnum;
use App\Enums\JobEmploymentTypeEnum;
use App\Enums\JobVacancyStatusEnum;
use App\Rules\ImageOrPath;
use Illuminate\Validation\Rule;

class JobVacancyRequest extends ContentRequest
{
    /** @var array<int, string> */
    protected array $booleans = [];

    /**
     * Ambil aturan validasi data lowongan kerja.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'company' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', Rule::enum(JobCategoryEnum::class)],
            'employment_type' => ['nullable', Rule::enum(JobEmploymentTypeEnum::class)],
            'closes_at' => ['nullable', 'date'],
            'status' => ['nullable', Rule::enum(JobVacancyStatusEnum::class)],
            'poster' => ['nullable', new ImageOrPath],
            'banner_color' => ['nullable', 'string', 'max:20'],
            'banner_headline' => ['nullable', 'string', 'max:255'],
            'banner_subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'responsibilities' => ['nullable', 'array', 'max:30'],
            'responsibilities.*' => ['nullable', 'string', 'max:500'],
            'qualifications' => ['nullable', 'array', 'max:30'],
            'qualifications.*' => ['nullable', 'string', 'max:500'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:255'],
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
            'title.required' => 'Judul posisi wajib diisi.',
            'title.string' => 'Judul posisi harus berupa teks.',
            'title.max' => 'Judul posisi maksimal :max karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal :max karakter.',
            'company.required' => 'Nama perusahaan wajib diisi.',
            'company.string' => 'Nama perusahaan harus berupa teks.',
            'company.max' => 'Nama perusahaan maksimal :max karakter.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal :max karakter.',
            'category.enum' => 'Kategori yang dipilih tidak valid.',
            'employment_type.enum' => 'Tipe pekerjaan yang dipilih tidak valid.',
            'closes_at.date' => 'Tanggal tutup tidak valid.',
            'status.enum' => 'Status yang dipilih tidak valid.',
            'banner_color.string' => 'Warna banner harus berupa teks.',
            'banner_color.max' => 'Warna banner maksimal :max karakter.',
            'banner_headline.string' => 'Judul banner harus berupa teks.',
            'banner_headline.max' => 'Judul banner maksimal :max karakter.',
            'banner_subtitle.string' => 'Subjudul banner harus berupa teks.',
            'banner_subtitle.max' => 'Subjudul banner maksimal :max karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'responsibilities.array' => 'Tanggung jawab harus berupa daftar.',
            'responsibilities.max' => 'Tanggung jawab maksimal :max item.',
            'responsibilities.*.string' => 'Setiap tanggung jawab harus berupa teks.',
            'responsibilities.*.max' => 'Setiap tanggung jawab maksimal :max karakter.',
            'qualifications.array' => 'Kualifikasi harus berupa daftar.',
            'qualifications.max' => 'Kualifikasi maksimal :max item.',
            'qualifications.*.string' => 'Setiap kualifikasi harus berupa teks.',
            'qualifications.*.max' => 'Setiap kualifikasi maksimal :max karakter.',
            'contact_phone.string' => 'Nomor kontak harus berupa teks.',
            'contact_phone.max' => 'Nomor kontak maksimal :max karakter.',
            'contact_email.email' => 'Email pelamar tidak valid.',
            'contact_email.max' => 'Email pelamar maksimal :max karakter.',
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
            'title' => 'judul posisi',
            'company' => 'nama perusahaan',
            'closes_at' => 'tanggal tutup',
            'contact_email' => 'email pelamar',
        ];
    }
}
