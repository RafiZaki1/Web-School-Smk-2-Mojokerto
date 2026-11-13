<?php

namespace App\Http\Requests;

use App\Enums\AlumniServiceTypeEnum;
use App\Enums\SchoolClassEnum;
use Illuminate\Validation\Rule;

/**
 * Form publik layanan berkas alumni (tanpa login).
 */
class StoreAlumniServiceRequest extends ApiRequest
{
    /**
     * Rapikan NISN dan nama kelas sebelum divalidasi.
     */
    protected function prepareForValidation(): void
    {
        $this->merge(array_filter([
            'nisn' => $this->has('nisn') ? preg_replace('/\D/', '', (string) $this->input('nisn')) : null,
            'class_name' => $this->has('class_name') ? (SchoolClassEnum::fromInput((string) $this->input('class_name'))?->value ?? $this->input('class_name')) : null,
        ], fn ($value) => $value !== null));
    }

    /**
     * Ambil aturan validasi pengajuan layanan alumni.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nisn' => ['required', 'digits_between:8,20'],
            'full_name' => ['required', 'string', 'max:255'],
            'graduation_year' => ['required', 'integer', 'between:2000,'.(now()->year + 1)],
            'class_name' => ['required', Rule::enum(SchoolClassEnum::class)],
            'service_type' => ['required', Rule::enum(AlumniServiceTypeEnum::class)],
            'purpose' => ['required', 'string', 'min:5', 'max:1000'],
            'phone' => ['nullable', 'string', 'regex:/^[0-9+\-\s]{8,20}$/'],
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
            'nisn.required' => 'NISN wajib diisi.',
            'nisn.digits_between' => 'NISN harus :min sampai :max digit angka.',
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'full_name.max' => 'Nama lengkap maksimal :max karakter.',
            'graduation_year.required' => 'Tahun lulus wajib diisi.',
            'graduation_year.integer' => 'Tahun lulus harus berupa angka.',
            'graduation_year.between' => 'Tahun lulus harus antara :min dan :max.',
            'class_name.required' => 'Kelas terakhir wajib dipilih.',
            'class_name.enum' => 'Kelas terakhir harus salah satu dari 12 kelas XII.',
            'service_type.required' => 'Jenis layanan wajib dipilih.',
            'service_type.enum' => 'Jenis layanan tidak valid.',
            'purpose.required' => 'Keperluan wajib diisi.',
            'purpose.min' => 'Keperluan minimal :min karakter.',
            'purpose.max' => 'Keperluan maksimal :max karakter.',
            'phone.regex' => 'Nomor HP hanya boleh berisi angka, 8 sampai 20 digit.',
        ];
    }
}
