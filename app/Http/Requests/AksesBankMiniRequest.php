<?php

namespace App\Http\Requests;

use App\Enums\BankMini\TujuanPanelEnum;
use Illuminate\Validation\Rule;

/**
 * Permintaan tautan masuk panel Bank Mini dari Panel Admin utama.
 */
class AksesBankMiniRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi halaman tujuan.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'tujuan' => ['required', 'string', Rule::enum(TujuanPanelEnum::class)],
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
            'tujuan.required' => 'Halaman tujuan wajib dipilih.',
            'tujuan.string' => 'Halaman tujuan tidak valid.',
            'tujuan.enum' => 'Halaman tujuan tidak dikenal.',
        ];
    }
}
