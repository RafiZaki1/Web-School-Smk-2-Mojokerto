<?php

namespace Database\Seeders;

use App\Enums\JobVacancyStatusEnum;
use App\Models\Achievement;
use App\Models\Alumni;
use App\Models\Article;
use App\Models\Extracurricular;
use App\Models\JobVacancy;
use App\Models\Major;
use Illuminate\Database\Seeder;

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
                'partners' => MitraList::untuk('APHP'),
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
                'partners' => MitraList::untuk('RPL'),
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
                'partners' => MitraList::untuk('DKV'),
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
                'partners' => MitraList::untuk('LPS'),
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
                'partners' => MitraList::untuk('KULINER'),
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
        Achievement::query()->whereIn('slug', [
            'lomba-menulis-surat-gubernur',
            'duta-koperasi-provinsi',
            'turnamen-futsal-tunas-cup-2026',
            'kejurprov-dayung-2026',
            'graphic-design-technology',
            'lomba-debat-bahasa-inggris',
        ])->delete();

        $items = [
            [
                'slug' => 'smk-negeri-2-mojokerto-bawa-pulang-medali-perak-lks-nasional-2024',
                'title' => 'SMK Negeri 2 Mojokerto Bawa Pulang Medali Perak di Ajang LKS Nasional 2024',
                'card_title' => 'Medali Perak LKS Nasional XXXII — Patisserie & Confectionery',
                'rank' => 'Medali Perak',
                'level' => 'Nasional',
                'category' => 'Akademik',
                'subtitle' => 'Ahmed Husein Jalili & M. Dzakaa Irawan • Jurusan Kuliner',
                'student_name' => 'Ahmed Husein Jalili & M. Dzakaa Irawan',
                'student_class' => 'Konsentrasi Keahlian Kuliner • SMKN 2 Kota Mojokerto',
                'student_photo' => '/images/prestasi/medali-perak-lks-2024.webp',
                'cover_image' => '/images/prestasi/medali-perak-lks-2024.webp',
                'start_date' => '2024-08-19',
                'end_date' => '2024-08-24',
                'location' => 'Provinsi Lampung',
                'organizer' => 'Balai Pengembangan Talenta Indonesia (BPTI) Kemendikbudristek',
                'summary' => 'Siswa Jurusan Kuliner SMKN 2 Kota Mojokerto berhasil mengharumkan nama Jawa Timur dengan membawa pulang Medali Perak (Juara 2 Nasional) bidang lomba Patisserie and Confectionery pada ajang Lomba Kompetensi Siswa (LKS) SMK Tingkat Nasional ke-XXXII di Lampung.',
                'description' => implode("\n\n", [
                    'SMK Negeri 2 Kota Mojokerto kembali membuktikan kualitas pendidikan vokasinya di kancah nasional. Mewakili Provinsi Jawa Timur pada ajang Lomba Kompetensi Siswa (LKS) SMK Tingkat Nasional ke-XXXII Tahun 2024 di Lampung, delegasi Jurusan Kuliner SMKN 2 Kota Mojokerto sukses menyabet Medali Perak pada bidang lomba Patisserie and Confectionery.',
                    'Capaian membanggakan ini diraih oleh Ahmed Husein Jalili sebagai peserta utama didampingi oleh Mohammad Dzakaa Irawan sebagai helper. Keduanya berhasil memukau dewan juri nasional melalui ketepatan teknik pembuatan pastry, estetika penyajian produk coklat dan entremets, serta manajemen waktu dan kebersihan dapur berstandar hotel bintang lima.',
                    'Keberhasilan di panggung nasional ini merupakan buah dari persiapan intensif selama lebih dari 10 bulan di bawah bimbingan guru produktif Kuliner serta dukungan penuh manajemen sekolah. Prestasi ini sekaligus turut berkontribusi mengantarkan Kontingen Jawa Timur meraih predikat Juara Umum LKS SMK Tingkat Nasional.',
                    'Sumber: Radar Mojokerto (Jawa Pos Group) — https://radarmojokerto.jawapos.com/pendidikan/2409060009/smk-negeri-2-mojokerto-bawa-pulang-medali-perak-di-ajang-lks-nasional-2024',
                ]),
                'testimonial' => [
                    'quote' => 'Latihan intensif selama sepuluh bulan terbayar lunas ketika nama SMKN 2 Kota Mojokerto dan Jawa Timur dipanggil meraih Medali Perak LKS Nasional. Ini bukti bahwa siswa vokasi mampu bersaing di level tertinggi.',
                    'name' => 'Bapak Drs. H. Iswahyudi, M.Pd.',
                    'position' => 'Kepala SMKN 2 Kota Mojokerto',
                ],
                'gallery_title' => 'Dokumentasi LKS Nasional',
                'gallery_description' => 'Momen perjuangan dan kreasi Patisserie & Confectionery siswa SMKN 2 Kota Mojokerto.',
                'gallery' => ['/images/prestasi/medali-perak-lks-2024.webp', '/images/fasilitas/tb-2.jpg', '/images/fasilitas/tb-3.jpg'],
            ],
            [
                'slug' => 'kadindik-jatim-apresiasi-multie-mie-inovasi-siswa-smkn-2-mojokerto-fiksi',
                'title' => 'Kadindik Jatim Apresiasi Multie Mie Inovasi Siswa SMKN 2 Mojokerto yang Trendy, Bergizi, dan Siap Bersaing di Panggung Nasional FIKSI',
                'card_title' => 'Inovasi Multie Mie Melaju ke Panggung Nasional FIKSI',
                'rank' => 'Apresiasi & Finalis',
                'level' => 'Nasional',
                'category' => 'Akademik',
                'subtitle' => 'Kolaborasi Siswa Tata Boga, APHP & DKV • Multi Color With Nutrition',
                'student_name' => 'Tim Inovasi Kolaborasi Siswa (Tata Boga, APHP & DKV)',
                'student_class' => 'Lintas Konsentrasi Keahlian • SMKN 2 Kota Mojokerto',
                'student_photo' => '/images/prestasi/multie-mie-fiksi.webp',
                'cover_image' => '/images/prestasi/multie-mie-fiksi.webp',
                'start_date' => '2025-10-15',
                'location' => 'Surabaya & Tingkat Nasional',
                'organizer' => 'Dinas Pendidikan Prov. Jatim & BPTI Kemendikdasmen (FIKSI)',
                'summary' => "Kepala Dinas Pendidikan Provinsi Jawa Timur Aries Agung Paewai memberikan apresiasi tinggi terhadap produk inovasi 'Multie Mie' (Multi Color With Nutrition) karya kolaborasi siswa SMKN 2 Kota Mojokerto yang menembus panggung nasional Festival Inovasi dan Kewirausahaan Siswa Indonesia (FIKSI).",
                'description' => implode("\n\n", [
                    "Kepala Dinas Pendidikan Provinsi Jawa Timur, Aries Agung Paewai, mengapresiasi secara langsung inovasi produk pangan kreatif 'Multie Mie' (Multi Color With Nutrition) hasil karya siswa-siswi SMKN 2 Kota Mojokerto. Produk mi instan cup sehat ini dinilai tidak hanya trendy di kalangan generasi muda, tetapi juga sarat nilai gizi dan ramah lingkungan.",
                    'Multie Mie merupakan wujud kolaborasi lintas konsentrasi keahlian di SMKN 2 Kota Mojokerto, memadukan keahlian siswa Agribisnis Pengolahan Hasil Pertanian (APHP), Kuliner (Tata Boga), dan Desain Komunikasi Visual (DKV). Mi dibuat tanpa bahan pengawet dengan pewarna serta nutrisi alami dari bahan lokal seperti daun kelor (hijau), kunyit (kuning), dan buah bit (merah).',
                    'Keunggulan lain yang menjadi sorotan dewan juri FIKSI (Festival Inovasi dan Kewirausahaan Siswa Indonesia) adalah penggunaan kemasan bumbu berbasis edible film dari pati singkong yang dapat larut bersama air seduhan, sehingga mengurangi limbah plastik sekali pakai. Inovasi ini membuktikan kesiapan siswa SMKN 2 Kota Mojokerto bersaing di panggung kewirausahaan nasional.',
                    'Sumber: Dinas Pendidikan Provinsi Jawa Timur — https://dindik.jatimprov.go.id/news-detail/1089/kadindik-jatim-apresiasi-multie-mie-inovasi-siswa-smkn-2-mojokerto-yang-trendy-bergizi-dan-siap-bersaing-di-panggung-nasional-fiksi',
                ]),
                'testimonial' => [
                    'quote' => 'Inovasi Multie Mie karya siswa SMKN 2 Mojokerto sangat luar biasa—menggabungkan gizi lokal, kemasan ramah lingkungan edible film, dan desain kemasan modern yang siap bersaing di tingkat nasional FIKSI.',
                    'name' => 'Dr. Aries Agung Paewai, S.STP., M.M.',
                    'position' => 'Kepala Dinas Pendidikan Provinsi Jawa Timur',
                ],
                'gallery_title' => 'Galeri Inovasi Multie Mie',
                'gallery_description' => 'Produk Multie Mie hasil kolaborasi lintas jurusan SMKN 2 Kota Mojokerto.',
                'gallery' => ['/images/prestasi/multie-mie-fiksi.webp', '/images/produk/beimie.jpg'],
            ],
            [
                'slug' => 'silvia-nadhifa-terpilih-sebagai-duta-anti-narkoba-kota-mojokerto-2026',
                'title' => 'Silvia Nadhifa dari SMKN 2 Kota Mojokerto Terpilih sebagai Duta Anti Narkoba Kota Mojokerto 2026',
                'card_title' => 'Silvia Nadhifa Terpilih sebagai Duta Anti Narkoba Kota Mojokerto 2026',
                'rank' => 'Juara 1 / Duta',
                'level' => 'Lokal',
                'category' => 'Non-akademik',
                'subtitle' => 'Silvia Nadhifa • Siswi Kelas XI SMKN 2 Kota Mojokerto',
                'student_name' => 'Silvia Nadhifa',
                'student_class' => 'Siswi Kelas XI • SMKN 2 Kota Mojokerto',
                'student_photo' => '/images/prestasi/duta-anti-narkoba-2026.webp',
                'cover_image' => '/images/prestasi/duta-anti-narkoba-2026.webp',
                'start_date' => '2026-10-18',
                'location' => 'Ruang Sabha Mandala Madya, Balai Kota Mojokerto',
                'organizer' => 'Pemkot Mojokerto, BNN Kota Mojokerto & Disporapar',
                'summary' => 'Silvia Nadhifa, siswi kelas XI SMKN 2 Kota Mojokerto, sukses dinobatkan sebagai Duta Anti Narkoba Kota Mojokerto Tahun 2026 setelah melewati tahapan seleksi ketat dan malam Grand Final di Balai Kota Mojokerto.',
                'description' => implode("\n\n", [
                    'Prestasi membanggakan kembali ditorehkan oleh siswa-siswi SMKN 2 Kota Mojokerto di bidang pengembangan karakter dan kepemimpinan remaja. Silvia Nadhifa, siswi kelas XI SMKN 2 Kota Mojokerto, resmi terpilih sebagai Duta Anti Narkoba Kota Mojokerto Tahun 2026 bersama perwakilan pelajar terbaik lainnya.',
                    'Ajang pemilihan yang diselenggarakan oleh Pemerintah Kota Mojokerto bekerja sama dengan Badan Narkotika Nasional (BNN) dan Dinas Kepemudaan, Olahraga, dan Pariwisata (Disporapar) ini diikuti oleh puluhan pelajar SMA/SMK sederajat se-Kota Mojokerto. Para peserta diuji dalam hal wawasan P4GN (Pencegahan dan Pemberantasan Penyalahgunaan dan Peredaran Gelap Narkotika), kemampuan public speaking, serta program kerja kreatif.',
                    'Sebagai Duta Anti Narkoba 2026, Silvia Nadhifa mengemban peran strategis sebagai pelopor edukasi sebaya (peer educator) untuk mengampanyekan gaya hidup sehat, produktif, dan bersih dari narkoba di lingkungan sekolah maupun komunitas remaja Kota Mojokerto.',
                    'Sumber: Jatimnet.com — https://jatimnet.com/evan-ong-dan-silvia-nadhifa-terpilih-jadi-duta-anti-narkoba-kota-mojokerto-2026',
                ]),
                'testimonial' => [
                    'quote' => 'Terpilihnya Silvia Nadhifa sebagai Duta Anti Narkoba Kota Mojokerto 2026 menunjukkan bahwa siswa SMKN 2 Kota Mojokerto aktif menjadi teladan positif dan agen perubahan bagi generasi muda.',
                    'name' => 'Bapak Drs. H. Iswahyudi, M.Pd.',
                    'position' => 'Kepala SMKN 2 Kota Mojokerto',
                ],
                'gallery_title' => 'Momen Penganugerahan Duta Anti Narkoba',
                'gallery_description' => 'Penampilan dan penganugerahan Duta Anti Narkoba Kota Mojokerto 2026.',
                'gallery' => ['/images/prestasi/duta-anti-narkoba-2026.webp'],
            ],
            [
                'slug' => 'smkn-2-mojokerto-semangat-dalam-kompetisi-sukses-torehkan-prestasi',
                'title' => 'SMKN 2 Mojokerto Semangat dalam Kompetisi, Sukses Torehkan Prestasi',
                'card_title' => 'Sekolah Adiwiyata Provinsi Jatim & Juara Kompetisi FESTIKA',
                'rank' => 'Penghargaan',
                'level' => 'Provinsi',
                'category' => 'Non-akademik',
                'subtitle' => 'Top 20 Sekolah Adiwiyata Provinsi & Juara Ajang FESTIKA Jatim',
                'student_name' => 'Kontingen Siswa & Warga Sekolah',
                'student_class' => 'SMKN 2 Kota Mojokerto',
                'student_photo' => '/images/prestasi/semangat-kompetisi.webp',
                'cover_image' => '/images/prestasi/semangat-kompetisi.webp',
                'start_date' => '2025-12-26',
                'location' => 'Kota Mojokerto & Surabaya',
                'organizer' => 'Dinas Lingkungan Hidup & Dinas Pendidikan Provinsi Jawa Timur',
                'summary' => "Mengusung slogan 'Disiplin Berprestasi', SMKN 2 Kota Mojokerto sukses memborong berbagai kejuaraan di ajang FESTIKA Jawa Timur 2025 sekaligus meraih penghargaan Sekolah Adiwiyata Tingkat Provinsi Jawa Timur.",
                'description' => implode("\n\n", [
                    "Di bawah kepemimpinan Kepala Sekolah beserta jajaran pendidik yang berdedikasi, SMKN 2 Kota Mojokerto terus menyalakan semangat berkompetisi di berbagai bidang akademik maupun non-akademik. Budaya 'Disiplin Berprestasi' menjadi motor penggerak bagi seluruh warga sekolah untuk melahirkan karya dan capaian terbaik.",
                    'Sepanjang tahun kompetisi, para siswa berhasil menorehkan prestasi membanggakan di berbagai ajang bergengsi, termasuk Festival Teknologi Informasi dan Komunikasi Pendidikan (FESTIKA) Jawa Timur 2025 serta kejuaraan keterampilan vokasi tingkat regional dan provinsi.',
                    'Tidak hanya unggul dalam kompetisi siswa, komitmen SMKN 2 Kota Mojokerto dalam mewujudkan lingkungan belajar yang hijau, bersih, dan berkelanjutan juga membuahkan penghargaan Sekolah Adiwiyata Provinsi Jawa Timur setelah berhasil menembus jajaran Top 20 Calon Sekolah Adiwiyata Provinsi (CSAP).',
                    'Sumber: Radar Mojokerto (Jawa Pos Group) — https://radarmojokerto.jawapos.com/pendidikan/2512260002/smkn-2-mojokerto-semangat-dalam-kompetisi-sukses-torehkan-prestasi',
                ]),
                'testimonial' => [
                    'quote' => 'Semangat berkompetisi harus selalu tumbuh di hati setiap siswa. Dengan disiplin, kerja keras, dan kolaborasi seluruh warga sekolah, prestasi demi prestasi akan terus kita torehkan.',
                    'name' => 'Bapak Drs. H. Iswahyudi, M.Pd.',
                    'position' => 'Kepala SMKN 2 Kota Mojokerto',
                ],
                'gallery_title' => 'Deretan Penghargaan Sekolah',
                'gallery_description' => 'Dokumentasi penyerahan piala kompetisi siswa dan penghargaan Sekolah Adiwiyata Provinsi.',
                'gallery' => ['/images/prestasi/semangat-kompetisi.webp'],
            ],
            [
                'slug' => 'smkn-2-mojokerto-cetak-lulusan-unggul-dan-berkarakter-di-era-globalisasi',
                'title' => 'SMKN 2 Mojokerto Cetak Lulusan Unggul dan Berkarakter di Era Globalisasi',
                'card_title' => 'Cetak Lulusan Unggul dan Berkarakter di Era Globalisasi',
                'rank' => 'Sekolah Unggulan',
                'level' => 'Nasional',
                'category' => 'Akademik',
                'subtitle' => '5 Konsentrasi Keahlian Unggulan • Siap Kerja, Santun & Berdaya Saing Global',
                'student_name' => 'Lulusan 5 Konsentrasi Keahlian',
                'student_class' => 'RPL, Kuliner, DKV, APHP & LPS • SMKN 2 Kota Mojokerto',
                'student_photo' => '/images/prestasi/lulusan-unggul-globalisasi.webp',
                'cover_image' => '/images/prestasi/lulusan-unggul-globalisasi.webp',
                'start_date' => '2025-06-17',
                'location' => 'SMKN 2 Kota Mojokerto',
                'organizer' => 'SMKN 2 Kota Mojokerto & Mitra Dunia Usaha Dunia Industri (DUDI)',
                'summary' => 'Melalui penguatan kurikulum berbasis industri, fasilitas Teaching Factory, dan pembinaan karakter, SMKN 2 Kota Mojokerto konsisten mencetak lulusan unggul yang terserap di dunia kerja, perguruan tinggi negeri, dan wirausaha mandiri.',
                'description' => implode("\n\n", [
                    'Menghadapi tantangan era globalisasi dan transformasi digital, SMK Negeri 2 Kota Mojokerto terus berinovasi dalam menyelenggarakan pendidikan kejuruan yang adaptif. Melalui lima konsentrasi keahlian unggulan—Rekayasa Perangkat Lunak (RPL), Kuliner, Desain Komunikasi Visual (DKV), Agribisnis Pengolahan Hasil Pertanian (APHP), serta Layanan Perbankan Syariah (LPS)—sekolah menyiapkan lulusan dengan kompetensi berstandar industri.',
                    'Sinergi erat bersama puluhan mitra Dunia Usaha dan Dunia Industri (DUDI) melalui program sinkronisasi kurikulum, guru tamu industri, Praktik Kerja Lapangan (PKL), hingga sertifikasi kompetensi memastikan setiap lulusan memiliki daya saing tinggi saat memasuki pasar kerja global.',
                    'Selain penguasaan hard skills, SMKN 2 Kota Mojokerto menempatkan pendidikan karakter, kedisiplinan, dan etika kerja sebagai fondasi utama. Hasilnya, tingkat keterserapan lulusan (BMW: Bekerja, Melanjutkan studi ke PTN, dan Wirausaha) terus meningkat dari tahun ke tahun.',
                    'Sumber: Radar Mojokerto (Jawa Pos Group) — https://radarmojokerto.jawapos.com/berita-terbaru/2506170010/smkn-2-mojokerto-cetak-lulusan-unggul-dan-berkarakter-di-era-globalisasi',
                ]),
                'testimonial' => [
                    'quote' => 'Tujuan utama kami adalah mencetak lulusan yang tidak hanya terampil secara teknis, tetapi juga berkarakter kuat, berakhlak mulia, dan siap beradaptasi dengan cepat di era globalisasi.',
                    'name' => 'Bapak Drs. H. Iswahyudi, M.Pd.',
                    'position' => 'Kepala SMKN 2 Kota Mojokerto',
                ],
                'gallery_title' => 'Pembelajaran Vokasi & Karakter',
                'gallery_description' => 'Kegiatan praktik standar industri dan pembinaan karakter siswa SMKN 2 Kota Mojokerto.',
                'gallery' => ['/images/prestasi/lulusan-unggul-globalisasi.webp'],
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
        // Berita lama digantikan berita dari media (detik.com, majalahglobal.com, KPU, Kabar Terdepan)
        Article::query()->whereIn('slug', [
            'siswa-gim-ciptakan-game-edukasi-ar',
            'belajar-teknologi-standar-global',
            'siswa-diterima-24-kampus-luar-negeri',
            'jadwal-libur-semester-genap',
            'pameran-karya-desain-dkv',
            'job-fair-bkk',
            'ukk-dkv-2024',
        ])->delete();

        $items = [
            [
                'slug' => 'police-goes-to-school-motivasi-pelajar-smk-mojokerto-siap-hadapi-dunia-kerja',
                'category' => 'Agenda sekolah',
                'title' => 'Police Goes to School Motivasi Pelajar SMK Mojokerto Siap Hadapi Dunia Kerja',
                'author' => 'detikJatim',
                'published_at' => '2026-08-24',
                'cover_image' => '/images/news/police-goes-to-school.webp',
                'body' => implode("\n\n", [
                    'Kapolres Mojokerto Kota, AKBP Herdiawan Arifianto, menyapa langsung ratusan siswa SMK melalui program police goes to school. Kali ini, ia memotivasi para pelajar agar menyiapkan diri untuk menghadapi dunia kerja.',
                    'Police goes to school kali ini menyasar SMKN 2 Kota Mojokerto di Kelurahan Pulorejo. Herdiawan menjadi inspektur upacara di sekolah menengah kejuruan ini untuk menyampaikan langsung sejumlah wejangan kepada ratusan pelajar.',
                    'Sebab upacara ini diikuti sedikitnya 900 siswa, para guru dan staf SMKN 2 Kota Mojokerto. Tak sendirian, Herdiawan juga didampingi Kapolsek Prajurit Kulon Kompol Purnomo, Kasat Binmas AKP Hermanto, serta Bhabinkamtibmas Pulorejo Brigadir Bagas.',
                    'Berbeda dengan materi sebelumnya terkait mencegah kenakalan remaja, edukasi bahaya penyalahgunaan narkoba hingga perundungan, dalam police goes to school kali ini, Herdiawan lebih banyak memotivasi para pelajar untuk meraih cita-cita masing-masing.',
                    'Kapolres Mojokerto Kota ini mengajak para siswa menyiapkan diri menghadapi masa depan dengan mengasah keterampilan dan pengetahuan. Sehingga ketika lulus dari SMK, nantinya mereka mampu bersaing di dunia kerja.',
                    '"Adik-adik pelajar SMK kami ajak menyiapkan diri untuk mencapai cita-cita. Supaya ketika lulus dari SMKN 2 Kota Mojokerto tidak sia-sia karena mereka sudah memiliki pengetahuan dan keterampilan," terang Herdiawan di lokasi, Senin (24/8/2026).',
                    'Tidak hanya itu, Herdiawan juga membangun kesadaran para pelajar SMKN 2 Kota Mojokerto agar mempunyai tujuan setelah lulus sekolah. Sehingga aktivitas mereka sehari-hari tidak mengalir begitu saja tanpa arah.',
                    'Ia lantas mewanti-wanti agar para pelajar senantiasa hormat dan taat kepada guru dan orang tua. Sebab peran guru dan orang tua sangat besar untuk mencapai kesuksesan. Kemudian memanfaatkan medsos tak sekadar hiburan, tapi juga untuk menambah pengetahuan dan keterampilan.',
                    '"Adik-adik pelajar juga harus mendengarkan nasihat bapak dan ibu guru, juga orang tua. Karena guru dan orang tua yang membantu mewujudkan cita-cita dan keinginan mereka," jelasnya.',
                    'Police goes to school menuai apresiasi dari para guru SMKN 2 Kota Mojokerto. Program ini wujud sinergi Polri dengan lembaga pendidikan sebagai sarana edukasi, motivasi, serta membangun kesadaran generasi muda agar menjadi pelajar yang berprestasi, bertanggungjawab dan mampu memberikan kontribusi positif bagi masyarakat, bangsa dan negara.',
                    '"Terima kasih Kapolres Mojokerto Kota yang telah memberikan motivasi kepada siswa-siswi SMKN 2 Kota Mojokerto. Semoga sinergi kepolisian dan sekolah dapat membawa perkembangan dan kemajuan bagi dunia pendidikan Indonesia," tandas Guru SMKN 2 Kota Mojokerto, Arika.',
                    'Sumber: detik.com — https://www.detik.com/jatim/jogo-jatim/d-8633223/police-goes-to-school-motivasi-pelajar-smk-mojokerto-siap-hadapi-dunia-kerja',
                ]),
            ],
            [
                'slug' => 'siswa-baru-smkn-2-mojokerto-digembleng-5-hari-jadi-generasi-hebat-anti-korupsi-siap-kerja',
                'category' => 'Agenda sekolah',
                'title' => 'Bukan Sekadar Kenalan! Siswa Baru SMKN 2 Kota Mojokerto Digembleng 5 Hari Jadi Generasi Hebat, Anti Korupsi, Siap Kerja',
                'author' => 'majalahglobal.com',
                'published_at' => '2026-07-13',
                'cover_image' => '/images/news/mpls-2026.webp',
                'body' => implode("\n\n", [
                    'Gerbang SMKN 2 Mojokerto kembali terbuka. Senin (13/7/2026), 400 lebih siswa baru angkatan 2026/2027 resmi memulai perjalanan mereka.',
                    'Tapi ini bukan MPLS biasa. Selama 5 hari ke depan, mereka akan ditempa dengan 3 kata kunci: karakter, kompetensi, dan kebersamaan.',
                    '"Kami ingin siswa baru tidak hanya mengenal sekolah, tetapi juga memahami nilai kejujuran, disiplin, dan semangat belajar," tegas Kepala SMKN 2 Mojokerto, Iswahyudi.',
                    'Hari Pertama: Dari Salam Sapa hingga Kampanye Antikorupsi',
                    'Hari pertama dibuka dengan "Salam Sapa Murid Baru" yang penuh semangat. Pembukaan MPLS sendiri dipusatkan di SMKN 2 Singosari Malang dan diikuti secara daring oleh seluruh SMK di Jawa Timur.',
                    'Usai pembukaan, siswa langsung masuk materi inti. Ada kampanye antikorupsi, materi "Aku dan Sekolahku", Gerakan 7 Kebiasaan Anak Indonesia Hebat, hingga Wawasan Wiyata Mandala.',
                    'Tujuannya jelas: menanamkan integritas sejak hari pertama masuk sekolah vokasi.',
                    'Hari 2-5: Cek Kesehatan, Asesmen, hingga Alumni Berbagi',
                    'Memasuki hari kedua, ritme MPLS makin padat. Siswa mengikuti "Pertemuan Pagi Ceria", cek kesehatan, asesmen literasi dan numerasi.',
                    'Yang menarik, ada sesi "Pengenalan Konsentrasi Keahlian" dan "Alumni Berbagi". Di sini para alumni dan guru produktif turun langsung bercerita tentang dunia kerja dan industri.',
                    '"Alumni dan guru produktif kami libatkan agar siswa lebih cepat memahami arah jurusan yang mereka pilih," jelas Iswahyudi.',
                    'Pencegahan masalah remaja juga jadi fokus. Siswa dibekali penyuluhan dampak negatif kecanduan game online.',
                    'Puncak: Unjuk Karya dan Budaya',
                    'Memasuki hari keempat, suasana berubah. Aula sekolah jadi panggung kreativitas. Siswa menampilkan unjuk karya dan pengenalan ekstrakurikuler. Setiap jurusan menunjukkan keahliannya langsung.',
                    'Puncaknya Jumat (17/7/2026). MPLS ditutup dengan kegiatan budaya, refleksi, dan penutupan resmi.',
                    'Iswahyudi berharap, 5 hari ini menjadi fondasi kuat.',
                    '"MPLS ini adalah fondasi. Dari sini kami tanamkan budaya kerja, kolaborasi, dan kebanggaan menjadi keluarga besar SMKN 2 Mojokerto," tandasnya.',
                    'Dengan konsep ini, SMKN 2 Mojokerto ingin melahirkan lulusan yang tidak hanya punya ijazah. Tapi lulusan yang hebat, berakhlak, dan siap bersaing di dunia industri. (Jay/Adv)',
                    'Sumber: majalahglobal.com — https://majalahglobal.com/2026/07/13/bukan-sekadar-kenalan-siswa-baru-smkn-2-kota-mojokerto-digembleng-5-hari-jadi-generasi-hebat-anti-korupsi-siap-kerja/',
                ]),
            ],
            [
                'slug' => 'kpu-kota-mojokerto-terima-empat-siswa-pkl-dari-smkn-2-kota-mojokerto',
                'category' => 'Informasi umum',
                'title' => 'KPU Kota Mojokerto Terima Empat Siswa PKL dari SMKN 2 Kota Mojokerto',
                'author' => 'KPU Kota Mojokerto',
                'published_at' => '2026-04-06',
                'cover_image' => '/images/news/pkl-kpu.webp',
                'body' => implode("\n\n", [
                    'Komisi Pemilihan Umum (KPU) Kota Mojokerto secara resmi menerima empat siswa dari SMK Negeri 2 Kota Mojokerto untuk melaksanakan Praktik Kerja Lapangan (PKL). Keempat siswa tersebut, yakni Keylovelica Aqmaela Restuandyta, Revani Khoirunnisa\', Riswanda Aura Ramadhana, dan Verlita Azakiza Mulyono, akan menjalani Praktik Kerja Lapangan (PKL) selama tujuh bulan mulai April hingga Oktober 2026.',
                    'Selama masa PKL, para siswa akan dilibatkan langsung dalam berbagai agenda kerja KPU, mereka juga diharapkan dapat membantu proses sosialisasi kegiatan KPU guna meningkatkan pemahaman masyarakat terkait tahapan pemilu.',
                    'Sekretaris KPU Kota Mojokerto, Wiratmoko Iman Santoso, dalam sambutannya menekankan pentingnya bagi para siswa mengenai tata kerja lembaga negara. Beliau berharap para siswa dapat mengedepankan nilai integritas dan profesionalitas selama bertugas di lingkungan KPU Kota Mojokerto.',
                    'Sementara itu, pihak SMK Negeri 2 Kota Mojokerto yang diwakili oleh Ibu Supriati, S.Kom, menyampaikan terima kasih atas kesempatan yang diberikan bagi siswanya. Melalui kerja sama ini, diharapkan para siswa mendapatkan pengalaman dunia kerja yang nyata dan kompetensi mereka di bidangnya semakin terasah. (hai)',
                    'Sumber: kota-mojokerto.kpu.go.id — https://kota-mojokerto.kpu.go.id/blog/read/8971_kpu-kota-mojokerto-terima-empat-siswa-pkl-dari-smkn-2-kota-mojokerto',
                ]),
            ],
            [
                'slug' => 'hut-kabar-terdepan-siswa-kuliner-smkn-2-kota-mojokerto-unjuk-kualitas',
                'category' => 'Karya siswa',
                'title' => 'HUT ke-2 Kabar Terdepan, Siswa Kuliner SMKN 2 Kota Mojokerto Unjuk Kualitas',
                'author' => 'Kabar Terdepan',
                'published_at' => '2025-06-28',
                'cover_image' => '/images/news/hut-kabar-terdepan.webp',
                'body' => implode("\n\n", [
                    'Peringatan Hari Ulang Tahun (HUT) ke-2 Kabar Terdepan menjadi momen spesial bagi siswa-siswi SMKN 2 Kota Mojokerto.',
                    'Mereka termasuk bagian dari tim casual atau pelayanan acara. Mereka menunjukkan kualitas dan kerja sama dalam menyukseskan kegiatan yang digelar di Royal Regency Hall, Kota Mojokerto, Senin (23/06/2025).',
                    'Sebanyak 8 siswa terpilih mendapatkan tanggung jawab langsung dari guru pendamping. Mereka bertugas dalam dua bagian penting, yaitu penyajian makanan di meja prasmanan dan pelayanan kepada para tamu undangan.',
                    '"Kita sudah koordinasi dari awal, termasuk soal menu, acara, dan penataan meja. 8 siswa SMKN 2 Kota Mojokerto dilibatkan agar mereka tahu alur dari persiapan sampai akhir acara," ujar Sri, guru kuliner SMKN 2 Kota Mojokerto, Sabtu (28/06/2025).',
                    'Siswa-siswi dibagi dalam beberapa kelompok sesuai peran masing-masing. Setiap kelompok bertanggung jawab menjaga area prasmanan agar tetap bersih, tertata, dan makanan selalu tersedia dalam jumlah cukup.',
                    'Sebagian siswa yang terlibat adalah peserta baru, namun ada pula yang sudah sering menjadi casual crew di acara sebelumnya. Dalam pelaksanaan, terjadi proses transfer ilmu dari yang berpengalaman kepada siswa yang baru pertama kali bergabung.',
                    'Siswa kelas 10 jurusan kuliner dipercaya untuk memimpin bidang makanan dan pelayanan. Ini menjadi bagian dari pembelajaran praktik langsung dalam dunia kerja, sekaligus menjaga mutu pelayanan.',
                    '"Saya tugaskan dua orang khusus. Satu orang memantau kebersihan meja dan menambah makanan bila kurang, sedangkan satu lagi bertanggung jawab penuh terhadap coffee break," kata Sri.',
                    'Tim coffee break diberikan tugas penting, yakni menghitung jumlah makanan dan minuman per porsi. Tugas ini sangat vital agar tidak terjadi kekurangan fatal saat jam makan atau menjelang acara dimulai.',
                    'Sri menekankan pentingnya pelayanan maksimal dalam setiap kesempatan. Semua detail harus diperhatikan, mulai dari ketersediaan makanan hingga sikap siswa dalam melayani tamu.',
                    '"Siapapun yang memakai jasa siswa SMKN 2 harus kita berikan yang terbaik. Kita harus pastikan makanan tertata dengan baik dan pelayanan maksimal," tegas Sri.',
                    'Innka, selaku Tim Media Kabar Terdepan, memberikan apresiasi tinggi kepada siswa-siswi kuliner SMKN 2 Kota Mojokerto yang telah melaksanakan tugas secara profesional.',
                    '"Puji Tuhan, acara berjalan lancar. Anak-anak SMKN 2 Kota Mojokerto menjalankan tugasnya dengan sangat baik, dan kami puas memakai jasa casual mereka," ujar Innka.',
                    'Perayaan ini bukan hanya tentang acara, tetapi juga menjadi ajang pembuktian kemampuan siswa dalam menghadapi tantangan nyata. Semangat kerja sama dan profesionalisme menjadi kunci suksesnya kegiatan HUT Kabar Terdepan. (Innka Cristy Natalia)',
                    'Sumber: kabarterdepan.com — https://kabarterdepan.com/hut-kabar-terdepan-siswa-smkn-2-kota-mojokerto/',
                ]),
            ],
            [
                'slug' => 'puluhan-siswa-smk-negeri-2-kota-mojokerto-lolos-ptn-lewat-jalur-snbp',
                'category' => 'Prestasi',
                'title' => 'Puluhan Siswa SMK Negeri 2 Kota Mojokerto Lolos PTN lewat Jalur SNBP',
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
            ],
        ];

        foreach ($items as $item) {
            Article::query()->updateOrCreate(['slug' => $item['slug']], [
                'gallery' => [],
                'is_published' => true,
                ...$item,
            ]);
        }
    }

    private function jobs(): void
    {
        $contact = ['contact_phone' => '0857-3050-2173', 'contact_email' => 'bkk.smkn2mr@gmail.com', 'status' => JobVacancyStatusEnum::OPEN->value];

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
}
