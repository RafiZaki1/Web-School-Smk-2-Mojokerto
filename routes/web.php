<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'SMK Negeri 2 Kota Mojokerto - School Portal API',
        'status' => 'online',
        'version' => '1.0.0',
        'frontend' => 'Next.js (frontend-next)',
    ]);
});

// Portal Bank Mini & Pembayaran SPP (Blade + sesi siswa/petugas).
require __DIR__.'/bank-mini.php';
