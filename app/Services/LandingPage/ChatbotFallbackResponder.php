<?php

namespace App\Services\LandingPage;

class ChatbotFallbackResponder
{
    private const REPLY_RPL = "💻 **Rekayasa Perangkat Lunak (RPL)**:\n\n"
        ."Jurusan RPL mempelajari Fullstack Web Development, aplikasi mobile (Android & iOS), database, UI/UX Design, dan software testing.\n\n"
        ."• **Prospek Karir**: Programmer / Software Developer, Web / Mobile Developer, Database Administrator, IT Support / System Analyst.\n"
        ."• **Fasilitas**: Lab Komputer 1, 2, dan 3.\n"
        ."• **Mitra Industri**: Hummatech, KoffieSoft, Otak Kanan.\n\n"
        .'Info lengkap ada di halaman **/jurusan/rpl** 😊';

    private const REPLY_DKV = "🎨 **Desain Komunikasi Visual (DKV)**:\n\n"
        ."Jurusan DKV berfokus pada desain grafis, ilustrasi digital, fotografi & videografi, motion graphic, serta branding dan periklanan.\n\n"
        ."• **Prospek Karir**: Graphic Designer, Photographer / Videographer, UI/UX Designer, Creative Director.\n"
        ."• **Fasilitas**: Studio Fotografi, Lab Desain Grafis, Studio Foto & Podcast.\n\n"
        .'Info lengkap ada di halaman **/jurusan/dkv** 😊';

    private const REPLY_APHP = "🌾 **Agribisnis Pengolahan Hasil Pertanian (APHP)**:\n\n"
        ."Jurusan APHP mempelajari pengolahan hasil pertanian menjadi produk pangan berkualitas — dari produksi, kontrol mutu, pengemasan, hingga pemasaran.\n\n"
        ."• **Prospek Karir**: Quality Control industri pangan, Staff produksi pangan olahan, Wirausaha agribisnis, Lanjut kuliah Teknologi Pangan.\n"
        ."• **Fasilitas**: Lab Pengolahan APHP, Workshop Produksi Pangan, Lab TEFA Bakery.\n"
        ."• **Mitra Industri**: Family Food, Hachi Donuts, Cokelat Mojopahit, Olivia Bakery, DK Donuts & Coffee.\n\n"
        .'Info lengkap ada di halaman **/jurusan/aphp** 😊';

    private const REPLY_LPS = "🏦 **Layanan Perbankan Syariah (LPS)**:\n\n"
        ."Jurusan LPS membekali siswa dengan operasional bank syariah, teller & customer service, akuntansi syariah, manajemen ZISWAF, dan teknologi keuangan.\n\n"
        ."• **Prospek Karir**: Staf Operasional Bank Syariah, Teller / Customer Service, Staf Administrasi Keuangan, Analis Pembiayaan Mikro.\n"
        ."• **Fasilitas**: Bank Mini, Ruang Teller, Lab Akuntansi.\n"
        ."• **Mitra Industri**: Bank Muamalat, BPRS Lantabur Tebuireng, BPJS Ketenagakerjaan, BAZNAS Kota Mojokerto, Mandiri Taspen.\n\n"
        .'Info lengkap ada di halaman **/jurusan/lps** 😊';

    private const REPLY_BOGA = "🍳 **Tata Boga (Kuliner & Tata Hidang)**:\n\n"
        ."Jurusan Tata Boga mempelajari masakan nusantara & kontinental, pastry & bakery, F&B service & barista, hygiene sanitasi HACCP, serta manajemen usaha kuliner.\n\n"
        ."• **Prospek Karir**: Commis Chef / Cook Hotel, Pastry & Bakery Chef, Barista & F&B Service, Lanjut kuliah Seni Kuliner / Perhotelan.\n"
        ."• **Fasilitas**: Dapur Praktik, Lab Tata Boga, Ruang Pastry, Ruang Praktik Resto.\n\n"
        .'Info lengkap ada di halaman **/jurusan/boga** 😊';

    private const REPLY_PROGRAM = "SMKN 2 Kota Mojokerto memiliki **5 program keahlian**, semuanya terakreditasi A (Unggul) 🎓\n\n"
        ."- **Rekayasa Perangkat Lunak (RPL)**\n"
        ."- **Desain Komunikasi Visual (DKV)**\n"
        ."- **Agribisnis Pengolahan Hasil Pertanian (APHP)**\n"
        ."- **Layanan Perbankan Syariah (LPS)**\n"
        ."- **Tata Boga (Kuliner & Tata Hidang)**\n\n"
        .'Tanyakan salah satu jurusan untuk penjelasan lebih lengkap ya! 😊';

    private const REPLY_KEPSEK = "👤 **Kepala SMKN 2 Kota Mojokerto**: Bapak Iswahyudi, S.ST.\n\n"
        .'> "Pendidikan vokasi adalah kunci kemandirian bangsa. Kami mendidik dengan hati, mengasah kompetensi, dan mencetak generasi yang tangguh menghadapi tantangan global."';

