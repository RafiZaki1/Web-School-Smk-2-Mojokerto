<?php

namespace Database\Seeders;

use App\Models\Gallery;
use App\Models\Hero;
use App\Models\SchoolProfile;
use Illuminate\Database\Seeder;

class LandingPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Hero::updateOrCreate(
            ['id' => 1],
            [
                'title' => 'Membangun Generasi Vokasi Unggul & Berakhlak Mulia',
                'school_name' => 'SMK NEGERI 2 KOTA MOJOKERTO',
                'description' => 'Mewujudkan pendidikan kejuruan berstandar industri dengan 4 program keahlian unggulan: RPL, DKV, APHP, dan Tata Boga.',
                'background_image' => null,
                'button_text' => 'Jelajahi Jurusan',
                'button_url' => '#jurusan',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        $galleries = [
            [
                'title' => 'Kegiatan Pembelajaran Berbasis Proyek (PjBL)',
                'image' => 'galleries/sample-activity-1.jpg',
                'category' => 'Kegiatan',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Juara 1 LKS Tingkat Provinsi Jawa Timur',
                'image' => 'galleries/sample-achievement-1.jpg',
                'category' => 'Prestasi',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Laboratorium Komputer & Studio DKV Modern',
                'image' => 'galleries/sample-facility-1.jpg',
                'category' => 'Fasilitas',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Praktik Dapur Kuliner Tata Boga & APHP',
                'image' => 'galleries/sample-activity-2.jpg',
                'category' => 'Kegiatan',
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($galleries as $gallery) {
            Gallery::firstOrCreate(
                ['title' => $gallery['title']],
                $gallery
            );
        }

        SchoolProfile::updateOrCreate(
            ['id' => 1],
            [
                'school_name' => 'SMK NEGERI 2 KOTA MOJOKERTO',
                'school_logo' => 'school-profile/logo.svg',
                'principal_name' => 'Drs. Akhmad Mukhlason, M.M.Pd.',
                'principal_position' => 'Kepala Sekolah',
                'principal_photo' => null,
                'welcome_message' => 'Selamat datang di website resmi SMK Negeri 2 Kota Mojokerto. Kami berkomitmen memberikan pengalaman belajar terbaik yang memadukan keunggulan kompetensi kejuruan, teknologi modern, dan penanaman budi pekerti luhur bagi seluruh peserta didik.',
                'background_image' => null,
                'established_year' => 2013,
            ]
        );
    }
}
