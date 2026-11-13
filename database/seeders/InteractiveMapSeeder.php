<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\MapEdge;
use App\Models\MapNode;
use App\Models\Room;
use App\Models\RoomCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

/**
 * Ruangan & hotspot denah SMKN 2 Kota Mojokerto (Denah Ruang Pembelajaran,
 * berlaku mulai 5 Oktober 2026). Koordinat hotspot dalam persen gambar
 * frontend-next/public/denah-2026.webp (1540x752).
 */
class InteractiveMapSeeder extends Seeder
{
    /** Foto ruangan memakai aset yang tersedia di Next.js (public/images). */
    private const ROOM_IMAGES = [
        'lab-dkv' => '/images/fasilitas/dkv-1.jpg',
        'lab-dkv-2' => '/images/fasilitas/dkv-2.jpg',
        'lab-lps' => '/images/fasilitas/lps-2.jpg',
        'lab-aphp' => '/images/fasilitas/aphp-1.jpg',
        'lab-tefa' => '/images/fasilitas/aphp-2.jpg',
        'lab-pastri-kuliner' => '/images/fasilitas/tb-3.jpg',
        'lab-kuliner' => '/images/fasilitas/tb-2.jpg',
        'bank' => '/images/fasilitas/lps-1.jpg',
        'kantor-pusat' => '/images/sejarah/gedung.jpg',
        'gerbang-utama' => '/images/sejarah/gedung.jpg',
    ];

    /** Nama lengkap program keahlian untuk deskripsi ruang kelas. */
    private const MAJORS = [
        'RPL' => 'Rekayasa Perangkat Lunak',
        'DKV' => 'Desain Komunikasi Visual',
        'LPS' => 'Layanan Perbankan Syariah',
        'APHP' => 'Agribisnis Pengolahan Hasil Pertanian',
        'KUL' => 'Kuliner',
    ];

