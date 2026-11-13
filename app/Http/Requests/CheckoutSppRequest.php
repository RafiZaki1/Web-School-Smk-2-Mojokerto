<?php

namespace App\Http\Requests;

class CheckoutSppRequest extends ApiRequest
{
    /**
     * Ambil aturan validasi checkout SPP lewat payment gateway.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'tagihan_ids' => ['required', 'array', 'min:1', 'max:24'],
            'tagihan_ids.*' => ['required', 'integer', 'distinct', 'min:1'],
            'metode_pembayaran' => ['required', 'string', 'max:30', 'regex:/^[A-Z0-9_]+$/'],
            'email' => ['required', 'string', 'email:rfc', 'max:100'],
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
            'tagihan_ids.required' => 'Pilih minimal satu bulan yang akan dibayar.',
            'tagihan_ids.array' => 'Daftar bulan tidak valid.',
            'tagihan_ids.min' => 'Pilih minimal :min bulan.',
            'tagihan_ids.max' => 'Maksimal :max bulan dalam satu pembayaran.',
            'tagihan_ids.*.required' => 'Bulan tagihan tidak valid.',
            'tagihan_ids.*.integer' => 'Bulan tagihan tidak valid.',
            'tagihan_ids.*.distinct' => 'Ada bulan yang terpilih dua kali.',
            'tagihan_ids.*.min' => 'Bulan tagihan tidak valid.',
            'metode_pembayaran.required' => 'Pilih metode pembayaran terlebih dahulu.',
            'metode_pembayaran.string' => 'Metode pembayaran tidak valid.',
            'metode_pembayaran.max' => 'Metode pembayaran maksimal :max karakter.',
            'metode_pembayaran.regex' => 'Metode pembayaran tidak valid.',
            'email.required' => 'Isi email untuk menerima invoice pembayaran.',
            'email.string' => 'Email tidak valid.',
            'email.email' => 'Format email tidak valid, contoh: nama@gmail.com.',
            'email.max' => 'Email maksimal :max karakter.',
        ];
    }
}
