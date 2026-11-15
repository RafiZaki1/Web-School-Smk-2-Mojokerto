<?php

namespace App\Http\Requests;

/**
 * Kendali manual petugas/admin atas satu transaksi. Catatan wajib diisi (mis. bukti transfer
 * yang diperiksa atau alasan pembatalan) karena aksi ini melewati pencatatan otomatis Tripay.
 */
class VerifikasiPembayaranRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi keputusan pembayaran.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'catatan' => ['required', 'string', 'min:5', 'max:255'],
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
            'catatan.required' => 'Catatan wajib diisi.',
            'catatan.string' => 'Catatan harus berupa teks.',
            'catatan.min' => 'Catatan minimal :min karakter.',
            'catatan.max' => 'Catatan maksimal :max karakter.',
        ];
    }
}
