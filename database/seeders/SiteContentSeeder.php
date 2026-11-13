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
                'items' => MitraList::semua(),
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
                    ['kompetensi' => 'Rekayasa Perangkat Lunak', 'rapor' => '85,20', 'tka' => '66,50', 'rata' => '77,72', 'terendah' => '72,10', 'tertinggi' => '91,24', 'di_atas_90' => 2],
                    ['kompetensi' => 'Desain Komunikasi Visual', 'rapor' => '84,60', 'tka' => '64,80', 'rata' => '76,68', 'terendah' => '71,35', 'tertinggi' => '90,18', 'di_atas_90' => 1],
                    ['kompetensi' => 'Layanan Perbankan Syariah', 'rapor' => '83,90', 'tka' => '61,40', 'rata' => '74,90', 'terendah' => '69,80', 'tertinggi' => '86,42', 'di_atas_90' => 0],
                    ['kompetensi' => 'Kuliner', 'rapor' => '83,40', 'tka' => '59,70', 'rata' => '73,92', 'terendah' => '68,95', 'tertinggi' => '85,76', 'di_atas_90' => 0],
                    ['kompetensi' => 'Agribisnis Pengolahan Hasil Pertanian', 'rapor' => '82,80', 'tka' => '58,20', 'rata' => '72,96', 'terendah' => '68,20', 'tertinggi' => '84,90', 'di_atas_90' => 0],
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
                    'title' => 'Sejarah singkat',
                    'text' => 'SMK Negeri 2 Kota Mojokerto (SKANEDA) berdiri sejak 24 Juni 2013 dan terus berkembang untuk mencetak lulusan vokasi yang kompeten dan berkarakter.',
                    'stats' => [
                        ['value' => '2013', 'label' => 'Tahun berdiri'],
                        ['value' => '2014', 'label' => 'Pindah ke gedung baru'],
                        ['value' => '5', 'label' => 'Bidang keahlian'],
                    ],
                    'awal' => [
                        ['label' => 'Tanggal berdiri', 'value' => '24 Juni 2013'],
                        ['label' => 'Dasar hukum', 'value' => 'SK Pendirian dan SK Ijin Operasional, nomor 188.45/630/417.111/2013'],
                        ['label' => 'Lokasi awal', 'value' => 'Gedung SMKN 1 Mojokerto, Jl. Kedungsari, Magersari'],
                        ['label' => 'Kepala sekolah pertama', 'value' => 'Drs. Harol Kristiandoko, M.T. (Plt.)'],
                        ['label' => 'Kompetensi awal', 'value' => 'Tata Boga (TB) dan Rekayasa Perangkat Lunak (RPL)'],
                    ],
                ],
                'timeline' => [
                    ['year' => '2013', 'title' => 'Sekolah berdiri', 'text' => '24 Juni 2013, dibuka dengan Tata Boga dan RPL.'],
                    ['year' => '2014', 'title' => 'Gedung baru', 'text' => '16 Januari 2014 di Jl. Pulorejo, Kota Mojokerto.'],
                    ['year' => '2014', 'title' => 'Jurusan bertambah', 'text' => 'DKV, APHP, dan Perbankan Syariah.'],
                    ['year' => 'Kini', 'title' => '5 bidang keahlian', 'text' => 'Pariwisata hingga bisnis manajemen.', 'highlight' => true],
                ],
                'kepala_sekolah' => [
                    ['nama' => 'Drs. Harol Kristiandoko, M.T.', 'periode' => '2014', 'keterangan' => 'Plt. saat sekolah diresmikan, sekaligus Kepala SMKN 1 Kota Mojokerto.', 'foto' => null],
                    ['nama' => 'Drs. Akhmad Muklason, M.Pd.', 'periode' => 's.d. 2025/2026', 'keterangan' => 'Memimpin pengembangan fasilitas dan persiapan menuju sekolah Adiwiyata.', 'foto' => null],
                    ['nama' => 'Iswahyudi, S.ST., M.Pd.', 'periode' => '2026 – Sekarang', 'keterangan' => 'Mengusung visi “SKANEDA KEREN” untuk lulusan vokasi yang kompeten dan berkarakter.', 'foto' => '/images/kepala-sekolah.webp'],
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
