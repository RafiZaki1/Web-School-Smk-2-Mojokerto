<?php

return [

    /*
     * Iuran bulanan Rp 225.000 dibagi otomatis: Rp 175.000 SPP + Rp 50.000 tabungan.
     * Ubah lewat .env bila komite sekolah menetapkan nominal baru; tagihan yang sudah
     * dibuat tidak ikut berubah karena nominal disalin ke tiap baris tagihan_spp.
     */
    'nominal_spp' => (int) env('BANK_MINI_NOMINAL_SPP', 175000),
    'nominal_tabungan' => (int) env('BANK_MINI_NOMINAL_TABUNGAN', 50000),

    // Tanggal jatuh tempo tiap bulan tagihan.
    'tanggal_jatuh_tempo' => (int) env('BANK_MINI_TANGGAL_JATUH_TEMPO', 10),

    'gateway' => [
        // Masa berlaku kode bayar Tripay. Setelah lewat, bulan yang terkunci "pending" dilepas lagi.
        'expiry_hours' => (int) env('BANK_MINI_GATEWAY_EXPIRY_HOURS', 24),

        // Tripay mewajibkan customer_email. Siswa belum punya email di data sekolah,
        // jadi dipakai email Bank Mini/TU; bukti bayar tetap tampil di portal siswa.
        'customer_email' => env('BANK_MINI_CUSTOMER_EMAIL', 'tu@smkn2mojokerto.sch.id'),
    ],

];
