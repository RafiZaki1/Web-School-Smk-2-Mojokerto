export interface PrestasiStaticItem {
  slug: string;
  badge: string;
  cardTitle: string;
  title: string;
  date: string;
  level: string;
  kategori: string;
  year: string;
  subtitle: string;
  tone: "blue" | "teal" | "indigo" | "sky";
  image?: string | null;
}

export interface PrestasiStaticDetail {
  predikat: string;
  tingkat: string;
  bulan: string;
  title: string;
  hero: string | null;
  siswa: { nama: string; kelas: string; foto: string | null };
  tanggal: string;
  lokasi: string;
  penyelenggara: string;
  ringkasan: string;
  deskripsi: string[];
  dokumen?: string | null;
  testimoni: { quote: string; nama: string; jabatan: string } | null;
  galeri: { judul: string; deskripsi: string; foto: string[] } | null;
}

// tone menentukan gradien kepala kartu di halaman "Semua Prestasi"
export const PRESTASI_LIST: PrestasiStaticItem[] = [
  {
    slug: "smk-negeri-2-mojokerto-bawa-pulang-medali-perak-lks-nasional-2024",
    badge: "Medali Perak",
    cardTitle: "Medali Perak LKS Nasional XXXII — Patisserie & Confectionery",
    title: "SMK Negeri 2 Mojokerto Bawa Pulang Medali Perak di Ajang LKS Nasional 2024",
    date: "Agustus 2024",
    level: "Nasional",
    kategori: "Akademik",
    year: "2024",
    subtitle: "Ahmed Husein Jalili & M. Dzakaa Irawan • Jurusan Kuliner",
    tone: "blue",
    image: "/images/prestasi/medali-perak-lks-2024.webp",
  },
  {
    slug: "kadindik-jatim-apresiasi-multie-mie-inovasi-siswa-smkn-2-mojokerto-fiksi",
    badge: "Apresiasi & Finalis",
    cardTitle: "Inovasi Multie Mie Melaju ke Panggung Nasional FIKSI",
    title: "Kadindik Jatim Apresiasi Multie Mie Inovasi Siswa SMKN 2 Mojokerto yang Trendy, Bergizi, dan Siap Bersaing di Panggung Nasional FIKSI",
    date: "Oktober 2025",
    level: "Nasional",
    kategori: "Akademik",
    year: "2025",
    subtitle: "Kolaborasi Siswa Tata Boga, APHP & DKV • Multi Color With Nutrition",
    tone: "teal",
    image: "/images/prestasi/multie-mie-fiksi.webp",
  },
  {
    slug: "silvia-nadhifa-terpilih-sebagai-duta-anti-narkoba-kota-mojokerto-2026",
    badge: "Juara 1 / Duta",
    cardTitle: "Silvia Nadhifa Terpilih sebagai Duta Anti Narkoba Kota Mojokerto 2026",
    title: "Silvia Nadhifa dari SMKN 2 Kota Mojokerto Terpilih sebagai Duta Anti Narkoba Kota Mojokerto 2026",
    date: "Oktober 2026",
    level: "Lokal",
    kategori: "Non-akademik",
    year: "2026",
    subtitle: "Silvia Nadhifa • Siswi Kelas XI SMKN 2 Kota Mojokerto",
    tone: "indigo",
    image: "/images/prestasi/duta-anti-narkoba-2026.webp",
  },
  {
    slug: "smkn-2-mojokerto-semangat-dalam-kompetisi-sukses-torehkan-prestasi",
    badge: "Penghargaan",
    cardTitle: "Sekolah Adiwiyata Provinsi Jatim & Juara Kompetisi FESTIKA",
    title: "SMKN 2 Mojokerto Semangat dalam Kompetisi, Sukses Torehkan Prestasi",
    date: "Desember 2025",
    level: "Provinsi",
    kategori: "Non-akademik",
    year: "2025",
    subtitle: "Top 20 Sekolah Adiwiyata Provinsi & Juara Ajang FESTIKA Jatim",
    tone: "sky",
    image: "/images/prestasi/semangat-kompetisi.webp",
  },
  {
    slug: "smkn-2-mojokerto-cetak-lulusan-unggul-dan-berkarakter-di-era-globalisasi",
    badge: "Sekolah Unggulan",
    cardTitle: "Cetak Lulusan Unggul dan Berkarakter di Era Globalisasi",
    title: "SMKN 2 Mojokerto Cetak Lulusan Unggul dan Berkarakter di Era Globalisasi",
    date: "Juni 2025",
    level: "Nasional",
    kategori: "Akademik",
    year: "2025",
    subtitle: "5 Konsentrasi Keahlian Unggulan • Siap Kerja, Santun & Berdaya Saing Global",
    tone: "blue",
    image: "/images/prestasi/lulusan-unggul-globalisasi.webp",
  },
];