    /**
     * Ruang kelas: [tingkat, jurusan, rombel, gedung, x, y, lebar, tinggi].
     */
    private const CLASSROOMS = [
        ['XI', 'RPL', 2, 'Gedung RPL', 43.1, 29.3, 3.0, 5.2],
        ['XI', 'RPL', 1, 'Gedung RPL', 43.1, 34.9, 3.0, 5.4],
        ['X', 'RPL', 2, 'Gedung RPL', 43.1, 41.1, 3.0, 5.6],
        ['X', 'RPL', 3, 'Gedung RPL', 43.1, 47.4, 3.0, 5.2],
        ['XI', 'RPL', 3, 'Gedung RPL', 48.3, 28.9, 3.1, 5.4],
        ['XII', 'RPL', 1, 'Gedung RPL', 48.3, 34.9, 3.1, 5.4],
        ['XII', 'RPL', 2, 'Gedung RPL', 48.3, 41.1, 3.1, 5.6],
        ['XII', 'RPL', 3, 'Gedung RPL', 48.3, 47.4, 3.1, 5.2],
        ['X', 'RPL', 1, 'Gedung Perpustakaan', 25.5, 52.8, 7.1, 3.4],

        ['XII', 'LPS', 1, 'Gedung LPS-DKV', 76.0, 29.3, 3.2, 5.6],
        ['XII', 'LPS', 2, 'Gedung LPS-DKV', 76.0, 35.3, 3.2, 5.4],
        ['XI', 'DKV', 1, 'Gedung LPS-DKV', 76.0, 42.2, 3.2, 5.6],
        ['XI', 'DKV', 2, 'Gedung LPS-DKV', 76.0, 48.0, 3.2, 5.7],
        ['X', 'LPS', 1, 'Gedung LPS-DKV', 81.6, 29.3, 3.1, 5.4],
        ['X', 'LPS', 2, 'Gedung LPS-DKV', 81.6, 35.1, 3.1, 5.5],
        ['XI', 'LPS', 1, 'Gedung LPS-DKV', 81.6, 41.9, 3.1, 5.7],
        ['XI', 'LPS', 2, 'Gedung LPS-DKV', 81.6, 47.9, 3.1, 5.6],

        ['XII', 'APHP', 2, 'Gedung APHP-DKV', 57.2, 52.9, 3.3, 5.4],
        ['XII', 'APHP', 1, 'Gedung APHP-DKV', 60.8, 52.9, 3.2, 5.4],
        ['XII', 'DKV', 2, 'Gedung APHP-DKV', 64.4, 52.9, 3.4, 5.4],
        ['XII', 'DKV', 1, 'Gedung APHP-DKV', 68.1, 52.9, 3.3, 5.4],
        ['X', 'APHP', 2, 'Gedung APHP-DKV', 57.2, 60.3, 3.3, 4.9],
        ['X', 'APHP', 1, 'Gedung APHP-DKV', 60.8, 60.3, 3.2, 4.9],
        ['X', 'DKV', 2, 'Gedung APHP-DKV', 64.4, 60.3, 3.4, 4.9],
        ['X', 'DKV', 1, 'Gedung APHP-DKV', 68.1, 60.3, 3.3, 4.9],
        ['XI', 'APHP', 2, 'Gedung APHP Selatan', 58.2, 73.0, 2.5, 6.0],
        ['XI', 'APHP', 1, 'Gedung APHP Selatan', 60.8, 73.0, 2.6, 6.0],

        ['XII', 'KUL', 1, 'Gedung Aula', 31.0, 70.6, 3.7, 5.0],
        ['XII', 'KUL', 2, 'Gedung Aula', 35.2, 70.6, 3.7, 5.0],
        ['XII', 'KUL', 3, 'Gedung Aula', 39.4, 70.6, 3.8, 5.0],
        ['X', 'KUL', 1, 'Deret Kelas Kuliner', 17.8, 80.5, 3.3, 8.4],
        ['X', 'KUL', 2, 'Deret Kelas Kuliner', 21.6, 80.5, 3.3, 8.4],
        ['X', 'KUL', 3, 'Deret Kelas Kuliner', 25.4, 80.5, 3.3, 8.4],
        ['XI', 'KUL', 1, 'Deret Kelas Kuliner', 29.3, 80.5, 3.3, 8.4],
        ['XI', 'KUL', 2, 'Deret Kelas Kuliner', 33.1, 80.5, 3.4, 8.4],
        ['XI', 'KUL', 3, 'Deret Kelas Kuliner', 36.8, 80.5, 3.5, 8.4],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Schema::disableForeignKeyConstraints();
        Facility::truncate();
        Room::truncate();
        MapEdge::truncate();
        MapNode::truncate();
        RoomCategory::truncate();
        Schema::enableForeignKeyConstraints();

        $categoriesData = [
            ['name' => 'Lab & Bengkel', 'slug' => 'lab-bengkel', 'icon' => 'laptop'],
            ['name' => 'Ruang Kelas', 'slug' => 'ruang-kelas', 'icon' => 'academic-cap'],
            ['name' => 'Fasilitas & Penunjang', 'slug' => 'fasilitas', 'icon' => 'building-library'],
            ['name' => 'Kantor & Tata Usaha', 'slug' => 'kantor', 'icon' => 'briefcase'],
            ['name' => 'Area Olahraga & Terbuka', 'slug' => 'area-terbuka', 'icon' => 'sparkles'],
            ['name' => 'Lainnya', 'slug' => 'lainnya', 'icon' => 'ellipsis-horizontal'],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[$cat['slug']] = RoomCategory::create($cat);
        }

        $walkway = new CampusWalkwaySeeder;
        $walkway->run();

        $categoryIds = array_map(fn (RoomCategory $category) => $category->id, $categories);

        foreach ($this->rooms($categoryIds) as $roomData) {
            $facilities = $roomData['facilities'] ?? [];
            unset($roomData['facilities']);

            $slug = $roomData['slug'];
            $roomData['image'] = self::ROOM_IMAGES[$slug] ?? null;
            $door = CampusWalkwaySeeder::DOORS[$slug] ?? null;
            $roomData['map_node_id'] = $door ? $walkway->nodeIds[$door] : null;

            $room = Room::create($roomData);

            foreach ($facilities as $facility) {
                Facility::create([
                    'room_id' => $room->id,
                    'name' => $facility['name'],
                    'icon' => $facility['icon'] ?? 'check',
                    'quantity' => $facility['quantity'] ?? 1,
                    'description' => $facility['description'] ?? null,
                ]);
            }
        }
    }

