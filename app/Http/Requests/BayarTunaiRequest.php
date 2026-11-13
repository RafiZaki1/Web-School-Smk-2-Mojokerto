<?php

namespace App\Http\Requests;

class BayarTunaiRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi pembayaran tunai di loket Bank Mini.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'siswa_id' => ['required', 'integer', 'exists:siswa,id'],
            'tagihan_ids' => ['required', 'array', 'min:1', 'max:24'],
            'tagihan_ids.*' => ['required', 'integer', 'distinct', 'min:1'],
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
            'siswa_id.required' => 'Siswa wajib dipilih.',
            'siswa_id.integer' => 'Siswa tidak valid.',
            'siswa_id.exists' => 'Siswa tidak ditemukan.',
            'tagihan_ids.required' => 'Pilih minimal satu bulan yang dibayar.',
            'tagihan_ids.array' => 'Daftar bulan tidak valid.',
            'tagihan_ids.min' => 'Pilih minimal :min bulan.',
            'tagihan_ids.max' => 'Maksimal :max bulan dalam satu pembayaran.',
            'tagihan_ids.*.required' => 'Bulan tagihan tidak valid.',
            'tagihan_ids.*.integer' => 'Bulan tagihan tidak valid.',
            'tagihan_ids.*.distinct' => 'Ada bulan yang terpilih dua kali.',
            'tagihan_ids.*.min' => 'Bulan tagihan tidak valid.',
        ];
    }
}
