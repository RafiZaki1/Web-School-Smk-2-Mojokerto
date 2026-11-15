<?php

namespace App\Http\Requests;

use App\Enums\BankMini\StatusTransaksiEnum;
use Illuminate\Validation\Rule;

/**
 * Filter query string halaman Pembayaran Masuk (status transaksi dan kata kunci).
 */
class PembayaranMasukFilterRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi filter halaman.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['nullable', 'string', Rule::enum(StatusTransaksiEnum::class)],
            'q' => ['nullable', 'string', 'max:64'],
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
            'status.string' => 'Status harus berupa teks.',
            'status.enum' => 'Status transaksi tidak dikenal.',
            'q.string' => 'Kata kunci harus berupa teks.',
            'q.max' => 'Kata kunci maksimal :max karakter.',
        ];
    }
}