    /**
     * Seluruh ruangan pada denah, berurutan dari barat laut ke tenggara.
     *
     * @param  array<string, int>  $categories  slug kategori => id
     * @return array<int, array<string, mixed>>
     */
    private function rooms(array $categories): array
    {
        $rooms = [

            [
                'name' => 'Ruang Bimbingan Konseling (BK)',
                'slug' => 'bk',
                'building_name' => 'Gedung Barat',
                'category_id' => $categories['kantor'],
                'description' => 'Ruang bimbingan konseling karir, pengembangan bakat minat, dan konsultasi siswa.',
                'open_hours' => '07.00 - 15.30 WIB',
                'is_active' => true,
                'map_x' => 5.6, 'map_y' => 20.8, 'map_width' => 3.2, 'map_height' => 9.0,
                'facilities' => [['name' => 'Ruang Konseling Privat', 'quantity' => 2]],
            ],
            [
                'name' => 'Lab DKV',
                'slug' => 'lab-dkv',
                'building_name' => 'Gedung Barat',
                'category_id' => $categories['lab-bengkel'],
                'description' => 'Studio desain grafis, fotografi, dan editing video dengan perangkat kreatif berstandar industri.',
                'open_hours' => '07.00 - 16.00 WIB',
                'is_active' => true,
                'map_x' => 5.6, 'map_y' => 31.0, 'map_width' => 3.2, 'map_height' => 15.0,
                'facilities' => [
                    ['name' => 'PC Editing GPU RTX 4060', 'quantity' => 15],
                    ['name' => 'Kamera DSLR & Mirrorless 4K', 'quantity' => 6],
                    ['name' => 'Lighting Studio & Softbox', 'quantity' => 8],
                ],
            ],
            [
                'name' => 'Lab LPS',
                'slug' => 'lab-lps',
                'building_name' => 'Gedung Barat',
                'category_id' => $categories['lab-bengkel'],
                'description' => 'Laboratorium praktik akuntansi dan aplikasi perbankan syariah untuk siswa LPS.',
                'open_hours' => '07.00 - 16.00 WIB',
                'is_active' => true,
                'map_x' => 12.4, 'map_y' => 21.4, 'map_width' => 4.2, 'map_height' => 3.8,
                'facilities' => [['name' => 'Komputer Aplikasi Perbankan', 'quantity' => 30]],
            ],
            [
                'name' => 'Lab DKV 2',
                'slug' => 'lab-dkv-2',
                'building_name' => 'Gedung Barat',
                'category_id' => $categories['lab-bengkel'],
                'description' => 'Lab desain grafis dan ilustrasi digital untuk praktik siswa DKV.',
                'open_hours' => '07.00 - 16.00 WIB',
                'is_active' => true,
                'map_x' => 12.4, 'map_y' => 25.5, 'map_width' => 4.2, 'map_height' => 4.1,
                'facilities' => [['name' => 'PC Desain & Pen Tablet', 'quantity' => 30]],
            ],
            [
                'name' => 'Ruang SSK',
                'slug' => 'ssk',
                'building_name' => 'Gedung Barat',
                'category_id' => $categories['lainnya'],
                'description' => 'Ruang SSK di sisi timur Gedung Barat, bersebelahan dengan UKS.',
                'open_hours' => '07.00 - 15.30 WIB',
                'is_active' => true,
                'map_x' => 17.4, 'map_y' => 21.8, 'map_width' => 2.4, 'map_height' => 3.4,
            ],
            [
                'name' => 'Unit Kesehatan Sekolah (UKS)',
                'slug' => 'uks',
                'building_name' => 'Gedung Barat',
                'category_id' => $categories['fasilitas'],
                'description' => 'Unit Kesehatan Sekolah untuk penanganan medis awal, obat darurat, dan istirahat siswa sakit.',
                'open_hours' => '07.00 - 15.30 WIB',
                'is_active' => true,
                'map_x' => 17.4, 'map_y' => 25.4, 'map_width' => 2.4, 'map_height' => 4.2,
                'facilities' => [
                    ['name' => 'Tempat Tidur Medis Bersekat', 'quantity' => 3],
                    ['name' => 'Kotak P3K & Obat Darurat', 'quantity' => 2],
                    ['name' => 'Tabung Oksigen', 'quantity' => 1],
                ],
            ],
            [
                'name' => 'Lab Kuliner',
                'slug' => 'lab-kuliner',
                'building_name' => 'Gedung Barat',
                'category_id' => $categories['lab-bengkel'],
                'description' => 'Kitchen lab berstandar restoran hotel untuk praktik memasak masakan nusantara dan kontinental.',
                'open_hours' => '07.00 - 16.00 WIB',
                'is_active' => true,
                'map_x' => 11.1, 'map_y' => 35.8, 'map_width' => 2.6, 'map_height' => 10.6,
                'facilities' => [
                    ['name' => 'Kompor Heavy Duty Stainless', 'quantity' => 8],
                    ['name' => 'Chiller & Freezer 4 Pintu', 'quantity' => 2],
                ],
            ],

            [
                'name' => 'Parkir Motor',
                'slug' => 'parkir-motor',
                'building_name' => 'Sisi Utara Kampus',
                'category_id' => $categories['fasilitas'],
                'description' => 'Area parkir motor dan mobil di sisi utara, dekat Pos Satpam.',
                'open_hours' => '06.00 - 18.00 WIB',
                'is_active' => true,
                'map_x' => 22.3, 'map_y' => 15.5, 'map_width' => 24.2, 'map_height' => 5.0,
                'facilities' => [['name' => 'CCTV 24 Jam', 'quantity' => 2]],
            ],
            [
                'name' => 'Musholla',
                'slug' => 'musholla',
                'building_name' => 'Area Barat Kampus',
                'category_id' => $categories['fasilitas'],
                'description' => 'Sarana ibadah sholat berjamaah lima waktu, sholat dhuha bersama, dan kegiatan keagamaan.',
                'open_hours' => '05.00 - 18.30 WIB',
                'is_active' => true,
                'map_x' => 25.0, 'map_y' => 28.5, 'map_width' => 7.2, 'map_height' => 14.8,
                'facilities' => [
                    ['name' => 'Tempat Wudhu Pria & Wanita', 'quantity' => 2],
                    ['name' => 'Karpet Sajadah', 'quantity' => 12],
                ],
            ],
            [
                'name' => 'Perpustakaan',
                'slug' => 'perpustakaan',
                'building_name' => 'Gedung Perpustakaan',
                'category_id' => $categories['fasilitas'],
                'description' => 'Pusat literasi dengan koleksi buku fisik dan e-book serta area baca yang tenang dan nyaman.',
                'open_hours' => '07.30 - 15.30 WIB',
                'is_active' => true,
                'map_x' => 20.8, 'map_y' => 47.8, 'map_width' => 16.4, 'map_height' => 5.0,
                'facilities' => [
                    ['name' => 'Rak Buku', 'quantity' => 15],
                    ['name' => 'Meja Baca Bersama', 'quantity' => 10],
                ],
            ],
            [
                'name' => 'Pos Satpam & Gerbang Utama',
                'slug' => 'gerbang-utama',
                'building_name' => 'Pintu Masuk Utara',
                'category_id' => $categories['fasilitas'],
                'description' => 'Akses gerbang utama keluar masuk warga sekolah dan tamu dengan penjagaan satpam.',
                'open_hours' => '24 Jam',
                'is_active' => true,
                'map_x' => 48.0, 'map_y' => 14.6, 'map_width' => 4.6, 'map_height' => 5.0,
                'facilities' => [['name' => 'Pos Keamanan', 'quantity' => 1]],
            ],
            [
                'name' => 'Gedung Utama (Kantor Kepala Sekolah & TU)',
                'slug' => 'kantor-pusat',
                'building_name' => 'Gedung Utama',
                'category_id' => $categories['kantor'],
                'description' => 'Pusat layanan administrasi sekolah, ruang kepala sekolah, staf tata usaha, dan ruang tamu.',
                'open_hours' => '07.00 - 16.00 WIB',
                'is_active' => true,
                'map_x' => 52.3, 'map_y' => 18.0, 'map_width' => 14.8, 'map_height' => 16.2,
                'facilities' => [
                    ['name' => 'Meja Layanan Tata Usaha', 'quantity' => 8],
                    ['name' => 'Ruang Kepala Sekolah', 'quantity' => 1],
                ],
            ],
            [
                'name' => 'Ruang Bursa Kerja Khusus (BKK)',
                'slug' => 'bkk',
                'building_name' => 'Deret Toko Sekolah',
                'category_id' => $categories['kantor'],
                'description' => 'Layanan informasi lowongan kerja, rekrutmen industri, dan penyaluran kerja alumni.',
                'open_hours' => '07.30 - 15.30 WIB',
                'is_active' => true,
                'map_x' => 66.8, 'map_y' => 15.0, 'map_width' => 3.2, 'map_height' => 7.2,
                'facilities' => [['name' => 'Meja Konseling Karir', 'quantity' => 3]],
            ],
            [
                'name' => 'Toko Sekolah (Koperasi)',
                'slug' => 'kop',
                'building_name' => 'Deret Toko Sekolah',
                'category_id' => $categories['fasilitas'],
                'description' => 'Menyediakan alat tulis, seragam, atribut sekolah, dan kebutuhan harian siswa.',
                'open_hours' => '07.00 - 15.30 WIB',
                'is_active' => true,
                'map_x' => 70.1, 'map_y' => 15.0, 'map_width' => 5.3, 'map_height' => 7.2,
                'facilities' => [['name' => 'Etalase Toko', 'quantity' => 4]],
            ],
            [
                'name' => 'Bank Mini Sekolah',
                'slug' => 'bank',
                'building_name' => 'Deret Toko Sekolah',
                'category_id' => $categories['fasilitas'],
                'description' => 'Laboratorium praktik perbankan dan transaksi keuangan siswa.',
                'open_hours' => '07.30 - 14.30 WIB',
                'is_active' => true,
                'map_x' => 75.5, 'map_y' => 15.0, 'map_width' => 3.9, 'map_height' => 7.2,
                'facilities' => [['name' => 'Teller Counter', 'quantity' => 2]],
            ],
            [
                'name' => 'Parkir Mobil',
                'slug' => 'parkir-mobil',
                'building_name' => 'Sisi Timur Laut Kampus',
                'category_id' => $categories['fasilitas'],
                'description' => 'Area parkir mobil guru, karyawan, dan tamu sekolah.',
                'open_hours' => '06.00 - 18.00 WIB',
                'is_active' => true,
                'map_x' => 80.0, 'map_y' => 15.0, 'map_width' => 15.0, 'map_height' => 7.4,
            ],
            [
                'name' => 'Parkir Motor Siswa',
                'slug' => 'parkir-motor-siswa',
                'building_name' => 'Sisi Timur Kampus',
                'category_id' => $categories['fasilitas'],
                'description' => 'Area parkir motor siswa yang teratur di sisi timur sekolah.',
                'open_hours' => '06.00 - 18.00 WIB',
                'is_active' => true,
                'map_x' => 88.0, 'map_y' => 26.3, 'map_width' => 7.0, 'map_height' => 42.0,
                'facilities' => [
                    ['name' => 'Kapasitas 500+ Motor', 'quantity' => 500],
                    ['name' => 'CCTV 24 Jam', 'quantity' => 4],
                ],
            ],

            [
                'name' => 'Lapangan Olahraga',
                'slug' => 'lapangan-olahraga',
                'building_name' => 'Area Barat Daya Kampus',
                'category_id' => $categories['area-terbuka'],
                'description' => 'Lapangan serbaguna untuk upacara bendera, senam bersama, futsal, basket, voli, dan event sekolah.',
                'open_hours' => '06.00 - 18.00 WIB',
                'is_active' => true,
                'map_x' => 3.0, 'map_y' => 52.5, 'map_width' => 12.0, 'map_height' => 30.5,
                'facilities' => [
                    ['name' => 'Lapangan Basket', 'quantity' => 1],
                    ['name' => 'Lapangan Futsal & Voli', 'quantity' => 1],
                ],
            ],
            [
                'name' => 'Aula SMKN 2 Mojokerto',
                'slug' => 'aula',
                'building_name' => 'Gedung Aula',
                'category_id' => $categories['fasilitas'],
                'description' => 'Ruang pertemuan sekolah untuk seminar industri, workshop, dan acara seni budaya.',
                'open_hours' => '07.00 - 17.00 WIB',
                'is_active' => true,
                'map_x' => 30.8, 'map_y' => 60.0, 'map_width' => 12.5, 'map_height' => 10.5,
                'facilities' => [
                    ['name' => 'Panggung & Sound System', 'quantity' => 1],
                    ['name' => 'Kursi Tamu', 'quantity' => 150],
                ],
            ],
            [
                'name' => 'Taman & Kolam',
                'slug' => 'taman-kolam',
                'building_name' => 'Area Selatan Kampus',
                'category_id' => $categories['area-terbuka'],
                'description' => 'Taman hijau dengan kolam ikan sebagai tempat bersantai dan penyejuk lingkungan sekolah.',
                'open_hours' => '07.00 - 16.00 WIB',
                'is_active' => true,
                'map_x' => 47.3, 'map_y' => 74.0, 'map_width' => 8.2, 'map_height' => 16.5,
            ],
            [
                'name' => 'Lab Pastry',
                'slug' => 'lab-pastri-kuliner',
                'building_name' => 'Area Selatan Kampus',
                'category_id' => $categories['lab-bengkel'],
                'description' => 'Kitchen lab untuk pembuatan aneka kue, roti, dan pastry.',
                'open_hours' => '07.00 - 16.00 WIB',
                'is_active' => true,
                'map_x' => 57.8, 'map_y' => 80.0, 'map_width' => 5.6, 'map_height' => 7.6,
                'facilities' => [['name' => 'Oven Convection & Mixer Besar', 'quantity' => 3]],
            ],
            [
                'name' => 'Kantin',
                'slug' => 'kantin',
                'building_name' => 'Area Selatan Kampus',
                'category_id' => $categories['fasilitas'],
                'description' => 'Pusat kuliner sekolah yang menyediakan aneka makanan dan minuman bersih dan higienis.',
                'open_hours' => '06.30 - 16.00 WIB',
                'is_active' => true,
                'map_x' => 64.9, 'map_y' => 77.6, 'map_width' => 7.3, 'map_height' => 10.0,
                'facilities' => [['name' => 'Stand Makanan & Meja Makan', 'quantity' => 20]],
            ],
            [
                'name' => 'APHP Lab',
                'slug' => 'lab-aphp',
                'building_name' => 'Area Selatan Kampus',
                'category_id' => $categories['lab-bengkel'],
                'description' => 'Laboratorium pengolahan hasil pertanian dan pangan untuk uji mutu produk dan pengemasan.',
                'open_hours' => '07.00 - 16.00 WIB',
                'is_active' => true,
                'map_x' => 73.8, 'map_y' => 77.3, 'map_width' => 4.9, 'map_height' => 10.3,
                'facilities' => [['name' => 'Mesin Vacuum Sealer', 'quantity' => 4]],
            ],
            [
                'name' => 'TEFA Laboratory',
                'slug' => 'lab-tefa',
                'building_name' => 'Gedung TEFA',
                'category_id' => $categories['lab-bengkel'],
                'description' => 'Pusat Teaching Factory untuk produksi dan praktik kerja berstandar industri.',
                'open_hours' => '07.00 - 16.00 WIB',
                'is_active' => true,
                'map_x' => 83.2, 'map_y' => 70.8, 'map_width' => 11.2, 'map_height' => 16.0,
                'facilities' => [['name' => 'Lini Produksi Standar DUDI', 'quantity' => 1]],
            ],
        ];

        foreach (self::CLASSROOMS as [$level, $major, $group, $building, $x, $y, $width, $height]) {
            $rooms[] = [
                'name' => "Kelas {$level} {$major} {$group}",
                'slug' => strtolower("{$level}-{$major}-{$group}"),
                'building_name' => $building,
                'category_id' => $categories['ruang-kelas'],
                'description' => "Ruang kelas teori siswa tingkat {$level} program keahlian ".self::MAJORS[$major].'.',
                'open_hours' => '07.00 - 15.30 WIB',
                'is_active' => true,
                'map_x' => $x, 'map_y' => $y, 'map_width' => $width, 'map_height' => $height,
                'facilities' => [['name' => 'Meja & Kursi Siswa', 'quantity' => 36]],
            ];
        }

        return $rooms;
    }
}
