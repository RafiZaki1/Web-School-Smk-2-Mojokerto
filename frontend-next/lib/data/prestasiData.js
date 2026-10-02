// tone menentukan gradien kepala kartu di halaman "Semua Prestasi"
export const PRESTASI_LIST = [
  {
    slug: "lomba-menulis-surat-gubernur",
    badge: "Juara 1",
    cardTitle: "Lomba Menulis Surat Untuk Gubernur",
    title: "Lomba Menulis Surat Untuk Gubernur Memperingati Hari Pendidikan",
    date: "April 2026",
    level: "Nasional",
    kategori: "Akademik",
    year: "2026",
    subtitle: "Carla Nur Parawansa • Kelas XII LPS 2",
    tone: "blue",
  },
  {
    slug: "duta-koperasi-provinsi",
    badge: "Juara 1",
    cardTitle: "Duta Koperasi",
    title: "Duta Koperasi",
    date: "Juni 2026",
    level: "Lokal",
    kategori: "Non-akademik",
    year: "2026",
    subtitle: "Juara 1 Putri • Vania Garnetta Putri XII LPS 2",
    tone: "teal",
  },
  {
    slug: "turnamen-futsal-tunas-cup-2026",
    badge: "Juara 3",
    cardTitle: "Turnamen Futsal Tunas Cup 2026",
    title: "Turnamen Futsal Tunas Cup 2026",
    date: "Juni 2026",
    level: "Lokal",
    kategori: "Olahraga",
    year: "2026",
    subtitle: "Juara 3 • Tim Futsal SMKN 2 Mojokerto",
    tone: "indigo",
  },
  {
    slug: "kejurprov-dayung-2026",
    badge: "Medali",
    cardTitle: "Kejuaraan Provinsi (Kejurprov) Dayung 2026",
    title: "Kejuaraan Provinsi (Kejurprov) Dayung 2026",
    date: "Mei 2026",
    level: "Provinsi",
    kategori: "Olahraga",
    year: "2026",
    subtitle: "Medali Perunggu • Ayu Pinky Salsabila",
    tone: "sky",
  },
  {
    slug: "graphic-design-technology",
    badge: "Juara 3",
    cardTitle: "Graphic Design Technology",
    title: "Graphic Design Technology",
    date: "April 2026",
    level: "Nasional",
    kategori: "Akademik",
    year: "2026",
    subtitle: "Juara 3 • Tim Karya Siswa XII DKV",
    tone: "teal",
  },
  {
    slug: "lomba-debat-bahasa-inggris",
    badge: "Juara 2",
    cardTitle: "Lomba Debat Bahasa Inggris",
    title: "Lomba Debat Bahasa Inggris Se-Jawa Timur",
    date: "Maret 2026",
    level: "Regional",
    kategori: "Akademik",
    year: "2026",
    subtitle: "Juara 2 • Tim Debat XI Bahasa",
    tone: "indigo",
  },
];

export const PRESTASI_DETAIL = {
  "duta-koperasi-provinsi": {
    predikat: "Juara 1",
    tingkat: "Tingkat Provinsi",
    bulan: "Juni 2026",
    title: "Duta Koperasi Provinsi",
    hero: "/images/prestasi/galeri-2.jpg",
    siswa: { nama: "Carla Nur Parawansa", kelas: "Kelas XII LPS 2 • SMKN 2 Kota Mojokerto", foto: "/images/prestasi/carla-avatar.jpg" },
    tanggal: "12 - 15 Juni 2026",
    lokasi: "Gedung Negara Grahadi, Surabaya",
    penyelenggara: "Dinas Koperasi dan UKM Prov. Jatim",
    ringkasan:
      "Pemilihan Duta Koperasi Tingkat Provinsi Jawa Timur merupakan ajang bergengsi yang diselenggarakan untuk meningkatkan kesadaran generasi muda terhadap pentingnya perkoperasian dalam perekonomian nasional.",
    deskripsi: [
      "Carla Nur Parawansa siswi berprestasi dari SMKN 2 Kota Mojokerto, berhasil menyisihkan ratusan peserta dari berbagai kabupaten/kota se-Jawa Timur. Kompetisi ini menguji pengetahuan komprehensif mengenai sejarah, prinsip, dan penerapan koperasi modern di era digital. Selain tes tertulis, peserta juga dinilai berdasarkan kemampuan public speaking, problem solving, dan penyusunan makalah inovasi koperasi sekolah.",
      'Gelar "Juara 1 Duta Koperasi" ini bukan sekadar penghargaan, melainkan tanggung jawab baru bagi Carla untuk menjadi agen perubahan yang mensosialisasikan nilai-nilai gotong royong dan kemandirian ekonomi kepada rekan-rekan sebayanya. Prestasi ini juga mengukuhkan komitmen SMKN 2 Kota Mojokerto dalam mencetak lulusan yang tidak hanya unggul secara akademis, tetapi juga memiliki jiwa kepemimpinan dan wawasan kewirausahaan yang tangguh.',
    ],
    testimoni: {
      quote:
        "Prestasi Carla membuktikan bahwa koperasi bukanlah konsep usang, melainkan motor penggerak ekonomi masa depan yang sangat relevan dengan generasi muda.",
      nama: "Bapak Iswahyudi, S.ST.",
      jabatan: "Kepala SMKN 2 Kota Mojokerto",
    },
    galeri: {
      judul: "Galeri Momen",
      deskripsi: "Kumpulan dokumentasi selama proses seleksi hingga malam penganugerahan Duta Koperasi.",
      foto: ["/images/prestasi/galeri-1.jpg", "/images/prestasi/galeri-2.jpg", "/images/prestasi/galeri-3.jpg"],
    },
  },
};

export const getPrestasiDetail = (slug) => {
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
    hero: "/prestasi-utama.png",
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
