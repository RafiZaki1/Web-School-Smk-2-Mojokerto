export interface LulusanStatic {
  name: string;
  jurusan: string;
  angkatan: number;
  karier: string;
  lokasi?: string;
  photo?: string;
  jalur?: string;
  testimoni?: string;
  skill?: string[];
  rating?: number | null;
}

export const LULUSAN_TERBAIK: LulusanStatic[] = [
  {
    name: "Anas Hilmi Yahya",
    jurusan: "DKV",
    angkatan: 2023,
    karier: "Graphic Designer, Studio Kreatif Malang",
    photo: "/images/lulusan/anas-hilmi-yahya.jpg",
    jalur: "Bekerja",
    testimoni: "Praktik desain dan penguasaan software kreatif sejak di bangku DKV SMKN 2 Mojokerto membuat portofolio saya langsung siap bersaing di industri kreatif.",
    skill: ["Branding", "Desain Grafis & Komunikasi Visual"],
  },
  {
    name: "Nadia Kirana P.",
    jurusan: "APHP",
    angkatan: 2022,
    karier: "Mahasiswa Teknologi Pangan, IPB University",
    photo: "/images/lulusan/nadia-kirana.jpg",
    jalur: "Kuliah",
    testimoni: "Dasar praktik uji mutu dan pengolahan pangan di laboratorium APHP sangat membantu saya memahami materi kuliah Teknologi Pangan di perguruan tinggi.",
    skill: ["Analisis Pangan", "Uji Mutu & Pengolahan Hasil Pertanian"],
  },
  {
    name: "Rafi Zaki",
    jurusan: "RPL",
    angkatan: 2019,
    karier: "IT Engineer, PT Pertamina (Persero)",
    photo: "/images/lulusan/rafi-zaki.webp",
    jalur: "Bekerja",
    testimoni: "Pola pikir pemecahan masalah, logika pemrograman, dan pengelolaan sistem yang ditempa di jurusan RPL menjadi fondasi kuat saya berkarier di perusahaan BUMN.",
    skill: ["Infrastruktur IT", "Troubleshooting & Rekayasa Sistem"],
  },
  {
    name: "Indra Setiawan",
    jurusan: "RPL",
    angkatan: 2019,
    karier: "Software Engineer, PT Telkom Indonesia",
    photo: "/images/lulusan/indra-setiawan.jpg",
    jalur: "Bekerja",
    testimoni: "Terbiasa mengerjakan project pembuatan aplikasi dan kerja tim sejak kelas 12 di RPL membuat saya cepat beradaptasi dengan ritme pengembangan software skala industri.",
    skill: ["Full-Stack Development", "Database & Software Engineering"],
  },
];

// Direktori lengkap di halaman /lulusan; warna kartu mengikuti jurusan
export const JURUSAN_TONES: Record<string, string> = {
  RPL: "from-[#60a5fa] to-[#1e3a8a]",
  APHP: "from-[#22c55e] to-[#14532d]",
  LPS: "from-[#f97316] to-[#111827]",
  DKV: "from-[#eab308] to-[#1f2937]",
  TB: "from-[#ec4899] to-[#4c0519]",
};

export const LULUSAN_DIREKTORI: LulusanStatic[] = [
  { name: "Rangga Adi P.", jurusan: "RPL", angkatan: 2023, karier: "Software Engineer, PT Telkom Indonesia" },
  { name: "Nadia Kirana P.", jurusan: "APHP", angkatan: 2022, karier: "Mahasiswa Teknologi Pangan, IPB University" },
  { name: "Bima Setiawan", jurusan: "LPS", angkatan: 2021, karier: "Staff Operasional, Bank Syariah Indonesia" },
  { name: "Iqbal Maulana", jurusan: "DKV", angkatan: 2023, karier: "Graphic Designer, Studio Kreatif Malang" },
  { name: "Anas Hilmi Yahya", jurusan: "DKV", angkatan: 2023, karier: "Graphic Designer, Studio Kreatif Malang" },
  { name: "Rafi Zaki", jurusan: "RPL", angkatan: 2019, karier: "IT Engineer, PT Pertamina (Persero)" },
  { name: "Indra Setiawan", jurusan: "RPL", angkatan: 2019, karier: "Software Engineer, PT Telkom Indonesia" },
  { name: "Carla Nur Parawansa", jurusan: "LPS", angkatan: 2026, karier: "Duta Koperasi Provinsi Jawa Timur" },
];

