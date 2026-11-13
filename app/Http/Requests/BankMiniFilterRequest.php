<?php

namespace App\Http\Requests;

use App\Enums\BankMini\MetodeBayarEnum;
use App\Enums\BankMini\StatusLunasFilterEnum;
use App\Enums\MajorCodeEnum;
use App\Enums\SchoolClassEnum;
use App\Rules\TahunAjaranRule;
use Illuminate\Validation\Rule;

/**
 * Filter query string halaman Bank Mini (tahun ajaran, kelas, jurusan, status lunas, rentang tanggal, metode).
 */
class BankMiniFilterRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi filter halaman.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'tahun' => ['nullable', 'string', new TahunAjaranRule],
            'kelas' => ['nullable', 'string', Rule::enum(SchoolClassEnum::class)],
            'dari' => ['nullable', 'date_format:Y-m-d'],
            'sampai' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:dari'],
            'metode' => ['nullable', 'string', Rule::enum(MetodeBayarEnum::class)],
            'jurusan' => ['nullable', 'string', Rule::enum(MajorCodeEnum::class)],
            'status' => ['nullable', 'string', Rule::enum(StatusLunasFilterEnum::class)],
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
            'tahun.string' => 'Tahun ajaran harus berupa teks.',
            'kelas.string' => 'Kelas harus berupa teks.',
            'kelas.enum' => 'Kelas tidak dikenal.',
            'dari.date_format' => 'Tanggal awal harus berformat :format.',
            'sampai.date_format' => 'Tanggal akhir harus berformat :format.',
            'sampai.after_or_equal' => 'Tanggal akhir tidak boleh sebelum tanggal awal.',
            'metode.string' => 'Metode harus berupa teks.',
            'metode.enum' => 'Metode pembayaran tidak dikenal.',
            'jurusan.string' => 'Jurusan harus berupa teks.',
            'jurusan.enum' => 'Jurusan tidak dikenal.',
            'status.string' => 'Status harus berupa teks.',
            'status.enum' => 'Status pembayaran tidak dikenal.',
        ];
    }
}
