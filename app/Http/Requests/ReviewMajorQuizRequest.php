<?php

namespace App\Http\Requests;

class ReviewMajorQuizRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi koreksi hasil kuis jurusan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'final_major' => ['nullable', 'string', 'max:50'],
            'public_note' => ['nullable', 'string', 'max:2000'],
            'admin_note' => ['nullable', 'string', 'max:5000'],
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
            'final_major.string' => 'Jurusan akhir harus berupa teks.',
            'final_major.max' => 'Jurusan akhir maksimal :max karakter.',
            'public_note.string' => 'Catatan untuk siswa harus berupa teks.',
            'public_note.max' => 'Catatan untuk siswa maksimal :max karakter.',
            'admin_note.string' => 'Catatan internal harus berupa teks.',
            'admin_note.max' => 'Catatan internal maksimal :max karakter.',
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
            'final_major' => 'jurusan akhir',
            'public_note' => 'catatan untuk siswa',
            'admin_note' => 'catatan internal',
        ];
    }
}
