<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\Alumni;
use App\Models\Article;
use App\Models\Aspiration;
use App\Models\Extracurricular;
use App\Models\JobVacancy;
use App\Models\Major;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Data awal konten publik, dipindahkan dari data statis frontend-next/lib/data.
 * Gambar memakai aset yang sudah ada di Next.js (path diawali "/").
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->majors();
        $this->achievements();
        $this->extracurriculars();
        $this->articles();
        $this->jobs();
        $this->alumni();
        $this->aspirations();
    }

    private function majors(): void
    {
        $majors = [
            [
                'slug' => 'aphp',
                'code' => 'APHP',
                'name' => 'Agribisnis Pengolahan Hasil Pertanian',
                'image' => '/images/jurusan/aphp.jpg',
                'tagline' => 'Teknologi & Industri Pangan',
                'accent_color' => '#22c55e',
                'summary' => 'Membekali siswa dengan keterampilan mengolah hasil pertanian menjadi produk berkualitas — dari proses produksi, pengemasan, hingga pemasaran.',
                'description' => 'Siswa dibekali kemampuan mengelola hasil pertanian mulai dari penanganan bahan baku, proses pengolahan pangan, kontrol mutu, hingga strategi pemasaran produk. Pembelajaran berbasis proyek nyata bekerja sama dengan UMKM dan industri pengolahan pangan lokal.',
                'competencies' => [
                    ['icon' => 'FlaskConical', 'title' => 'Teknologi pengolahan pangan'],
                    ['icon' => 'ShieldCheck', 'title' => 'Kontrol mutu & keamanan pangan'],
                    ['icon' => 'Package', 'title' => 'Pengemasan produk'],
                    ['icon' => 'Store', 'title' => 'Pemasaran & kewirausahaan'],
                    ['icon' => 'Leaf', 'title' => 'Agribisnis berkelanjutan'],
                ],
                'careers' => [
                    ['icon' => 'Microscope', 'title' => 'Quality Control industri pangan'],
                    ['icon' => 'Factory', 'title' => 'Staff produksi pangan olahan'],
                    ['icon' => 'Store', 'title' => 'Wirausaha produk agribisnis'],
                    ['icon' => 'GraduationCap', 'title' => 'Lanjut kuliah Teknologi Pangan'],
                ],
                'facility_title' => 'Praktik langsung di lab & workshop',
                'facilities' => [
                    ['title' => 'Lab Pengolahan Hasil Pertanian', 'image' => '/images/fasilitas/aphp-1.jpg'],
                    ['title' => 'Workshop Produksi Pangan', 'image' => '/images/fasilitas/aphp-2.jpg'],
                    ['title' => 'Dapur Praktik', 'image' => '/images/fasilitas/tb-1.jpg'],
                ],
                'partners' => [
                    ['name' => 'Family Food', 'logo' => '/images/mitra/family-food.svg'],
                    ['name' => 'Hachi Donuts', 'logo' => '/images/mitra/hachi-donuts.svg'],
                    ['name' => 'Cokelat Mojopahit', 'logo' => '/images/mitra/cokelat-mojopahit.svg'],
                    ['name' => 'Olivia Bakery', 'logo' => '/images/mitra/olivia-bakery.svg'],
                    ['name' => 'DK Donuts & Coffee', 'logo' => '/images/mitra/dk-donuts.svg'],
                ],
                'lab_room_slug' => 'lab-aphp',
            ],
            [
                'slug' => 'rpl',
                'code' => 'RPL',
                'name' => 'Rekayasa Perangkat Lunak',
                'image' => '/images/jurusan/rpl.jpg',
                'tagline' => 'Teknologi Informasi & Komputer',
                'accent_color' => '#2563eb',
                'summary' => 'Membekali siswa dengan keahlian komputasi modern, pemrograman website & aplikasi mobile, manajemen database, dan rekayasa software terstandar industri.',
                'description' => 'Siswa dibekali keterampilan koding dari dasar hingga tingkat lanjut, meliputi Fullstack Web Development, Mobile Apps (Android & iOS), arsitektur cloud database, serta UI/UX Design berbasis kebutuhan industri digital dan startup masa kini.',
                'competencies' => [
                    ['icon' => 'Code', 'title' => 'Web Development'],
                    ['icon' => 'Smartphone', 'title' => 'Mobile Apps'],
                    ['icon' => 'Database', 'title' => 'Database Management'],
                    ['icon' => 'PenTool', 'title' => 'UI/UX Design'],
                    ['icon' => 'Cpu', 'title' => 'Software Testing'],
                ],
                'careers' => [
                    ['icon' => 'Code', 'title' => 'Programmer / Software Developer', 'description' => 'Mengembangkan perangkat lunak sesuai kebutuhan pengguna.'],
                    ['icon' => 'Laptop', 'title' => 'Web / Mobile Developer', 'description' => 'Membangun aplikasi web dan mobile yang inovatif dan fungsional.'],
                    ['icon' => 'Database', 'title' => 'Database Administrator', 'description' => 'Mengelola, merawat, dan mengamankan basis data perusahaan.'],
                    ['icon' => 'Target', 'title' => 'IT Support / System Analyst', 'description' => 'Memberikan dukungan teknis dan menganalisis kebutuhan sistem.'],
                ],
                'facility_title' => 'Eksplorasi coding di lab & project',
                'facilities' => [
                    ['title' => 'Lab Komputer 1', 'image' => '/images/fasilitas/rpl-1.jpg'],
                    ['title' => 'Lab Komputer 2', 'image' => '/images/fasilitas/rpl-2.jpg'],
                    ['title' => 'Lab Komputer 3', 'image' => '/images/fasilitas/rpl-3.jpg'],
                ],
                'partners' => [
                    ['name' => 'Hummatech', 'logo' => '/images/mitra/hummatech.svg'],
                    ['name' => 'Mitra IT Monogram', 'logo' => '/images/mitra/mitra-monogram.svg'],
                    ['name' => 'KoffieSoft', 'logo' => '/images/mitra/koffiesoft.svg'],
                    ['name' => 'Otak Kanan', 'logo' => '/images/mitra/otak-kanan.svg'],
                ],
                'lab_room_slug' => 'laboratorium-rpl',
            ],
            [
                'slug' => 'dkv',
                'code' => 'DKV',
                'name' => 'Desain Komunikasi Visual',
                'image' => '/images/jurusan/dkv.jpg',
                'tagline' => 'Seni Kreatif & Multimedia',
                'accent_color' => '#eab308',
                'summary' => 'Mengembangkan kreativitas siswa dalam desain grafis, ilustrasi digital, videografi, fotografi studio komersial, animasi, dan perancangan identitas visual kreatif.',
                'description' => 'Siswa dilatih merancang pesan komunikasi visual yang bernilai estetika dan komersial tinggi. Meliputi penguasaan software industri grafis (Adobe Suite), teknik fotografi studio profesional, motion graphic, hingga strategi branding media sosial.',
                'competencies' => [
                    ['icon' => 'Brush', 'title' => 'Desain Grafis'],
                    ['icon' => 'Camera', 'title' => 'Fotografi & Videografi'],
                    ['icon' => 'PenTool', 'title' => 'Ilustrasi Digital'],
                    ['icon' => 'Palette', 'title' => 'UI/UX Design'],
                    ['icon' => 'Sparkles', 'title' => 'Branding & Periklanan'],
                ],
                'careers' => [
                    ['icon' => 'Palette', 'title' => 'Graphic Designer', 'description' => 'Merancang elemen visual untuk berbagai media komunikasi.'],
                    ['icon' => 'Aperture', 'title' => 'Photographer / Videographer', 'description' => 'Menghasilkan karya visual berupa foto dan video profesional.'],
                    ['icon' => 'PenTool', 'title' => 'UI/UX Designer', 'description' => 'Menciptakan antarmuka digital yang ramah pengguna.'],
                    ['icon' => 'Clapperboard', 'title' => 'Creative Director', 'description' => 'Mengarahkan visi kreatif untuk proyek atau kampanye.'],
                ],
                'facility_title' => 'Eksplorasi kreativitas di studio & lab',
                'facilities' => [
                    ['title' => 'Studio Fotografi', 'image' => '/images/fasilitas/dkv-1.jpg'],
                    ['title' => 'Lab Desain Grafis', 'image' => '/images/fasilitas/dkv-2.jpg'],
                    ['title' => 'Lab Desain Grafis 2', 'image' => '/images/fasilitas/dkv-3.jpg'],
                ],
                'partners' => [],
                'lab_room_slug' => 'lab-dkv',
            ],
            [
                'slug' => 'lps',
                'code' => 'LPS',
                'name' => 'Layanan Perbankan Syariah',
                'image' => '/images/jurusan/lps.jpg',
                'tagline' => 'Bisnis & Keuangan Syariah',
                'accent_color' => '#ef4444',
                'summary' => 'Membekali siswa dengan kompetensi pelayanan dan administrasi perbankan syariah berstandar profesional, akuntansi keuangan, dan service excellence.',
                'description' => 'Siswa disiapkan menjadi praktisi perbankan dan keuangan syariah yang handal, menguasai operasional teller, customer service, administrasi pembiayaan, serta pembukuan akuntansi syariah berbasis teknologi komputer akuntansi.',
                'competencies' => [
                    ['icon' => 'Landmark', 'title' => 'Operasional Bank Syariah'],
                    ['icon' => 'Calculator', 'title' => 'Akuntansi Syariah'],
                    ['icon' => 'Handshake', 'title' => 'Layanan Nasabah'],
                    ['icon' => 'ScrollText', 'title' => 'Manajemen ZISWAF'],
                    ['icon' => 'CreditCard', 'title' => 'Teknologi Keuangan'],
                ],
                'careers' => [
                    ['icon' => 'Landmark', 'title' => 'Staf Operasional Bank Syariah', 'description' => 'Mengelola transaksi harian, kliring, dan administrasi operasional sesuai prinsip syariah.'],
                    ['icon' => 'Handshake', 'title' => 'Teller / Customer Service', 'description' => 'Memberikan pelayanan prima kepada nasabah untuk transaksi tunai dan informasi produk.'],
                    ['icon' => 'FileText', 'title' => 'Staf Administrasi Keuangan', 'description' => 'Menyusun laporan keuangan dan pembukuan instansi atau perusahaan berbasis syariah.'],
                    ['icon' => 'TrendingUp', 'title' => 'Analisis Pembiayaan Mikro', 'description' => 'Menganalisis kelayakan pembiayaan syariah untuk usaha mikro, kecil, dan menengah.'],
                ],
                'facility_title' => 'Belajar langsung melalui koperasi sekolah',
                'facilities' => [
                    ['title' => 'Bank Mini', 'image' => '/images/fasilitas/lps-1.jpg'],
                    ['title' => 'Ruang Teller', 'image' => '/images/fasilitas/lps-2.jpg'],
                    ['title' => 'Lab Akuntansi', 'image' => '/images/fasilitas/lps-3.jpg'],
                ],
                'partners' => [
                    ['name' => 'Bank Muamalat', 'logo' => '/images/mitra/bank-muamalat.svg'],
                    ['name' => 'BPRS Lantabur Tebuireng', 'logo' => '/images/mitra/lantabur-tebuireng.svg'],
                    ['name' => 'BPJS Ketenagakerjaan', 'logo' => '/images/mitra/bpjs-ketenagakerjaan.svg'],
                    ['name' => 'BAZNAS Kota Mojokerto', 'logo' => '/images/mitra/baznas-mojokerto.svg'],
                    ['name' => 'Mandiri Taspen', 'logo' => '/images/mitra/mandiri-taspen.svg'],
                ],
                'lab_room_slug' => 'bank',
            ],
            [
                'slug' => 'boga',
                'code' => 'Tata Boga',
                'name' => 'Kuliner & Tata Hidang',
                'image' => '/images/jurusan/kuliner.jpg',
                'tagline' => 'Pariwisata & Hospitaliti',
                'accent_color' => '#ec4899',
                'summary' => 'Membekali siswa dengan keahlian seni mengolah makanan nusantara & kontinental, pastry & bakery, table service, dan kewirausahaan bisnis kuliner modern.',
                'description' => 'Siswa dilatih menguasai seni kuliner standar hotel berbintang, teknik pastry & bakery, food presentation, hygiene sanitasi HACCP, hingga manajemen restoran dan katering komersial.',
                'competencies' => [
                    ['icon' => 'CookingPot', 'title' => 'Pengolahan Masakan Nusantara & Kontinental'],
                    ['icon' => 'Croissant', 'title' => 'Pastry, Bakery & Cake Decoration'],
                    ['icon' => 'Coffee', 'title' => 'Pelayanan F&B Service & Barista'],
                    ['icon' => 'SprayCan', 'title' => 'Hygiene Sanitasi & Standar HACCP'],
                    ['icon' => 'Store', 'title' => 'Manajemen Usaha Kuliner & Catering'],
                ],
                'careers' => [
                    ['icon' => 'ChefHat', 'title' => 'Commis Chef / Cook Hotel Berbintang'],
                    ['icon' => 'CakeSlice', 'title' => 'Pastry & Bakery Chef Profesional'],
                    ['icon' => 'Coffee', 'title' => 'Barista & F&B Service Specialist'],
                    ['icon' => 'GraduationCap', 'title' => 'Lanjut kuliah Seni Kuliner / Perhotelan'],
                ],
                'facility_title' => 'Praktik langsung di dapur & kitchen',
                'facilities' => [
                    ['title' => 'Dapur Praktik', 'image' => '/images/fasilitas/tb-1.jpg'],
                    ['title' => 'Lab Tata Boga', 'image' => '/images/fasilitas/tb-2.jpg'],
                    ['title' => 'Ruang Pastry', 'image' => '/images/fasilitas/tb-3.jpg'],
                ],
                'partners' => [],
                'lab_room_slug' => 'lab-kuliner',
            ],
        ];

        foreach ($majors as $index => $major) {
            Major::query()->updateOrCreate(
                ['slug' => $major['slug']],
                [...$major, 'accreditation' => 'A (Unggul)', 'is_published' => true, 'sort_order' => $index + 1]
            );
        }
    }

    private function achievements(): void
    {
        $items = [
            [
                'slug' => 'lomba-menulis-surat-gubernur',
                'title' => 'Lomba Menulis Surat Untuk Gubernur Memperingati Hari Pendidikan',
                'card_title' => 'Lomba Menulis Surat Untuk Gubernur',
                'rank' => 'Juara 1',
                'level' => 'Nasional',
                'category' => 'Akademik',
                'subtitle' => 'Carla Nur Parawansa • Kelas XII LPS 2',
                'student_name' => 'Carla Nur Parawansa',
                'student_class' => 'XII LPS 2',
                'cover_image' => '/prestasi-utama.webp',
                'start_date' => '2026-04-20',
                'summary' => 'Carla Nur Parawansa meraih Juara 1 Lomba Menulis Surat Untuk Gubernur dalam rangka memperingati Hari Pendidikan Nasional.',
            ],
            [
                'slug' => 'duta-koperasi-provinsi',
                'title' => 'Duta Koperasi Provinsi',
                'card_title' => 'Duta Koperasi',
                'rank' => 'Juara 1',
                'level' => 'Provinsi',
                'category' => 'Non-akademik',
                'subtitle' => 'Juara 1 Putri • Vania Garnetta Putri XII LPS 2',
                'student_name' => 'Carla Nur Parawansa',
                'student_class' => 'Kelas XII LPS 2 • SMKN 2 Kota Mojokerto',
                'student_photo' => '/images/prestasi/carla-avatar.jpg',
                'cover_image' => '/images/prestasi/galeri-2.jpg',
                'start_date' => '2026-06-12',
                'end_date' => '2026-06-15',
                'location' => 'Gedung Negara Grahadi, Surabaya',
                'organizer' => 'Dinas Koperasi dan UKM Prov. Jatim',
                'summary' => 'Pemilihan Duta Koperasi Tingkat Provinsi Jawa Timur merupakan ajang bergengsi yang diselenggarakan untuk meningkatkan kesadaran generasi muda terhadap pentingnya perkoperasian dalam perekonomian nasional.',
                'description' => "Carla Nur Parawansa siswi berprestasi dari SMKN 2 Kota Mojokerto, berhasil menyisihkan ratusan peserta dari berbagai kabupaten/kota se-Jawa Timur. Kompetisi ini menguji pengetahuan komprehensif mengenai sejarah, prinsip, dan penerapan koperasi modern di era digital. Selain tes tertulis, peserta juga dinilai berdasarkan kemampuan public speaking, problem solving, dan penyusunan makalah inovasi koperasi sekolah.\n\nGelar \"Juara 1 Duta Koperasi\" ini bukan sekadar penghargaan, melainkan tanggung jawab baru bagi Carla untuk menjadi agen perubahan yang mensosialisasikan nilai-nilai gotong royong dan kemandirian ekonomi kepada rekan-rekan sebayanya. Prestasi ini juga mengukuhkan komitmen SMKN 2 Kota Mojokerto dalam mencetak lulusan yang tidak hanya unggul secara akademis, tetapi juga memiliki jiwa kepemimpinan dan wawasan kewirausahaan yang tangguh.",
                'testimonial' => [
                    'quote' => 'Prestasi Carla membuktikan bahwa koperasi bukanlah konsep usang, melainkan motor penggerak ekonomi masa depan yang sangat relevan dengan generasi muda.',
                    'name' => 'Bapak Iswahyudi, S.ST.',
                    'position' => 'Kepala SMKN 2 Kota Mojokerto',
                ],
                'gallery_title' => 'Galeri Momen',
                'gallery_description' => 'Kumpulan dokumentasi selama proses seleksi hingga malam penganugerahan Duta Koperasi.',
                'gallery' => ['/images/prestasi/galeri-1.jpg', '/images/prestasi/galeri-2.jpg', '/images/prestasi/galeri-3.jpg'],
            ],
            [
                'slug' => 'turnamen-futsal-tunas-cup-2026',
                'title' => 'Turnamen Futsal Tunas Cup 2026',
                'rank' => 'Juara 3',
                'level' => 'Lokal',
                'category' => 'Olahraga',
                'subtitle' => 'Juara 3 • Tim Futsal SMKN 2 Mojokerto',
                'student_name' => 'Tim Futsal SMKN 2',
                'student_class' => 'Gabungan',
                'start_date' => '2026-06-05',
            ],
            [
                'slug' => 'kejurprov-dayung-2026',
                'title' => 'Kejuaraan Provinsi (Kejurprov) Dayung 2026',
                'rank' => 'Medali',
                'level' => 'Provinsi',
                'category' => 'Olahraga',
                'subtitle' => 'Medali Perunggu • Ayu Pinky Salsabila',
                'student_name' => 'Ayu Pinky Salsabila',
                'student_class' => 'XI TKJ 1',
                'start_date' => '2026-05-16',
            ],
            [
                'slug' => 'graphic-design-technology',
                'title' => 'Graphic Design Technology',
                'rank' => 'Juara 3',
                'level' => 'Nasional',
                'category' => 'Akademik',
                'subtitle' => 'Juara 3 • Tim Karya Siswa XII DKV',
                'student_name' => 'Tim Karya Siswa',
                'student_class' => 'XII DKV',
                'start_date' => '2026-04-08',
            ],
            [
                'slug' => 'lomba-debat-bahasa-inggris',
                'title' => 'Lomba Debat Bahasa Inggris Se-Jawa Timur',
                'card_title' => 'Lomba Debat Bahasa Inggris',
                'rank' => 'Juara 2',
                'level' => 'Regional',
                'category' => 'Akademik',
                'subtitle' => 'Juara 2 • Tim Debat XI Bahasa',
                'student_name' => 'Tim Debat',
                'student_class' => 'XI Bahasa',
                'start_date' => '2026-03-14',
            ],
        ];

        foreach ($items as $item) {
            Achievement::query()->updateOrCreate(['slug' => $item['slug']], [...$item, 'is_published' => true]);
        }
    }

    private function extracurriculars(): void
    {
        $defaultGallery = ['/images/ekstra/paskibra-1.jpg', '/images/ekstra/paskibra-2.jpg', '/images/ekstra/paskibra-3.jpg', '/images/ekstra/paskibra-4.jpg'];
        $defaultAchievements = [
            ['icon' => 'trophy', 'text' => 'Juara 1 Lomba Baris-Berbaris Tingkat Kota Mojokerto — 2024'],
            ['icon' => 'medal', 'text' => '2 Siswa terpilih jadi Paskibraka Kota Mojokerto — 2025'],
        ];

        $items = [
            [
                'slug' => 'paskibra',
                'name' => 'Paskibra',
                'tagline' => 'Disiplin & kepemimpinan',
                'icon' => 'flag',
                'cover_image' => '/paskib.webp',
                'summary' => 'Membentuk karakter disiplin, tanggung jawab, dan jiwa kepemimpinan melalui latihan baris-berbaris serta kegiatan upacara.',
                'schedule' => 'Selasa & Jumat',
                'location' => 'Lapangan Upacara',
                'members' => '45 Siswa',
                'about_title' => 'Lebih dari sekadar baris-berbaris',
                'about' => 'Paskibra melatih siswa menjadi pribadi yang disiplin, tangguh, dan siap memimpin. Anggota rutin bertugas dalam upacara bendera sekolah dan berkesempatan mewakili sekolah dalam seleksi Paskibra di tingkat kota.',
                'achievements' => $defaultAchievements,
                'testimonials' => [[
                    'quote' => 'Latihan di Paskibra ngajarin aku disiplin waktu dan cara memimpin teman-teman, yang ternyata sangat bermanfaat bukan hanya di luar kegiatan sekolah.',
                    'author' => 'Anggota Paskibra, kelas 11',
                ]],
            ],
            [
                'slug' => 'futsal',
                'name' => 'Futsal',
                'tagline' => 'Kerja sama & sportivitas',
                'icon' => 'ball',
                'cover_image' => '/futsal.webp',
                'summary' => 'Mengasah keterampilan fisik, kelincahan teknik, strategi tim, dan menjunjung tinggi sportivitas dalam olahraga futsal.',
                'schedule' => 'Selasa & Kamis',
                'location' => 'Lapangan Futsal',
                'members' => '45 Siswa',
                'about_title' => 'Lebih dari sekedar olahraga',
                'about' => 'Futsal menjadi wadah bagi siswa untuk melatih fisik, strategi, dan kekompakan tim. Setiap latihan menjadi kesempatan untuk belajar sportivitas, saling percaya, dan memberikan penampilan terbaik di setiap pertandingan.',
                'achievements' => [
                    ['icon' => 'trophy', 'text' => 'Juara 3 Turnamen Futsal Tunas Cup — 2026'],
                    ['icon' => 'medal', 'text' => 'Peserta Liga Futsal Pelajar Kota Mojokerto — 2025'],
                ],
                'testimonials' => [[
                    'quote' => 'Bermain futsal bersama bukan hanya tentang mencetak gol, tetapi juga belajar bekerja sama, menjaga kekompakan, dan membangun semangat untuk berjuang bersama dalam setiap pertandingan.',
                    'author' => 'Anggota Ekstrakurikuler Futsal',
                ]],
            ],
            [
                'slug' => 'tari',
                'name' => 'Tari',
                'tagline' => 'Seni & budaya',
                'icon' => 'music',
                'cover_image' => '/Tari.webp',
                'summary' => 'Ekstrakurikuler Tari menjadi wadah bagi siswa untuk mengembangkan bakat, kreativitas, dan kemampuan dalam seni tari, serta melestarikan budaya melalui setiap gerakan dan karya.',
                'schedule' => 'Selasa & Jumat',
                'location' => 'Lapangan Upacara',
                'members' => '45 Siswa',
                'about_title' => 'Lebih dari sekedar gerakan',
                'about' => 'Tari menjadi wadah bagi siswa untuk mengekspresikan diri, mengembangkan kreativitas, dan melestarikan seni budaya. Setiap latihan menjadi kesempatan untuk belajar kekompakan, menghayati setiap gerakan, dan menampilkan karya terbaik.',
                'achievements' => $defaultAchievements,
                'testimonials' => [[
                    'quote' => 'Menari bersama bukan hanya tentang menghafal setiap gerakan, tetapi juga belajar percaya diri, bekerja sama, dan mengekspresikan diri melalui setiap karya yang kami tampilkan.',
                    'author' => 'Anggota Ekstrakurikuler Tari',
                ]],
            ],
            [
                'slug' => 'pikr',
                'name' => 'Pik-r',
                'tagline' => 'Edukasi',
                'icon' => 'hand-heart',
                'cover_image' => '/Pik-r.webp',
                'summary' => 'Pusat informasi dan konseling remaja sebaya untuk membentuk generasi muda yang cerdas, peduli, sehat, dan berencana.',
                'schedule' => 'Rabu',
                'location' => 'Ruang BK',
                'members' => '30 Siswa',
                'about_title' => 'Teman sebaya yang siap mendengar',
                'about' => 'Pik-r membekali anggotanya dengan wawasan kesehatan remaja, keterampilan konseling sebaya, dan kampanye positif agar teman-teman di sekolah tumbuh menjadi pribadi yang sehat, peduli, dan berencana.',
                'achievements' => [['icon' => 'trophy', 'text' => 'Duta Genre Kota Mojokerto — 2025']],
                'testimonials' => [[
                    'quote' => 'Di Pik-r aku belajar mendengarkan teman dan berani bicara soal hal-hal penting dengan cara yang menyenangkan.',
                    'author' => 'Anggota Pik-r, kelas 11',
                ]],
            ],
            [
                'slug' => 'basket',
                'name' => 'Basket',
                'tagline' => 'Kerja sama & sportivitas',
                'icon' => 'ball',
                'summary' => 'Latihan teknik dasar, strategi permainan, dan kekompakan tim bola basket.',
                'schedule' => 'Rabu & Sabtu',
                'location' => 'Lapangan Olahraga',
                'members' => '25 Siswa',
                'is_published' => false,
            ],
        ];

        foreach ($items as $index => $item) {
            Extracurricular::query()->updateOrCreate(['slug' => $item['slug']], [
                'gallery_title' => 'Momen latihan & Event',
                'gallery' => $defaultGallery,
                'is_published' => true,
                ...$item,
                'sort_order' => $index + 1,
            ]);
        }
    }

    private function articles(): void
    {
        $ukkBody = implode("\n\n", [
            'Uji Kompetensi Keahlian (UKK) Desain Komunikasi Visual dilaksanakan pada Senin-Rabu, 24-26 Februari 2024 oleh siswa kelas XII. Kegiatan ini bertujuan mengukur pencapaian kompetensi peserta didik yang telah menyelesaikan proses pembelajaran sesuai konsentrasi keahlian dari kelas X, dan dibuktikan dengan sertifikat kompetensi.',
            'Materi yang diujikan meliputi rebranding potensi Kota Mojokerto — tempat kuliner, fasilitas olahraga, wisata budaya, hingga ruang terbuka hijau — dengan output berupa logo, karya foto, poster, desain feed instagram, hingga video vlog.',
            'Kegiatan ini mendapat dukungan langsung dari Kepala Sekolah dan Kepala Kompetensi Keahlian DKV, dengan harapan siswa dapat terus mengembangkan kemampuan desain untuk perkuliahan maupun dunia kerja.',
        ]);
        $ukkGallery = ['/images/berita/galeri-1.jpg', '/images/berita/galeri-2.jpg', '/images/berita/galeri-3.jpg'];
        $placeholder = fn (string $title) => "{$title}. Informasi lengkap mengenai kegiatan ini akan diperbarui oleh admin sekolah.";

        $items = [
            ['slug' => 'siswa-gim-ciptakan-game-edukasi-ar', 'category' => 'Prestasi', 'title' => 'Siswa jurusan pengembangan gim SMKN 2 Kota Mojokerto ciptakan game edukasi AR untuk kenalkan batik Malang kepada anak-anak', 'published_at' => '2026-07-19', 'cover_image' => '/images/berita/thumb-1.jpg', 'body' => $ukkBody, 'gallery' => $ukkGallery],
            ['slug' => 'belajar-teknologi-standar-global', 'category' => 'Agenda sekolah', 'title' => 'Belajar teknologi dengan standar global di SMK Negeri 2 Kota Mojokerto', 'published_at' => '2026-03-06'],
            ['slug' => 'siswa-diterima-24-kampus-luar-negeri', 'category' => 'Informasi umum', 'title' => 'Belum lulus, siswa SMK sudah diterima 24 kampus luar negeri sekaligus', 'published_at' => '2026-07-03'],
            ['slug' => 'jadwal-libur-semester-genap', 'category' => 'Pengumuman', 'title' => 'Jadwal libur semester genap tahun ajaran 2025/2026', 'published_at' => '2026-02-28'],
            ['slug' => 'pameran-karya-desain-dkv', 'category' => 'Karya siswa', 'title' => 'Pameran karya desain siswa jurusan DKV angkatan 2026', 'published_at' => '2026-02-15'],
            ['slug' => 'job-fair-bkk', 'category' => 'Agenda sekolah', 'title' => 'Job Fair BKK bersama 20+ perusahaan mitra industri', 'published_at' => '2026-02-02'],
            ['slug' => 'ukk-dkv-2024', 'category' => 'Prestasi', 'title' => 'Selamat dan Sukses! Desain Komunikasi Visual SMK Negeri 2 Mojokerto Laksanakan Uji Kompetensi Keahlian', 'published_at' => '2024-03-03', 'cover_image' => '/images/berita/hero-1.jpg', 'body' => $ukkBody, 'gallery' => $ukkGallery],
        ];

        foreach ($items as $item) {
            Article::query()->updateOrCreate(['slug' => $item['slug']], [
                'author' => 'Admin Sekolah',
                'body' => $placeholder($item['title']),
                'gallery' => [],
                'is_published' => true,
                ...$item,
            ]);
        }
    }

    private function jobs(): void
    {
        $contact = ['contact_phone' => '0857-3050-2173', 'contact_email' => 'bkk.smkn2mr@gmail.com', 'status' => JobVacancy::STATUS_OPEN];

        $items = [
            [
                'slug' => 'desainer-grafis', 'title' => 'Desainer Grafis', 'company' => 'PT Kita Lewati Sendiri', 'location' => 'Malang',
                'category' => 'Desain & Kreatif', 'employment_type' => 'Full-time', 'closes_at' => '2026-09-30', 'poster' => '/images/bkk/loker-1.jpg',
                'banner_color' => '#e8890b', 'banner_headline' => 'Dibutuhkan Segera!', 'banner_subtitle' => 'Desainer Grafis',
                'description' => 'Kami mencari Desainer Grafis yang kreatif dan memiliki perhatian terhadap detail untuk membantu menghasilkan berbagai kebutuhan visual perusahaan, mulai dari konten digital, materi promosi, hingga kebutuhan desain lainnya.',
                'responsibilities' => ['Membuat desain untuk kebutuhan media sosial dan promosi perusahaan', 'Mengembangkan konsep visual sesuai dengan identitas brand', 'Melakukan revisi desain berdasarkan kebutuhan dan masukan tim', 'Berkolaborasi dengan tim untuk menghasilkan desain yang menarik dan komunikatif'],
                'qualifications' => ['Lulusan SMK/SMA atau sederajat, khususnya bidang Desain Grafis/DKV menjadi nilai tambah', 'Menguasai aplikasi desain seperti Adobe Photoshop, Illustrator, CorelDRAW, atau Canva', 'Mampu bekerja secara mandiri maupun dalam tim', 'Memiliki portofolio desain menjadi nilai tambah'],
            ],
            [
                'slug' => 'staff-it-support', 'title' => 'Staff IT Support', 'company' => 'PT Kita Lewati Berdua', 'location' => 'Mojokerto',
                'category' => 'IT & Teknologi', 'employment_type' => 'Full-time', 'closes_at' => '2026-09-25', 'poster' => '/images/bkk/poster-staff-it.jpg',
                'banner_color' => '#0c7870', 'banner_headline' => 'Staff IT', 'banner_subtitle' => 'PT Kita Lewati Berdua',
                'description' => 'Kami mencari Staff IT Support yang akan bertanggung jawab menjaga kelancaran sistem jaringan dan perangkat kantor, menangani troubleshooting harian, serta mendukung tim IT dalam proyek pengembangan infrastruktur perusahaan.',
                'responsibilities' => ['Memelihara dan memperbaiki jaringan serta perangkat kantor', 'Menangani keluhan teknis dari pengguna internal', 'Melakukan instalasi dan konfigurasi perangkat keras/lunak', 'Mendokumentasikan setiap tiket dan solusi yang diberikan'],
                'qualifications' => ['Lulusan SMK jurusan Rekayasa Perangkat Lunak/TKJ', 'Familiar dengan OS Windows, Linux, dan jaringan dasar (LAN/WAN)', 'Fresh graduate dipersilakan melamar', 'Jujur, teliti, dan mampu bekerja dalam tim'],
            ],
            [
                'slug' => 'lomba-inovasi-produk-olahan-pangan', 'title' => 'Lomba Inovasi Produk Olahan Pangan', 'company' => 'Tim Siswa APHP', 'location' => 'Mojokerto',
                'category' => 'Kuliner & Hospitality', 'employment_type' => 'Part-time', 'closes_at' => '2026-09-30', 'poster' => '/images/bkk/loker-3.jpg',
                'banner_color' => '#5b4021', 'banner_headline' => 'Lowongan Pekerjaan', 'banner_subtitle' => 'Barista · Waiters',
                'description' => 'Dibutuhkan barista dan waiters untuk mendukung operasional kafe mitra BKK. Cocok untuk lulusan yang ingin mengasah keterampilan pelayanan dan pengolahan minuman.',
                'responsibilities' => ['Menyiapkan dan menyajikan minuman sesuai standar resep', 'Melayani tamu dengan ramah dan cekatan', 'Menjaga kebersihan area kerja dan peralatan'],
                'qualifications' => ['Lulusan SMK jurusan Kuliner/APHP atau sederajat', 'Berpenampilan rapi dan komunikatif', 'Bersedia bekerja dengan sistem shift'],
            ],
            [
                'slug' => 'frontliner-bank', 'title' => 'Frontliner Bank', 'company' => 'Bank Syariah Indonesia', 'location' => 'Surabaya',
                'category' => 'Perbankan', 'employment_type' => 'Full-time', 'closes_at' => '2026-10-05', 'banner_color' => '#1d52c7',
                'description' => 'Bank Syariah Indonesia membuka kesempatan bagi lulusan untuk bergabung sebagai frontliner (teller dan customer service) yang memberikan layanan prima kepada nasabah.',
                'responsibilities' => ['Melayani transaksi tunai dan non-tunai nasabah', 'Memberikan informasi produk perbankan syariah', 'Menjaga ketepatan dan kerapian administrasi transaksi'],
                'qualifications' => ['Lulusan SMK jurusan Layanan Perbankan Syariah/Akuntansi', 'Berpenampilan menarik dan komunikatif', 'Teliti, jujur, dan berorientasi pelayanan'],
            ],
            [
                'slug' => 'cook-helper', 'title' => 'Cook Helper', 'company' => 'Hotel Aston Mojokerto', 'location' => 'Mojokerto',
                'category' => 'Kuliner & Hospitality', 'employment_type' => 'Full-time', 'closes_at' => '2026-10-10', 'banner_color' => '#b22321',
                'description' => 'Hotel Aston Mojokerto mencari Cook Helper untuk membantu operasional dapur hotel, mulai dari persiapan bahan hingga penyajian menu.',
                'responsibilities' => ['Menyiapkan bahan makanan sesuai standar dapur', 'Membantu chef dalam proses memasak dan plating', 'Menjaga kebersihan dan sanitasi area dapur'],
                'qualifications' => ['Lulusan SMK jurusan Kuliner/Tata Boga', 'Memahami standar higiene dan sanitasi makanan', 'Bersedia bekerja dengan sistem shift'],
            ],
            [
                'slug' => 'operator-produksi', 'title' => 'Operator Produksi', 'company' => 'PT Indomobil Griya', 'location' => 'Mojokerto',
                'category' => 'Manufaktur', 'employment_type' => 'Full-time', 'closes_at' => '2026-10-12', 'banner_color' => '#4e369f',
                'description' => 'PT Indomobil Griya membuka lowongan Operator Produksi untuk mendukung proses produksi yang aman, efisien, dan sesuai standar mutu perusahaan.',
                'responsibilities' => ['Mengoperasikan mesin produksi sesuai SOP', 'Melakukan pengecekan kualitas hasil produksi', 'Melaporkan kendala produksi kepada supervisor'],
                'qualifications' => ['Lulusan SMK semua jurusan', 'Sehat jasmani dan rohani', 'Bersedia bekerja dengan sistem shift'],
            ],
        ];

        foreach ($items as $item) {
            JobVacancy::query()->updateOrCreate(['slug' => $item['slug']], [...$contact, ...$item]);
        }
    }

    private function alumni(): void
    {
        $items = [
            ['name' => 'Anas Hilmi Yahya', 'major_code' => 'DKV', 'graduation_year' => 2023, 'career' => 'Graphic Designer, Studio Kreatif Malang', 'photo' => '/images/lulusan/anas-hilmi-yahya.jpg', 'is_featured' => true],
            ['name' => 'Nadia Kirana P.', 'major_code' => 'APHP', 'graduation_year' => 2022, 'career' => 'Mahasiswa Teknologi Pangan, IPB University', 'photo' => '/images/lulusan/nadia-kirana.jpg', 'is_featured' => true],
            ['name' => 'Rafi Zaki', 'major_code' => 'RPL', 'graduation_year' => 2019, 'career' => 'IT Engineer, PT Pertamina (Persero)', 'photo' => '/images/lulusan/rafi-zaki.webp', 'is_featured' => true],
            ['name' => 'Indra Setiawan', 'major_code' => 'RPL', 'graduation_year' => 2019, 'career' => 'Software Engineer, PT Telkom Indonesia', 'photo' => '/images/lulusan/indra-setiawan.jpg', 'is_featured' => true],
            ['name' => 'Rangga Adi P.', 'major_code' => 'RPL', 'graduation_year' => 2023, 'career' => 'Software Engineer, PT Telkom Indonesia'],
            ['name' => 'Bima Setiawan', 'major_code' => 'LPS', 'graduation_year' => 2021, 'career' => 'Staff Operasional, Bank Syariah Indonesia'],
            ['name' => 'Iqbal Maulana', 'major_code' => 'DKV', 'graduation_year' => 2023, 'career' => 'Graphic Designer, Studio Kreatif Malang'],
            ['name' => 'Carla Nur Parawansa', 'major_code' => 'LPS', 'graduation_year' => 2026, 'career' => 'Duta Koperasi Provinsi Jawa Timur'],
        ];

        foreach ($items as $index => $item) {
            Alumni::query()->updateOrCreate(['name' => $item['name']], [...$item, 'sort_order' => $index + 1]);
        }
    }

    private function aspirations(): void
    {
        $items = [
            [
                'title' => 'AC kelas XI RPL 2 rusak', 'category' => 'Fasilitas', 'status' => Aspiration::STATUS_NEW, 'is_anonymous' => true, 'created_at' => '2026-08-27 09:12:00',
                'detail' => 'AC di kelas XI RPL 2 sudah tidak dingin sejak minggu lalu, kelas jadi panas terutama siang hari saat pelajaran praktik. Sudah dilaporkan ke wali kelas tapi belum ada perbaikan.',
                'photos' => ['/images/fasilitas/rpl-1.jpg', '/images/fasilitas/rpl-3.jpg'],
            ],
            [
                'title' => 'Tong Sampah Rusak', 'category' => 'Fasilitas', 'status' => Aspiration::STATUS_NEW, 'is_anonymous' => false, 'sender_name' => 'Siswa XI APHP 1', 'created_at' => '2026-08-26 13:40:00',
                'detail' => 'Tong sampah di depan kantin pecah dan sampah berserakan saat jam istirahat.',
            ],
            [
                'title' => 'Kamar mandi rusak', 'category' => 'Fasilitas', 'status' => Aspiration::STATUS_IN_PROGRESS, 'is_anonymous' => true, 'created_at' => '2026-08-24 07:55:00', 'responded_at' => '2026-08-25 08:00:00',
                'detail' => 'Keran di kamar mandi lantai 2 gedung B bocor dan pintunya tidak bisa dikunci.',
            ],
            [
                'title' => 'Waktu tunggu pengurusan surat keterangan terlalu lama', 'category' => 'Layanan Administrasi', 'status' => Aspiration::STATUS_IN_PROGRESS, 'is_anonymous' => true, 'created_at' => '2026-08-20 11:05:00', 'responded_at' => '2026-08-21 09:00:00',
                'detail' => 'Pengurusan surat keterangan aktif sekolah membutuhkan waktu lebih dari tiga hari.',
                'public_response' => 'Sedang ditinjau oleh bagian Tata Usaha',
            ],
            [
                'title' => 'Kipas angin kelas XII DKV 1 tidak berfungsi', 'category' => 'Fasilitas', 'status' => Aspiration::STATUS_RESOLVED, 'is_anonymous' => true, 'created_at' => '2026-08-18 10:20:00', 'responded_at' => '2026-08-25 14:00:00',
                'detail' => 'Dua kipas angin di kelas XII DKV 1 mati sehingga kelas terasa pengap.',
                'public_response' => 'Ditindaklanjuti — perbaikan selesai 25 Agustus 2026',
            ],
        ];

        foreach ($items as $item) {
            $aspiration = Aspiration::query()->firstOrNew(['title' => $item['title']]);
            $aspiration->fill([...$item, 'photos' => $item['photos'] ?? []]);
            $aspiration->created_at = Carbon::parse($item['created_at']);
            $aspiration->updated_at = Carbon::parse($item['responded_at'] ?? $item['created_at']);
            $aspiration->save();
        }
    }
}
