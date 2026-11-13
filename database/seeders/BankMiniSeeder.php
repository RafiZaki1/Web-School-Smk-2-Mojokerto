<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class BankMiniSeeder extends Seeder
{
    /**
     * Buat akun petugas Bank Mini, lalu akun siswa dari data kelulusan angkatan aktif dengan password default NISN.
     * Tagihan tidak dibuat di sini; petugas membuatnya dari menu Generate Tagihan.
     */
    public function run(): void
    {
        $this->call(BankMiniPetugasSeeder::class);
        Artisan::call('bank-mini:sync-siswa', [], $this->command?->getOutput());
    }
}
