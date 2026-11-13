<?php

namespace App\Http\Requests;

use App\Enums\SchoolClassEnum;
use App\Rules\TahunAjaranRule;
use Illuminate\Validation\Rule;

class GenerateTagihanRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi pembuatan tagihan 12 bulan. Kelas kosong berarti semua kelas.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'tahun_ajaran' => ['required', 'string', new TahunAjaranRule],
            'kelas' => ['nullable', 'string', Rule::enum(SchoolClassEnum::class)],
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
            'tahun_ajaran.required' => 'Tahun ajaran wajib diisi.',
            'tahun_ajaran.string' => 'Tahun ajaran harus berupa teks.',
            'kelas.string' => 'Kelas harus berupa teks.',
            'kelas.enum' => 'Kelas tidak dikenal.',
        ];
    }
}