export const PRESTASI_DETAIL: Record<string, PrestasiStaticDetail> = {
  "smk-negeri-2-mojokerto-bawa-pulang-medali-perak-lks-nasional-2024": {
    predikat: "Medali Perak (Juara 2 Nasional)",
    tingkat: "Tingkat Nasional",
    bulan: "Agustus 2024",
    title: "SMK Negeri 2 Mojokerto Bawa Pulang Medali Perak di Ajang LKS Nasional 2024",
    hero: "/images/prestasi/medali-perak-lks-2024.webp",
    siswa: {
      nama: "Ahmed Husein Jalili & M. Dzakaa Irawan",
      kelas: "Konsentrasi Keahlian Kuliner • SMKN 2 Kota Mojokerto",
      foto: "/images/prestasi/medali-perak-lks-2024.webp",
    },
    tanggal: "19 – 24 Agustus 2024",
    lokasi: "Provinsi Lampung",
    penyelenggara: "Balai Pengembangan Talenta Indonesia (BPTI) Kemendikbudristek",
    ringkasan:
      "Siswa Jurusan Kuliner SMKN 2 Kota Mojokerto berhasil mengharumkan nama Jawa Timur dengan membawa pulang Medali Perak (Juara 2 Nasional) bidang lomba Patisserie and Confectionery pada ajang Lomba Kompetensi Siswa (LKS) SMK Tingkat Nasional ke-XXXII di Lampung.",
    deskripsi: [
      "SMK Negeri 2 Kota Mojokerto kembali membuktikan kualitas pendidikan vokasinya di kancah nasional. Mewakili Provinsi Jawa Timur pada ajang Lomba Kompetensi Siswa (LKS) SMK Tingkat Nasional ke-XXXII Tahun 2024 di Lampung, delegasi Jurusan Kuliner SMKN 2 Kota Mojokerto sukses menyabet Medali Perak pada bidang lomba Patisserie and Confectionery.",
      "Capaian membanggakan ini diraih oleh Ahmed Husein Jalili sebagai peserta utama didampingi oleh Mohammad Dzakaa Irawan sebagai helper. Keduanya berhasil memukau dewan juri nasional melalui ketepatan teknik pembuatan pastry, estetika penyajian produk coklat dan entremets, serta manajemen waktu dan kebersihan dapur berstandar hotel bintang lima.",
      "Keberhasilan di panggung nasional ini merupakan buah dari persiapan intensif selama lebih dari 10 bulan di bawah bimbingan guru produktif Kuliner serta dukungan penuh manajemen sekolah. Prestasi ini sekaligus turut berkontribusi mengantarkan Kontingen Jawa Timur meraih predikat Juara Umum LKS SMK Tingkat Nasional.",
      "Sumber: Radar Mojokerto (Jawa Pos Group), https://radarmojokerto.jawapos.com/pendidikan/2409060009/smk-negeri-2-mojokerto-bawa-pulang-medali-perak-di-ajang-lks-nasional-2024",
    ],
    testimoni: {
      quote:
        "Latihan intensif selama sepuluh bulan terbayar lunas ketika nama SMKN 2 Kota Mojokerto dan Jawa Timur dipanggil meraih Medali Perak LKS Nasional. Ini bukti bahwa siswa vokasi mampu bersaing di level tertinggi.",
      nama: "Bapak Drs. H. Iswahyudi, M.Pd.",
      jabatan: "Kepala SMKN 2 Kota Mojokerto",
    },
    galeri: {
      judul: "Dokumentasi LKS Nasional",
      deskripsi: "Momen perjuangan dan kreasi Patisserie & Confectionery siswa SMKN 2 Kota Mojokerto.",
      foto: ["/images/prestasi/medali-perak-lks-2024.webp", "/images/fasilitas/tb-2.jpg", "/images/fasilitas/tb-3.jpg"],
    },
  },
  "kadindik-jatim-apresiasi-multie-mie-inovasi-siswa-smkn-2-mojokerto-fiksi": {
    predikat: "Apresiasi & Finalis Nasional FIKSI",
    tingkat: "Tingkat Nasional",
    bulan: "Oktober 2025",
    title: "Kadindik Jatim Apresiasi Multie Mie Inovasi Siswa SMKN 2 Mojokerto yang Trendy, Bergizi, dan Siap Bersaing di Panggung Nasional FIKSI",
    hero: "/images/prestasi/multie-mie-fiksi.webp",
    siswa: {
      nama: "Tim Inovasi Kolaborasi Siswa (Tata Boga, APHP & DKV)",
      kelas: "Lintas Konsentrasi Keahlian • SMKN 2 Kota Mojokerto",
      foto: "/images/prestasi/multie-mie-fiksi.webp",
    },
    tanggal: "Oktober 2025",
    lokasi: "Surabaya & Tingkat Nasional",
    penyelenggara: "Dinas Pendidikan Prov. Jatim & BPTI Kemendikdasmen (FIKSI)",
    ringkasan:
      "Kepala Dinas Pendidikan Provinsi Jawa Timur Aries Agung Paewai memberikan apresiasi tinggi terhadap produk inovasi 'Multie Mie' (Multi Color With Nutrition) karya kolaborasi siswa SMKN 2 Kota Mojokerto yang menembus panggung nasional Festival Inovasi dan Kewirausahaan Siswa Indonesia (FIKSI).",
    deskripsi: [
      "Kepala Dinas Pendidikan Provinsi Jawa Timur, Aries Agung Paewai, mengapresiasi secara langsung inovasi produk pangan kreatif 'Multie Mie' (Multi Color With Nutrition) hasil karya siswa-siswi SMKN 2 Kota Mojokerto. Produk mi instan cup sehat ini dinilai tidak hanya trendy di kalangan generasi muda, tetapi juga sarat nilai gizi dan ramah lingkungan.",
      "Multie Mie merupakan wujud kolaborasi lintas konsentrasi keahlian di SMKN 2 Kota Mojokerto, memadukan keahlian siswa Agribisnis Pengolahan Hasil Pertanian (APHP), Kuliner (Tata Boga), dan Desain Komunikasi Visual (DKV). Mi dibuat tanpa bahan pengawet dengan pewarna serta nutrisi alami dari bahan lokal seperti daun kelor (hijau), kunyit (kuning), dan buah bit (merah).",
      "Keunggulan lain yang menjadi sorotan dewan juri FIKSI (Festival Inovasi dan Kewirausahaan Siswa Indonesia) adalah penggunaan kemasan bumbu berbasis edible film dari pati singkong yang dapat larut bersama air seduhan, sehingga mengurangi limbah plastik sekali pakai. Inovasi ini membuktikan kesiapan siswa SMKN 2 Kota Mojokerto bersaing di panggung kewirausahaan nasional.",
      "Sumber: Dinas Pendidikan Provinsi Jawa Timur, https://dindik.jatimprov.go.id/news-detail/1089/kadindik-jatim-apresiasi-multie-mie-inovasi-siswa-smkn-2-mojokerto-yang-trendy-bergizi-dan-siap-bersaing-di-panggung-nasional-fiksi",
    ],
    testimoni: {
      quote:
        "Inovasi Multie Mie karya siswa SMKN 2 Mojokerto sangat luar biasa—menggabungkan gizi lokal, kemasan ramah lingkungan edible film, dan desain kemasan modern yang siap bersaing di tingkat nasional FIKSI.",
      nama: "Dr. Aries Agung Paewai, S.STP., M.M.",
      jabatan: "Kepala Dinas Pendidikan Provinsi Jawa Timur",
    },
    galeri: {
      judul: "Galeri Inovasi Multie Mie",
      deskripsi: "Produk Multie Mie hasil kolaborasi lintas jurusan SMKN 2 Kota Mojokerto.",
      foto: ["/images/prestasi/multie-mie-fiksi.webp", "/images/produk/beimie.jpg"],
    },
  },
  "silvia-nadhifa-terpilih-sebagai-duta-anti-narkoba-kota-mojokerto-2026": {
    predikat: "Juara / Duta Terpilih",
    tingkat: "Tingkat Kota Mojokerto",
    bulan: "Oktober 2026",
    title: "Silvia Nadhifa dari SMKN 2 Kota Mojokerto Terpilih sebagai Duta Anti Narkoba Kota Mojokerto 2026",
    hero: "/images/prestasi/duta-anti-narkoba-2026.webp",
    siswa: {
      nama: "Silvia Nadhifa",
      kelas: "Siswi Kelas XI • SMKN 2 Kota Mojokerto",
      foto: "/images/prestasi/duta-anti-narkoba-2026.webp",
    },
    tanggal: "Oktober 2026",
    lokasi: "Ruang Sabha Mandala Madya, Balai Kota Mojokerto",
    penyelenggara: "Pemkot Mojokerto, BNN Kota Mojokerto & Disporapar",
    ringkasan:
      "Silvia Nadhifa, siswi kelas XI SMKN 2 Kota Mojokerto, sukses dinobatkan sebagai Duta Anti Narkoba Kota Mojokerto Tahun 2026 setelah melewati tahapan seleksi ketat dan malam Grand Final di Balai Kota Mojokerto.",
    deskripsi: [
      "Prestasi membanggakan kembali ditorehkan oleh siswa-siswi SMKN 2 Kota Mojokerto di bidang pengembangan karakter dan kepemimpinan remaja. Silvia Nadhifa, siswi kelas XI SMKN 2 Kota Mojokerto, resmi terpilih sebagai Duta Anti Narkoba Kota Mojokerto Tahun 2026 bersama perwakilan pelajar terbaik lainnya.",
      "Ajang pemilihan yang diselenggarakan oleh Pemerintah Kota Mojokerto bekerja sama dengan Badan Narkotika Nasional (BNN) dan Dinas Kepemudaan, Olahraga, dan Pariwisata (Disporapar) ini diikuti oleh puluhan pelajar SMA/SMK sederajat se-Kota Mojokerto. Para peserta diuji dalam hal wawasan P4GN (Pencegahan dan Pemberantasan Penyalahgunaan dan Peredaran Gelap Narkotika), kemampuan public speaking, serta program kerja kreatif.",
      "Sebagai Duta Anti Narkoba 2026, Silvia Nadhifa mengemban peran strategis sebagai pelopor edukasi sebaya (peer educator) untuk mengampanyekan gaya hidup sehat, produktif, dan bersih dari narkoba di lingkungan sekolah maupun komunitas remaja Kota Mojokerto.",
      "Sumber: Jatimnet.com, https://jatimnet.com/evan-ong-dan-silvia-nadhifa-terpilih-jadi-duta-anti-narkoba-kota-mojokerto-2026",
    ],
    testimoni: {
      quote:
        "Terpilihnya Silvia Nadhifa sebagai Duta Anti Narkoba Kota Mojokerto 2026 menunjukkan bahwa siswa SMKN 2 Kota Mojokerto aktif menjadi teladan positif dan agen perubahan bagi generasi muda.",
      nama: "Bapak Drs. H. Iswahyudi, M.Pd.",
      jabatan: "Kepala SMKN 2 Kota Mojokerto",
    },
    galeri: {
      judul: "Momen Penganugerahan Duta Anti Narkoba",
      deskripsi: "Penampilan dan penganugerahan Duta Anti Narkoba Kota Mojokerto 2026.",
      foto: ["/images/prestasi/duta-anti-narkoba-2026.webp"],
    },
  },
  "smkn-2-mojokerto-semangat-dalam-kompetisi-sukses-torehkan-prestasi": {
    predikat: "Sekolah Adiwiyata & Juara FESTIKA",
    tingkat: "Tingkat Provinsi Jawa Timur",
    bulan: "Desember 2025",
    title: "SMKN 2 Mojokerto Semangat dalam Kompetisi, Sukses Torehkan Prestasi",
    hero: "/images/prestasi/semangat-kompetisi.webp",
    siswa: {
      nama: "Kontingen Siswa & Warga Sekolah",
      kelas: "SMKN 2 Kota Mojokerto",
      foto: "/images/prestasi/semangat-kompetisi.webp",
    },
    tanggal: "Desember 2025",
    lokasi: "Kota Mojokerto & Surabaya",
    penyelenggara: "Dinas Lingkungan Hidup & Dinas Pendidikan Provinsi Jawa Timur",
    ringkasan:
      "Mengusung slogan 'Disiplin Berprestasi', SMKN 2 Kota Mojokerto sukses memborong berbagai kejuaraan di ajang FESTIKA Jawa Timur 2025 sekaligus meraih penghargaan Sekolah Adiwiyata Tingkat Provinsi Jawa Timur.",
    deskripsi: [
      "Di bawah kepemimpinan Kepala Sekolah beserta jajaran pendidik yang berdedikasi, SMKN 2 Kota Mojokerto terus menyalakan semangat berkompetisi di berbagai bidang akademik maupun non-akademik. Budaya 'Disiplin Berprestasi' menjadi motor penggerak bagi seluruh warga sekolah untuk melahirkan karya dan capaian terbaik.",
      "Sepanjang tahun kompetisi, para siswa berhasil menorehkan prestasi membanggakan di berbagai ajang bergengsi, termasuk Festival Teknologi Informasi dan Komunikasi Pendidikan (FESTIKA) Jawa Timur 2025 serta kejuaraan keterampilan vokasi tingkat regional dan provinsi.",
      "Tidak hanya unggul dalam kompetisi siswa, komitmen SMKN 2 Kota Mojokerto dalam mewujudkan lingkungan belajar yang hijau, bersih, dan berkelanjutan juga membuahkan penghargaan Sekolah Adiwiyata Provinsi Jawa Timur setelah berhasil menembus jajaran Top 20 Calon Sekolah Adiwiyata Provinsi (CSAP).",
      "Sumber: Radar Mojokerto (Jawa Pos Group), https://radarmojokerto.jawapos.com/pendidikan/2512260002/smkn-2-mojokerto-semangat-dalam-kompetisi-sukses-torehkan-prestasi",
    ],
    testimoni: {
      quote:
        "Semangat berkompetisi harus selalu tumbuh di hati setiap siswa. Dengan disiplin, kerja keras, dan kolaborasi seluruh warga sekolah, prestasi demi prestasi akan terus kita torehkan.",
      nama: "Bapak Drs. H. Iswahyudi, M.Pd.",
      jabatan: "Kepala SMKN 2 Kota Mojokerto",
    },
    galeri: {
      judul: "Deretan Penghargaan Sekolah",
      deskripsi: "Dokumentasi penyerahan piala kompetisi siswa dan penghargaan Sekolah Adiwiyata Provinsi.",
      foto: ["/images/prestasi/semangat-kompetisi.webp"],
    },
  },
  "smkn-2-mojokerto-cetak-lulusan-unggul-dan-berkarakter-di-era-globalisasi": {
    predikat: "Capaian Lulusan Unggul",
    tingkat: "Tingkat Nasional & Industri",
    bulan: "Juni 2025",
    title: "SMKN 2 Mojokerto Cetak Lulusan Unggul dan Berkarakter di Era Globalisasi",
    hero: "/images/prestasi/lulusan-unggul-globalisasi.webp",
    siswa: {
      nama: "Lulusan 5 Konsentrasi Keahlian",
      kelas: "RPL, Kuliner, DKV, APHP & LPS • SMKN 2 Kota Mojokerto",
      foto: "/images/prestasi/lulusan-unggul-globalisasi.webp",
    },
    tanggal: "Juni 2025",
    lokasi: "SMKN 2 Kota Mojokerto",
    penyelenggara: "SMKN 2 Kota Mojokerto & Mitra Dunia Usaha Dunia Industri (DUDI)",
    ringkasan:
      "Melalui penguatan kurikulum berbasis industri, fasilitas Teaching Factory, dan pembinaan karakter, SMKN 2 Kota Mojokerto konsisten mencetak lulusan unggul yang terserap di dunia kerja, perguruan tinggi negeri, dan wirausaha mandiri.",
    deskripsi: [
      "Menghadapi tantangan era globalisasi dan transformasi digital, SMK Negeri 2 Kota Mojokerto terus berinovasi dalam menyelenggarakan pendidikan kejuruan yang adaptif. Melalui lima konsentrasi keahlian unggulan—Rekayasa Perangkat Lunak (RPL), Kuliner, Desain Komunikasi Visual (DKV), Agribisnis Pengolahan Hasil Pertanian (APHP), serta Layanan Perbankan Syariah (LPS)—sekolah menyiapkan lulusan dengan kompetensi berstandar industri.",
      "Sinergi erat bersama puluhan mitra Dunia Usaha dan Dunia Industri (DUDI) melalui program sinkronisasi kurikulum, guru tamu industri, Praktik Kerja Lapangan (PKL), hingga sertifikasi kompetensi memastikan setiap lulusan memiliki daya saing tinggi saat memasuki pasar kerja global.",
      "Selain penguasaan hard skills, SMKN 2 Kota Mojokerto menempatkan pendidikan karakter, kedisiplinan, dan etika kerja sebagai fondasi utama. Hasilnya, tingkat keterserapan lulusan (BMW: Bekerja, Melanjutkan studi ke PTN, dan Wirausaha) terus meningkat dari tahun ke tahun.",
      "Sumber: Radar Mojokerto (Jawa Pos Group), https://radarmojokerto.jawapos.com/berita-terbaru/2506170010/smkn-2-mojokerto-cetak-lulusan-unggul-dan-berkarakter-di-era-globalisasi",
    ],
    testimoni: {
      quote:
        "Tujuan utama kami adalah mencetak lulusan yang tidak hanya terampil secara teknis, tetapi juga berkarakter kuat, berakhlak mulia, dan siap beradaptasi dengan cepat di era globalisasi.",
      nama: "Bapak Drs. H. Iswahyudi, M.Pd.",
      jabatan: "Kepala SMKN 2 Kota Mojokerto",
    },
    galeri: {
      judul: "Pembelajaran Vokasi & Karakter",
      deskripsi: "Kegiatan praktik standar industri dan pembinaan karakter siswa SMKN 2 Kota Mojokerto.",
      foto: ["/images/prestasi/lulusan-unggul-globalisasi.webp"],
    },
  },
};

export const getPrestasiDetail = (slug: string): PrestasiStaticDetail | null => {
  const base = PRESTASI_LIST.find((item) => item.slug === slug);
  if (!base) return null;
  const detail = PRESTASI_DETAIL[slug];
  if (detail) return detail;

  // Prestasi tanpa konten lengkap memakai ringkasan dari daftar
  return {
    predikat: base.badge,
    tingkat: `Tingkat ${base.level}`,
    bulan: base.date,
    title: base.title,
    hero: base.image || "/prestasi-utama.webp",
    siswa: { nama: base.subtitle, kelas: "SMKN 2 Kota Mojokerto", foto: null },
    tanggal: base.date,
    lokasi: "-",
    penyelenggara: "-",
    ringkasan: base.title,
    deskripsi: [base.subtitle],
    testimoni: null,
    galeri: null,
  };
};
