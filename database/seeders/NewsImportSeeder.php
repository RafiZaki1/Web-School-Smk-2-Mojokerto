<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

/**
 * Impor 4 berita terbaru dari situs penyedia (detik.com, majalahglobal.com,
 * kota-mojokerto.kpu.go.id, kabarterdepan.com). Teks + foto diekstrak
 * dari berita resmi dan disimpan di database/data/news/*.json.
 */
class NewsImportSeeder extends Seeder
{
    /**
     * Jalankan proses seeding berita dari berkas JSON sumber media.
     *
     * @return void
     */
    public function run(): void
    {
        // Hapus berita contoh lama bila masih ada di database
        Article::query()->whereIn('slug', [
            'siswa-gim-ciptakan-game-edukasi-ar',
            'belajar-teknologi-standar-global',
            'siswa-diterima-24-kampus-luar-negeri',
            'jadwal-libur-semester-genap',
            'pameran-karya-desain-dkv',
            'job-fair-bkk',
            'ukk-dkv-2024',
        ])->delete();

        $map = [
            'news_47c3d6.json' => [
                'slug' => 'police-goes-to-school-motivasi-pelajar-smk-mojokerto-siap-hadapi-dunia-kerja',
                'title' => 'Police Goes to School Motivasi Pelajar SMK Mojokerto Siap Hadapi Dunia Kerja',
                'category' => 'Agenda sekolah',
                'author' => 'Enggran Eko Budianto - detikJatim',
                'published_at' => '2026-08-24',
                'cover_image' => '/images/news/police-goes-to-school.webp',
            ],
            'news_cadad7.json' => [
                'slug' => 'siswa-baru-smkn-2-mojokerto-digembleng-5-hari-jadi-generasi-hebat-anti-korupsi-siap-kerja',
                'title' => 'Bukan Sekadar Kenalan! Siswa Baru SMKN 2 Kota Mojokerto Digembleng 5 Hari Jadi Generasi Hebat, Anti Korupsi, Siap Kerja',
                'category' => 'Agenda sekolah',
                'author' => 'Jayak Mardiansyah - majalahglobal.com',
                'published_at' => '2026-07-13',
                'cover_image' => '/images/news/mpls-2026.webp',
            ],
            'news_954ce9.json' => [
                'slug' => 'kpu-kota-mojokerto-terima-empat-siswa-pkl-dari-smkn-2-kota-mojokerto',
                'title' => 'KPU Kota Mojokerto Terima Empat Siswa PKL dari SMKN 2 Kota Mojokerto',
                'category' => 'Informasi umum',
                'author' => 'KPU Kota Mojokerto',
                'published_at' => '2026-04-06',
                'cover_image' => '/images/news/pkl-kpu.webp',
            ],
            'news_b7cd2c.json' => [
                'slug' => 'hut-kabar-terdepan-siswa-kuliner-smkn-2-kota-mojokerto-unjuk-kualitas',
                'title' => 'HUT ke-2 Kabar Terdepan, Siswa Kuliner SMKN 2 Kota Mojokerto Unjuk Kualitas',
                'category' => 'Karya siswa',
                'author' => 'Andy Yuwono - Kabar Terdepan',
                'published_at' => '2025-06-28',
                'cover_image' => '/images/news/hut-kabar-terdepan.webp',
            ],
        ];

        foreach ($map as $file => $meta) {
            $path = database_path('data/news/'.$file);
            if (! File::exists($path)) {
                $this->command?->error("File tidak ditemukan: {$path}");

                continue;
            }

            $data = json_decode(File::get($path), true);
            if (! is_array($data)) {
                $this->command?->error("JSON rusak: {$path}");

                continue;
            }

            $paragraphs = array_values(array_filter(array_map('trim', $data['paragraphs'] ?? $data['text'] ?? [])));

            Article::query()->updateOrCreate(
                ['slug' => $meta['slug']],
                [
                    'title' => $meta['title'],
                    'category' => $meta['category'],
                    'author' => $meta['author'],
                    'published_at' => $meta['published_at'],
                    'cover_image' => $meta['cover_image'],
                    'body' => implode("\n\n", $paragraphs),
                    'gallery' => [],
                    'is_published' => true,
                ]
            );

            $this->command?->line("<info>Disimpan</info>: {$meta['title']} ({$meta['category']})");
        }

        // Berita kelima: Puluhan Siswa SMK Negeri 2 Kota Mojokerto Lolos PTN lewat Jalur SNBP
        Article::query()->updateOrCreate(
            ['slug' => 'puluhan-siswa-smk-negeri-2-kota-mojokerto-lolos-ptn-lewat-jalur-snbp'],
            [
                'title' => 'Puluhan Siswa SMK Negeri 2 Kota Mojokerto Lolos PTN lewat Jalur SNBP',
                'category' => 'Prestasi',
                'author' => 'Radar Mojokerto',
                'published_at' => '2026-04-17',
                'cover_image' => '/images/news/lolos-ptn-snbp.webp',
                'body' => implode("\n\n", [
                    'Prestasi akademik membanggakan kembali diukir oleh SMK Negeri 2 Kota Mojokerto. Sebanyak 21 siswa kelas XII berhasil dinyatakan lolos masuk Perguruan Tinggi Negeri (PTN) terkemuka di Indonesia melalui jalur Seleksi Nasional Berdasarkan Prestasi (SNBP).',
                    'Capaian kelulusan jalur prestasi tahun ini menunjukkan tren peningkatan yang konsisten dibandingkan tahun-tahun sebelumnya, di mana pada tahun sebelumnya tercatat 14 siswa dan 11 siswa yang lolos melalui jalur tanpa tes tersebut. Hal ini membuktikan bahwa lulusan SMK tidak hanya siap terjun langsung ke dunia industri, tetapi juga memiliki daya saing akademik yang unggul untuk melanjutkan pendidikan tinggi.',
                    'Puluhan siswa SMKN 2 Kota Mojokerto yang lolos SNBP tersebut tersebar di berbagai PTN favorit, mulai dari Institut Teknologi Sepuluh Nopember (ITS), Universitas Airlangga (Unair), Universitas Brawijaya (UB), Universitas Negeri Surabaya (Unesa), UPN Veteran Jawa Timur, Universitas Trunojoyo Madura (UTM), hingga politeknik dan institut seni negeri seperti PENS, Polinema, Polije, Poliwangi, ISI Yogyakarta, dan ISI Surakarta.',
                    'Kepala SMKN 2 Kota Mojokerto, Drs. H. Iswahyudi, M.Pd., menyampaikan apresiasi dan rasa syukur atas keberhasilan para siswa serta kerja keras tim guru Bimbingan Konseling (BK) dan wali kelas yang telah mengawal pemetaan minat dan bakat siswa sejak semester awal.',
                    '"Kami sangat bersyukur dan bangga atas capaian anak-anak yang berhasil menembus PTN impian lewat jalur SNBP. Ini membuktikan bahwa kualitas pembelajaran di SMKN 2 Kota Mojokerto mampu mengantarkan siswa sukses baik untuk bekerja, melanjutkan kuliah di PTN unggulan, maupun berwirausaha," ungkap Iswahyudi.',
                    'Sumber: Radar Mojokerto (Jawa Pos Group) — https://radarmojokerto.jawapos.com/pendidikan/2404170002/puluhan-siswa-smk-negeri-2-kota-mojokerto-lolos-ptn-lewat-jalur-snbp',
                ]),
                'gallery' => [],
                'is_published' => true,
            ]
        );
    }
}
