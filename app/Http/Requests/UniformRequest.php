<?php

namespace App\Http\Requests;

use App\Rules\ImageOrPath;

/**
 * Dipakai bersama jadwal seragam harian dan seragam praktik jurusan.
 * Barisnya tetap (5 hari, 5 jurusan), jadi hanya bisa diubah.
 */
class UniformRequest extends ContentRequest
{
    /** @var array<int, string> */
    protected array $booleans = [];

    /**
     * Ambil aturan validasi data seragam.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', new ImageOrPath(4096)],
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
            'name.required' => 'Nama seragam wajib diisi.',
            'name.max' => 'Nama seragam maksimal :max karakter.',
            'description.max' => 'Keterangan maksimal :max karakter.',
        ];
    }

    /**
     * Ambil nama atribut yang ramah untuk pesan galat.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return ['image' => 'foto seragam'];
    }
}
