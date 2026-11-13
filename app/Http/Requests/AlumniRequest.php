<?php

namespace App\Http\Requests;

use App\Rules\ImageOrPath;

class AlumniRequest extends ContentRequest
{
    /** @var array<int, string> */
    protected array $booleans = ['is_featured'];

    /**
     * Ambil aturan validasi data alumni.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'major_code' => [$this->requiredOnCreate(), 'string', 'max:30'],
            'graduation_year' => [$this->requiredOnCreate(), 'integer', 'min:1978', 'max:'.(now()->year + 1)],
            'career' => ['nullable', 'string', 'max:255'],
            'work_location' => ['nullable', 'string', 'max:120'],
            'testimonial' => ['nullable', 'string', 'max:600'],
            'rating' => ['nullable', 'integer', 'between:1,5'],
            'photo' => ['nullable', new ImageOrPath(2048)],
            'is_featured' => ['nullable', 'boolean'],
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
            'name.required' => 'Nama alumni wajib diisi.',
            'name.string' => 'Nama alumni harus berupa teks.',
            'name.max' => 'Nama alumni maksimal :max karakter.',
            'major_code.required' => 'Kode jurusan wajib diisi.',
            'major_code.string' => 'Kode jurusan harus berupa teks.',
            'major_code.max' => 'Kode jurusan maksimal :max karakter.',
            'graduation_year.required' => 'Tahun lulus wajib diisi.',
            'graduation_year.integer' => 'Tahun lulus harus berupa angka.',
            'graduation_year.min' => 'Tahun lulus minimal :min.',
            'graduation_year.max' => 'Tahun lulus maksimal :max.',
            'career.string' => 'Karier harus berupa teks.',
            'career.max' => 'Karier maksimal :max karakter.',
            'work_location.string' => 'Lokasi kerja harus berupa teks.',
            'work_location.max' => 'Lokasi kerja maksimal :max karakter.',
            'testimonial.string' => 'Testimoni harus berupa teks.',
            'testimonial.max' => 'Testimoni maksimal :max karakter.',
            'rating.integer' => 'Penilaian harus berupa angka.',
            'rating.between' => 'Penilaian harus antara :min sampai :max.',
            'is_featured.boolean' => 'Status unggulan harus berupa benar atau salah.',
            'sort_order.integer' => 'Urutan harus berupa angka.',
            'sort_order.min' => 'Urutan minimal :min.',
        ];
    }
}
