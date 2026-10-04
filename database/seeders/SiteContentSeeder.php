<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

/**
 * Konten halaman semi-statis (dulu frontend-next/lib/data/*). Struktur tiap
 * nilai mengikuti komponen FE yang memakainya.
 */
class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            'kontak' => [
                'telepon' => '(0321) 387-356',
                'whatsapp' => '0857-3050-2173',
                'email' => 'smkn2mr@gmail.com',
            ],

            'mitra' => [
                'items' => [
                    ['name' => 'Mandiri Taspen', 'logo' => '/images/mitra/mandiri-taspen.svg', 'height' => 'h-14 sm:h-16 lg:h-20'],
                    ['name' => 'BPJS Ketenagakerjaan', 'logo' => '/images/mitra/bpjs-ketenagakerjaan.svg', 'height' => 'h-14 sm:h-16 lg:h-20'],
                    ['name' => 'Bank Muamalat', 'logo' => '/images/mitra/bank-muamalat.svg', 'height' => 'h-14 sm:h-16 lg:h-20'],
                    ['name' => 'BAZNAS Kota Mojokerto', 'logo' => '/images/mitra/baznas-mojokerto.svg', 'height' => 'h-16 sm:h-20 lg:h-24'],
                    ['name' => 'Hummatech', 'logo' => '/images/mitra/hummatech.svg', 'height' => 'h-14 sm:h-16 lg:h-20'],
                    ['name' => 'Otak Kanan', 'logo' => '/images/mitra/otak-kanan.svg', 'height' => 'h-14 sm:h-16 lg:h-20'],
                    ['name' => 'Family Food', 'logo' => '/images/mitra/family-food.svg', 'height' => 'h-14 sm:h-16 lg:h-20'],
                ],
            ],

            'bkk' => [
                'visi' => 'Menjadi pusat layanan ketenagakerjaan yang profesional, terpercaya, dan berdaya saing global dalam menjembatani lulusan dengan dunia industri.',
                'misi' => [
                    'Menyediakan informasi lowongan kerja yang terkini dan sesuai kompetensi siswa.',
                    'Menjalin kerja sama berkelanjutan dengan dunia usaha dan dunia industri.',
                    'Meningkatkan daya saing lulusan sesuai kebutuhan kerja modern.',
                    'Memberikan layanan penyaluran kerja yang transparan dan profesional.',
                ],
                'mitra' => ['PT. Indomobil Griya', 'PT. Cokeniat Kawan', 'PT. Kartikaart', 'PT. Hasana Teknologi Indonesia', 'MikroTik Tech', 'Top Sol'],
                'rekrut' => [
                    ['nama' => 'Deswita Amanda N.', 'kelas' => 'XII RPL 1', 'perusahaan' => 'PT Pixel Studio Indonesia', 'foto' => '/images/bkk/rekrut-1.jpg'],
                    ['nama' => 'Muhammad Daffa D.', 'kelas' => 'XII RPL 1', 'perusahaan' => 'PT Pixel Studio Indonesia', 'foto' => '/images/bkk/rekrut-2.jpg'],
                    ['nama' => 'Jihan Salma R.S', 'kelas' => 'XII RPL 2', 'perusahaan' => 'PT Laskar Buah Indonesia', 'foto' => '/images/bkk/rekrut-3.jpg'],
                    ['nama' => 'Aditya Wahyu H.', 'kelas' => 'XII RPL 3', 'perusahaan' => 'PT Topsel Raharja Indonesia', 'foto' => '/images/bkk/rekrut-4.jpg'],
                ],
                'kontak' => [
                    'telepon' => '(0321) 387-356',
                    'whatsapp' => '0857-3050-2173',
                    'email' => 'bkk.smkn2mr@gmail.com',
                ],
            ],

            'spmb' => [
                'jalur' => [
                    [
                        'id' => 'pra-pendaftaran',
                        'label' => 'Pra Pendaftaran',
                        'jadwal' => [
                            ['kegiatan' => 'Entry nilai rapor oleh kepala satuan pendidikan', 'tanggal' => '18 - 23 Mei', 'jam' => '-', 'tempat' => 'Sekolah asal'],
                            ['kegiatan' => 'Verifikasi nilai rapor oleh calon murid baru', 'tanggal' => '23 - 27 Mei', 'jam' => '-', 'tempat' => 'Online'],
                            ['kegiatan' => 'Pengambilan PIN oleh calon murid baru', 'tanggal' => '1 - 19 Juni', 'jam' => '00.01 - 21.00 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Verifikasi & validasi dokumen oleh operator sekolah', 'tanggal' => '1 - 20 Juni', 'jam' => 's.d 16.00 WIB', 'tempat' => 'Online/offline'],
                            ['kegiatan' => 'Latihan pendaftaran', 'tanggal' => '8 - 10 Juni', 'jam' => '09.00 - 16.00 WIB', 'tempat' => 'Online'],
                        ],
                    ],
                    [
                        'id' => 'afirmasi',
                        'label' => 'Afirmasi / Mutasi / Prestasi Lomba',
                        'jadwal' => [
                            ['kegiatan' => 'Pendaftaran', 'tanggal' => '18 - 23 Mei', 'jam' => '00.01 - 21.00 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Penutupan', 'tanggal' => '23 Mei', 'jam' => '21.00 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Verifikasi & validasi oleh sekolah tujuan', 'tanggal' => '26 - 30 Mei', 'jam' => 's.d 16.00 WIB', 'tempat' => 'Online/offline'],
                            ['kegiatan' => 'Pengumuman', 'tanggal' => '1 - 19 Juni', 'jam' => '09.00 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Cetak bukti penerimaan oleh calon murid baru', 'tanggal' => '1 - 20 Juni', 'jam' => '09.00 - 23.59 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Latihan daftar ulang di sekolah tujuan', 'tanggal' => '8 - 10 Juni', 'jam' => '09.00 - 16.00 WIB', 'tempat' => 'Sekolah tujuan'],
                        ],
                    ],
                    [
                        'id' => 'domisili',
                        'label' => 'Domisili SMK',
                        'jadwal' => [
                            ['kegiatan' => 'Pendaftaran', 'tanggal' => '25 - 26 Juni', 'jam' => '00.01 - 21.00 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Penutupan', 'tanggal' => '26 Juni', 'jam' => '21.00 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Pengumuman', 'tanggal' => '27 Juni', 'jam' => '08.00 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Cetak bukti penerimaan oleh calon murid baru', 'tanggal' => '27 Juni', 'jam' => '09.00 - 23.59 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Daftar ulang di sekolah tujuan', 'tanggal' => '27 - 29 Juni', 'jam' => '09.00 - 16.00 WIB', 'tempat' => 'Sekolah tujuan'],
                            ['kegiatan' => 'Pengumuman pemenuhan kuota', 'tanggal' => '30 Juni', 'jam' => '08.00 WIB', 'tempat' => 'Online'],
                        ],
                    ],
                    [
                        'id' => 'nilai-akademik',
                        'label' => 'Nilai Prestasi Akademik',
                        'jadwal' => [
                            ['kegiatan' => 'Pendaftaran', 'tanggal' => '1 - 2 Juli', 'jam' => '00.01 - 21.00 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Penutupan', 'tanggal' => '2 Juli', 'jam' => '21.00 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Pengumuman', 'tanggal' => '3 Juli', 'jam' => '08.00 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Cetak bukti penerimaan oleh calon murid baru', 'tanggal' => '3 Juli', 'jam' => '09.00 - 23.59 WIB', 'tempat' => 'Online'],
                            ['kegiatan' => 'Daftar ulang di sekolah tujuan', 'tanggal' => '3 - 4 Juli', 'jam' => '09.00 - 16.00 WIB', 'tempat' => 'Sekolah tujuan'],
                        ],
                    ],
                ],
                'nilai_tahun' => 2025,
                'nilai' => [
                    ['kompetensi' => 'Layanan Perbankan Syariah', 'terdekat' => '5.400 m', 'terjauh' => '150 m', 'terendah' => '87.90', 'tertinggi' => '89.60'],
                    ['kompetensi' => 'Desain Komunikasi Visual', 'terdekat' => '3.100 m', 'terjauh' => '400 m', 'terendah' => '88.70', 'tertinggi' => '89.70'],
                    ['kompetensi' => 'Agribisnis Pengolahan Hasil Pertanian', 'terdekat' => '1.600 m', 'terjauh' => '300 m', 'terendah' => '88.60', 'tertinggi' => '90.10'],
                    ['kompetensi' => 'Kuliner', 'terdekat' => '2.900 m', 'terjauh' => '850 m', 'terendah' => '87.80', 'tertinggi' => '89.90'],
                    ['kompetensi' => 'Rekayasa Perangkat Lunak', 'terdekat' => '2.400 m', 'terjauh' => '380 m', 'terendah' => '87.10', 'tertinggi' => '89.20'],
                ],
                'domisili' => [
                    ['label' => 'Domisili Kab./Kota Mojokerto', 'value' => 57, 'color' => '#1e40af'],
                    ['label' => 'Domisili Luar Mojokerto', 'value' => 43, 'color' => '#93c5fd'],
                ],
            ],

            'produk' => [
                'whatsapp' => '6285730502173',
                'items' => [
                    ['name' => 'Roti Isi Coklat Keju', 'price' => 'Rp 8.000', 'kategori' => 'Olahan Pangan', 'image' => '/images/produk/roti.jpg'],
                    ['name' => 'Ganep’s', 'price' => 'Rp 8.000', 'kategori' => 'Olahan Pangan', 'image' => '/images/produk/ganeps.jpg'],
                    ['name' => 'Risol', 'price' => 'Rp 8.000', 'kategori' => 'Olahan Pangan', 'image' => '/images/produk/risol.jpg'],
                    ['name' => 'Bei Mie : Mie Daun Murbei', 'price' => 'Rp 8.000', 'kategori' => 'Olahan Pangan', 'image' => '/images/produk/beimie.jpg'],
                ],
                'keunggulan' => [
                    ['icon' => 'graduation', 'title' => 'Karya siswa asli', 'text' => 'Diproduksi langsung dari praktik pembelajaran di sekolah'],
                    ['icon' => 'heart', 'title' => 'Mendukung pendidikan', 'text' => 'Hasil penjualan menunjang fasilitas belajar siswa'],
                    ['icon' => 'shield', 'title' => 'Kualitas terjaga', 'text' => 'Dibimbing langsung oleh guru pengampu kompetensi keahlian'],
                ],
            ],

            'sejarah' => [
                'intro' => [
                    'image' => '/images/sejarah/gedung.jpg',
                    'eyebrow' => 'Awal mula',
                    'title' => 'Berawal dari kebutuhan tenaga terampil',
                    'text' => 'SMK Negeri 2 Kota Mojokerto berdiri pada tahun 1978 sebagai jawaban atas kebutuhan tenaga kerja terampil di Kota Mojokerto dan sekitarnya. Sejak awal berdiri, sekolah ini berkomitmen menghadirkan pendidikan vokasi yang dekat dengan kebutuhan dunia usaha dan dunia industri (DUDI), sebuah semangat yang terus dijaga hingga saat ini.',
                ],
                'timeline' => [
                    ['year' => '2013', 'title' => 'Sekolah resmi didirikan', 'text' => 'Berdiri dengan beberapa jurusan awal untuk memenuhi kebutuhan tenaga kerja industri lokal.'],
                    ['year' => '2014', 'title' => 'Penempatan', 'text' => "SMKN 2 Kota Mojokerto menempati gedung baru di Jl. Pulorejo Kecamatan Prajuritkulon Kota Mojokerto yang diresmikan oleh Walikota Mojokerto Drs. H. Mas'ud Yunus."],
                    ['year' => '2014', 'title' => 'Meraih akreditasi "A"', 'text' => 'Diakui secara resmi sebagai sekolah dengan standar mutu pendidikan terbaik.'],
                    ['year' => '2026', 'title' => 'SMK Hebat, terus bertransformasi', 'text' => 'Kini menjadi pusat pendidikan vokasi rujukan dengan 900+ siswa aktif dan 5 program keahlian.', 'highlight' => true],
                ],
                'kepala_sekolah' => [
                    ['periode' => 'Periode I', 'tahun' => '1978-1990', 'foto' => null],
                    ['periode' => 'Periode II', 'tahun' => '1990-2005', 'foto' => '/images/sejarah/kepsek-2.jpg'],
                ],
            ],

            'fasilitas' => [
                'groups' => [
                    ['id' => 'rpl', 'title' => 'RPL — Rekayasa Perangkat Lunak', 'icon' => 'code', 'tone' => 'bg-[#3b82f6]', 'items' => [
                        ['title' => 'Lab Komputer', 'image' => '/images/fasilitas/rpl-1.jpg'],
                        ['title' => 'Lab Komputer', 'image' => '/images/fasilitas/rpl-2.jpg'],
                        ['title' => 'Lab Komputer', 'image' => '/images/fasilitas/rpl-3.jpg'],
                    ]],
                    ['id' => 'dkv', 'title' => 'DKV — Desain Komunikasi Visual', 'icon' => 'camera', 'tone' => 'bg-[#eab308]', 'items' => [
                        ['title' => 'Studio Fotografi', 'image' => '/images/fasilitas/dkv-1.jpg'],
                        ['title' => 'Lab Desain Grafis', 'image' => '/images/fasilitas/dkv-2.jpg'],
                        ['title' => 'Lab Desain Grafis', 'image' => '/images/fasilitas/dkv-3.jpg'],
                    ]],
                    ['id' => 'lps', 'title' => 'LPS — Lembaga Perbankan Syariah', 'icon' => 'bank', 'tone' => 'bg-[#ef4444]', 'items' => [
                        ['title' => 'Bank Mini', 'image' => '/images/fasilitas/lps-1.jpg'],
                        ['title' => 'Ruang Teller', 'image' => '/images/fasilitas/lps-2.jpg'],
                        ['title' => 'Lab Akuntansi', 'image' => '/images/fasilitas/lps-3.jpg'],
                    ]],
                    ['id' => 'aphp', 'title' => 'APHP — Agribisnis Pengolahan Hasil Pertanian', 'icon' => 'leaf', 'tone' => 'bg-[#22c55e]', 'items' => [
                        ['title' => 'Lab APHP', 'image' => '/images/fasilitas/aphp-1.jpg'],
                        ['title' => 'Lab APHP', 'image' => '/images/fasilitas/aphp-2.jpg'],
                    ]],
                    ['id' => 'tb', 'title' => 'TB — Tata Boga', 'icon' => 'utensils', 'tone' => 'bg-[#eab308]', 'items' => [
                        ['title' => 'Dapur Praktik', 'image' => '/images/fasilitas/tb-1.jpg'],
                        ['title' => 'Lab TB', 'image' => '/images/fasilitas/tb-2.jpg'],
                        ['title' => 'Ruang Pastry', 'image' => '/images/fasilitas/tb-3.jpg'],
                    ]],
                ],
            ],
        ];

        foreach ($contents as $key => $value) {
            SiteContent::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
