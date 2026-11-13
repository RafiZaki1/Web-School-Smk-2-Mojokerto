<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;

class BankMiniPetugasSeeder extends Seeder
{
    /**
     * Akun petugas loket Bank Mini, terpisah dari akun Tata Usaha. Email memakai domain
     * .invalid (tidak bisa menerima surel) karena kolom email wajib di tabel users.
     * Ganti password lewat BANK_MINI_PETUGAS_PASSWORD di .env sebelum seeding produksi.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['username' => 'bankmini'],
            [
                'name' => 'Petugas Bank Mini',
                'email' => 'petugas@bank-mini.invalid',
                'password' => env('BANK_MINI_PETUGAS_PASSWORD', 'bankmini123'),
                'role' => RoleEnum::PETUGAS_BANK_MINI->value,
            ]
        );
    }
}
