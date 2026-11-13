<?php

namespace App\Http\Requests;

use App\Enums\AdministrationStatusEnum;
use App\Enums\GraduationStatusEnum;
use App\Enums\SchoolClassEnum;
use Illuminate\Validation\Rule;

/**
 * Data satu siswa kelas XII. Saat ubah, kolom boleh dikirim sebagian (auto-save per sel tabel).
 */
class GraduateRequest extends ContentRequest
{
    /** @var array<int, string> */
    protected array $booleans = [];

    /**
     * Rapikan NISN dan nama kelas sebelum divalidasi, mis. "xii rpl 1" menjadi "XII RPL 1".
     */
    protected function prepareForValidation(): void
    {
        $normalized = [];

        if ($this->has('nisn')) {
            $normalized['nisn'] = preg_replace('/\D/', '', (string) $this->input('nisn'));
        }

        if ($this->has('class_name')) {
            $normalized['class_name'] = SchoolClassEnum::fromInput((string) $this->input('class_name'))?->value ?? $this->input('class_name');
        }

        $this->merge($normalized);
    }

    /**
     * Ambil aturan validasi data siswa.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'nisn' => [$this->requiredOnCreate(), 'digits_between:8,20', Rule::unique('graduates', 'nisn')->ignore($id)],
            'full_name' => [$this->requiredOnCreate(), 'string', 'max:255'],
            'birth_date' => [$this->requiredOnCreate(), 'date_format:Y-m-d', 'before:today'],
            'class_name' => [$this->requiredOnCreate(), Rule::enum(SchoolClassEnum::class)],
            'graduation_year' => [$this->requiredOnCreate(), 'integer', 'between:2000,2100'],
            'status' => [$this->requiredOnCreate(), Rule::enum(GraduationStatusEnum::class)],
            'administration_status' => [$this->requiredOnCreate(), Rule::enum(AdministrationStatusEnum::class)],
            'note' => ['nullable', 'string', 'max:2000'],
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
            'nisn.unique' => 'NISN ini sudah terdaftar.',
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'full_name.max' => 'Nama lengkap maksimal :max karakter.',
            'birth_date.required' => 'Tanggal lahir wajib diisi.',
            'birth_date.date_format' => 'Tanggal lahir harus berformat tahun-bulan-tanggal.',
            'birth_date.before' => 'Tanggal lahir harus sebelum hari ini.',
            'class_name.required' => 'Kelas wajib dipilih.',
            'class_name.enum' => 'Kelas harus salah satu dari 12 kelas XII.',
            'graduation_year.required' => 'Tahun lulus wajib diisi.',
            'graduation_year.integer' => 'Tahun lulus harus berupa angka.',
            'graduation_year.between' => 'Tahun lulus harus antara :min dan :max.',
            'status.required' => 'Status kelulusan wajib dipilih.',
            'status.enum' => 'Status kelulusan harus Lulus atau Ditunda.',
            'administration_status.required' => 'Status administrasi wajib dipilih.',
            'administration_status.enum' => 'Status administrasi harus Beres atau Belum.',
            'note.max' => 'Catatan maksimal :max karakter.',
        ];
    }
}