    private const REPLY_VISI_MISI = "🎯 **Visi & Misi SMKN 2 Kota Mojokerto**:\n\n"
        ."- **Visi**: Menjadi lembaga pendidikan dan pelatihan vokasi yang unggul, berkarakter, berwawasan lingkungan, dan berstandar internasional.\n"
        ."- **Misi**: Menyelenggarakan pembelajaran berbasis proyek industri, membekali peserta didik dengan kompetensi abad ke-21, membentuk karakter berakhlak mulia, dan membangun kemitraan strategis dengan DUDI.\n"
        .'- **Motto**: DISIPLIN • BERAKHLAK • BERPRESTASI ✨';

    private const REPLY_BKK = "💼 **BKK (Bursa Kerja Khusus) SMKN 2 Kota Mojokerto**:\n\n"
        ."BKK menyalurkan lulusan ke dunia industri dengan lowongan di bidang Perbankan, IT & Teknologi, Kuliner & Hospitality, Desain & Kreatif, dan Manufaktur.\n\n"
        ."• Daftar lowongan terbaru ada di halaman **/bkk**\n"
        .'• Kontak BKK: WhatsApp **0857-3050-2173**, email **bkk.smkn2mr@gmail.com**';

    private const REPLY_SPMB = "📋 **SPMB (Penerimaan Murid Baru) SMKN 2 Kota Mojokerto**:\n\n"
        ."Pendaftaran dilakukan online melalui beberapa jalur:\n"
        ."1. Afirmasi / Mutasi / Prestasi Lomba (pendaftaran 18–23 Mei)\n"
        ."2. Domisili SMK (pendaftaran 25–26 Juni)\n"
        ."3. Nilai Prestasi Akademik (pendaftaran 1–2 Juli)\n\n"
        .'Jadwal lengkap dan rekap nilai tahun lalu ada di halaman **/spmb**. Butuh bantuan? Hubungi panitia via WhatsApp **0857-3050-2173** 😊';

    private const REPLY_PRODUK = "🛍️ **Produk Sekolah (Karya Siswa)**:\n\n"
        ."- Roti Isi Coklat Keju — Rp 8.000\n"
        ."- Ganep's — Rp 8.000\n"
        ."- Risol — Rp 8.000\n"
        ."- Bei Mie (Mie Daun Murbei) — Rp 8.000\n\n"
        .'Pemesanan lewat halaman **/produk** atau WhatsApp **0857-3050-2173** 😊';

    private const REPLY_PRESTASI = "🏆 **Prestasi Terbaru SMKN 2 Kota Mojokerto**:\n\n"
        ."- Juara 1 Lomba Menulis Surat untuk Gubernur (Nasional, 2026)\n"
        ."- Juara 1 Duta Koperasi Provinsi Jawa Timur (2026)\n"
        ."- Juara 3 Graphic Design Technology (Nasional, 2026)\n"
        ."- Juara 2 Lomba Debat Bahasa Inggris se-Jawa Timur (2026)\n"
        ."- Medali Perunggu Kejurprov Dayung (2026)\n"
        ."- Juara 3 Turnamen Futsal Tunas Cup (2026)\n\n"
        .'Selengkapnya di halaman **/prestasi** ✨';

    private const REPLY_FASILITAS = "🏫 **Fasilitas di SMKN 2 Kota Mojokerto**:\n\n"
        ."- Lab Komputer 1–3 (RPL)\n"
        ."- Studio Fotografi, Lab Desain Grafis & Studio Podcast (DKV)\n"
        ."- Lab Pengolahan & Lab TEFA Bakery (APHP)\n"
        ."- Bank Mini, Ruang Teller & Lab Akuntansi (LPS)\n"
        ."- Dapur Praktik, Ruang Pastry & Ruang Praktik Resto (Tata Boga)\n"
        ."- Aula Serbaguna, Lapangan Olahraga & Upacara, Musholla, Kantin Sehat, UKS, Ruang BK, Koperasi Siswa\n\n"
        .'Cari lokasi ruangan dan rutenya di **Denah Interaktif** (/denah) 🗺️';

    private const REPLY_KONTAK = "📍 **Lokasi & Kontak SMKN 2 Kota Mojokerto**:\n\n"
        ."- **Alamat**: Jl. Raya Pulorejo, Mergelo, Pulorejo, Kec. Prajurit Kulon, Kota Mojokerto, Jawa Timur 61325\n"
        ."- **WhatsApp**: 0857-3050-2173\n"
        ."- **Telepon**: (0321) 387-356\n"
        ."- **Email**: smkn2mr@gmail.com\n"
        .'- **Instagram / TikTok**: @smkn2kotamojokerto';

    private const REPLY_EKSKUL = "🏆 **Ekstrakurikuler SMKN 2 Kota Mojokerto**:\n\n"
        ."- **Paskibra** — Selasa & Jumat, Lapangan Upacara\n"
        ."- **Futsal** — Selasa & Kamis, Lapangan Futsal\n"
        ."- **Tari** — Selasa & Jumat, Lapangan Upacara\n"
        ."- **PIK-R** (Pusat Informasi & Konseling Remaja) — Rabu, Ruang BK\n\n"
        .'Detail tiap ekskul ada di bagian Ekstrakurikuler pada halaman Beranda 😊';

