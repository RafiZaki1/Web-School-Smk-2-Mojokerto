<?php

namespace App\Http\Requests;

/**
 * Tahun lulus untuk aksi massal: arsipkan atau hapus satu angkatan.
 */
class GraduateYearRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi tahun lulus.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'year' => ['required', 'integer', 'between:2000,2100'],
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
            'year.required' => 'Tahun lulus wajib dipilih.',
            'year.integer' => 'Tahun lulus harus berupa angka.',
            'year.between' => 'Tahun lulus harus antara :min dan :max.',
        ];
    }
}
