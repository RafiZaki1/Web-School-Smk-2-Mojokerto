<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            LandingPageSeeder::class,
            InteractiveMapSeeder::class,
            ContentSeeder::class,
            TeacherSeeder::class,
            SiteContentSeeder::class,

            // Modul Admin TU & Layanan Informasi Publik
            AdminTuSeeder::class,
            GraduationSeeder::class,
            AlumniServiceRequestSeeder::class,
            PartnershipSeeder::class,
            StudentGuideSeeder::class,
            GuestBookSeeder::class,
            PortalLinkSeeder::class,

            // Modul Bank Mini & Pembayaran SPP (akun siswa dari data kelulusan)
            BankMiniSeeder::class,
        ]);
    }
}
