<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Akun admin awal; ganti password lewat ADMIN_PASSWORD di .env sebelum seeding produksi.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Kang Admin',
                'email' => 'admin@smkn2mojokerto.sch.id',
                'password' => env('ADMIN_PASSWORD', 'admin12345'),
                'role' => 'admin',
            ]
        );
    }
}
