<?php

namespace App\Http\Requests;

class GraduateImportRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi unggahan file kelulusan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'extensions:xlsx,csv', 'max:5120'],
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
            'file.required' => 'Pilih file Excel (.xlsx) atau CSV terlebih dahulu.',
            'file.file' => 'File gagal diunggah, coba lagi.',
            'file.extensions' => 'File harus berformat .xlsx atau .csv.',
            'file.max' => 'Ukuran file maksimal 5 MB.',
        ];
    }
}
