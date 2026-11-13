<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminTuSeeder extends Seeder
{
    /**
     * Satu akun bersama Tata Usaha. Token Sanctum tidak dibatasi per akun,
     * jadi akun ini bisa login di beberapa perangkat sekaligus.
     * Ganti password lewat ADMIN_TU_PASSWORD di .env sebelum seeding produksi.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['username' => 'tu'],
            [
                'name' => 'Tata Usaha',
                'email' => 'tu@smkn2mojokerto.sch.id',
                'password' => env('ADMIN_TU_PASSWORD', 'tu12345'),
                'role' => RoleEnum::ADMIN_TU->value,
            ]
        );
    }
}