// Cerita per jurusan di bawah kartu "Lulusan terbaik" (beranda)
export const LULUSAN_JURUSAN_TESTIMONI = [
  {
    name: "Rafi Zaki",
    jurusan: "RPL",
    angkatan: 2019,
    fokus: "Infrastruktur IT & Troubleshooting Sistem",
    photo: "/images/lulusan/rafi-zaki.webp",
    testimoni: "Selama di jurusan RPL SMKN 2 Mojokerto, kami tidak cuma diajari teori koding, tapi langsung dibiasakan membedah masalah sistem dan jaringan secara nyata. Fasilitas lab komputer dan bimbingan guru saat praktik membuat mental problem-solving saya terbentuk kuat sejak sekolah.",
    tempat: "IT Engineer di PT Pertamina (Persero)",
    bidang: "Infrastruktur TI & Sistem Perusahaan (BUMN Energi)",
    keterampilan: ["Analisis Sistem", "Jaringan Komputer"],
  },
  {
    name: "Indra Setiawan",
    jurusan: "RPL",
    angkatan: 2019,
    fokus: "Web & Software Engineering",
    photo: "/images/lulusan/indra-setiawan.jpg",
    testimoni: "Kurikulum RPL di sini sangat relevan dengan standar industri. Tugas-tugas project pembuatan aplikasi web secara berkelompok waktu kelas 11 dan 12 benar-benar menjadi simulasi kerja nyata sebelum saya terjun ke perusahaan teknologi.",
    tempat: "Software Engineer di PT Telkom Indonesia",
    bidang: "Pengembangan Perangkat Lunak & Telekomunikasi Digital",
    keterampilan: ["Pemrograman Web", "Manajemen Proyek Aplikasi"],
  },
  {
    name: "Anas Hilmi Yahya",
    jurusan: "DKV",
    angkatan: 2023,
    fokus: "Branding & Desain Komunikasi Visual",
    photo: "/images/lulusan/anas-hilmi-yahya.jpg",
    testimoni: "Belajar di DKV SMKN 2 Mojokerto sangat seru karena kami dibebaskan mengeksplorasi ide kreatif sambil tetap diarahkan sesuai kebutuhan klien. Mulai dari dasar tipografi, ilustrasi, fotografi, sampai penguasaan software desain semuanya diajarkan dari nol sampai mahir.",
    tempat: "Graphic Designer di Studio Kreatif Malang",
    bidang: "Industri Kreatif, Branding & Media Visual",
    keterampilan: ["Tipografi & Ilustrasi", "Software Desain"],
  },
  {
    name: "Nadia Kirana P.",
    jurusan: "APHP",
    angkatan: 2022,
    fokus: "Teknologi Pengolahan & Uji Mutu Pangan",
    photo: "/images/lulusan/nadia-kirana.jpg",
    testimoni: "Praktik di laboratorium APHP sangat berkesan. Kami belajar langsung cara mengolah bahan pangan mentah menjadi produk bernilai jual tinggi, lengkap dengan teknik pengawetan, pengemasan, hingga uji kualitas keamanan pangan.",
    tempat: "Mahasiswa Teknologi Pangan di IPB University",
    bidang: "Sains & Teknologi Industri Pangan",
    keterampilan: ["Pengolahan Pangan", "Uji Mutu Pangan"],
  },
  {
    // Contoh perwakilan: ganti dengan alumni sungguhan sebelum tayang
    name: "Siti Rahmawati",
    jurusan: "LPS",
    angkatan: 2022,
    fokus: "Administrasi Keuangan & Layanan Nasabah",
    testimoni: "Di jurusan LPS, saya ditempa untuk bekerja dengan ketelitian tinggi, rapi dalam pembukuan akuntansi, dan ramah dalam simulasi pelayanan bank mini. Ilmu administrasi keuangan dan etika komunikasinya sangat matang.",
    tempat: "Frontliner & Staf Operasional di Bank Syariah Indonesia (BSI)",
    bidang: "Perbankan Syariah & Layanan Finansial",
    keterampilan: ["Administrasi Pembukuan", "Layanan Nasabah"],
  },
  {
    // Contoh perwakilan: ganti dengan alumni sungguhan sebelum tayang
    name: "Bagas Pratama",
    jurusan: "TB",
    angkatan: 2021,
    fokus: "Pastry & Seni Kuliner",
    testimoni: "Dapur praktik Tata Boga di SMKN 2 Mojokerto sudah membiasakan kami bekerja cepat, higienis, dan disiplin mengikuti standar resep. Dari teknik dasar memotong bahan, memasak hidangan utama, sampai membuat pastry semuanya dipraktikkan langsung.",
    tempat: "Demi Chef Pastry di Hotel Bintang 5 Surabaya",
    bidang: "Perhotelan, Restoran & Seni Kuliner (Food & Beverage Service)",
    keterampilan: ["Teknik Memasak", "Pastry & Bakery"],
  },
];