    private const REPLY_ELEARNING = "🎓 **e-Learning SMKN 2 Mojokerto & Data Bapak/Ibu Guru**:\n\n"
        ."Pembelajaran dan penilaian daring SMKN 2 Kota Mojokerto menggunakan portal resmi **http://smkn2mojokerto.my.id/** (elearningsmkn2).\n\n"
        ."• **Akses E-Learning**: http://smkn2mojokerto.my.id/\n"
        .'• **Direktori 50 Bapak & Ibu Guru Pengampu**: Lihat daftar guru per mata pelajaran dan jurusan di halaman **/portal-belajar** 😊';

    private const REPLY_SAPAAN = "Halo! 👋\nSelamat datang di Roomchat SADA.\nAda yang bisa saya bantu hari ini seputar informasi positif dan fitur website SMKN 2 Mojokerto? 😊";

    private const REPLY_DEFAULT = "Mohon maaf dengan senang hati, saya SADA asisten virtual yang khusus diprogram untuk berbagi informasi positif seputar **SMK Negeri 2 Kota Mojokerto** dan website ini 😊.\n\nApakah ada informasi terkait **Jurusan** (RPL, DKV, APHP, LPS, Tata Boga), **Fasilitas**, **Visi & Misi**, atau **SPMB** di SMKN 2 Mojokerto yang dapat saya bantu? ✨";

    /**
     * Aturan pencocokan kata kunci. Urutan menentukan prioritas, sama seperti rantai if sebelumnya.
     *
     * @var array<int, array{keywords: array<int, string>, reply: string}>
     */
    private const RULES = [
        ['keywords' => ['rpl', 'rekayasa perangkat lunak', 'coding', 'programmer'], 'reply' => self::REPLY_RPL],
        ['keywords' => ['dkv', 'desain', 'visual', 'grafis', 'animasi', 'video'], 'reply' => self::REPLY_DKV],
        ['keywords' => ['aphp', 'pertanian', 'pangan', 'agribisnis'], 'reply' => self::REPLY_APHP],
        ['keywords' => ['lps', 'perbankan', 'syariah', 'bank', 'akuntansi'], 'reply' => self::REPLY_LPS],
        ['keywords' => ['boga', 'kuliner', 'masak', 'chef', 'pastry', 'kue'], 'reply' => self::REPLY_BOGA],
        ['keywords' => ['jurusan', 'program', 'keahlian'], 'reply' => self::REPLY_PROGRAM],
        ['keywords' => ['kepala sekolah', 'kepsek'], 'reply' => self::REPLY_KEPSEK],
        ['keywords' => ['visi', 'misi', 'tujuan', 'motto', 'tagline'], 'reply' => self::REPLY_VISI_MISI],
        ['keywords' => ['loker', 'lowongan', 'bkk', 'kerja'], 'reply' => self::REPLY_BKK],
        ['keywords' => ['ppdb', 'spmb', 'daftar', 'syarat', 'masuk'], 'reply' => self::REPLY_SPMB],
        ['keywords' => ['produk', 'beli', 'pesan', 'jual'], 'reply' => self::REPLY_PRODUK],
        ['keywords' => ['prestasi', 'juara', 'lomba'], 'reply' => self::REPLY_PRESTASI],
        ['keywords' => ['fasilitas', 'ruang', 'lab', 'bengkel', 'studio', 'dapur', 'denah'], 'reply' => self::REPLY_FASILITAS],
        ['keywords' => ['alamat', 'lokasi', 'kontak', 'telepon', 'email', 'whatsapp', 'nomor', 'hubungi'], 'reply' => self::REPLY_KONTAK],
        ['keywords' => ['ekskul', 'ekstrakurikuler', 'kegiatan', 'paskibra', 'futsal', 'tari'], 'reply' => self::REPLY_EKSKUL],
        ['keywords' => ['elearning', 'e-learning', 'portal belajar', 'guru', 'pengajar', 'moodle'], 'reply' => self::REPLY_ELEARNING],
        ['keywords' => ['halo', 'hai', 'assalamu', 'pagi', 'siang', 'sore', 'malam'], 'reply' => self::REPLY_SAPAAN],
    ];

    /**
     * Susun balasan lokal dari kata kunci pada pesan. Dipakai saat API AI tidak tersedia.
     *
     * @param  string  $message
     * @param  string  $reason
     * @return array<string, string>
     */
    public function respond(string $message, string $reason = ''): array
    {
        $normalized = mb_strtolower(trim($message));

        return [
            'status' => 'fallback',
            'reply' => $this->replyFor($normalized),
            'note' => $reason,
        ];
    }

    /**
     * Cari balasan pertama yang kata kuncinya ada di pesan.
     *
     * @param  string  $normalized
     * @return string
     */
    private function replyFor(string $normalized): string
    {
        foreach (self::RULES as $rule) {
            foreach ($rule['keywords'] as $keyword) {
                if (str_contains($normalized, $keyword)) {
                    return $rule['reply'];
                }
            }
        }

        return self::REPLY_DEFAULT;
    }
}
