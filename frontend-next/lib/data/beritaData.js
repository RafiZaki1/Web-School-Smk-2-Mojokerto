export const BERITA_KATEGORI = ["Informasi umum", "Prestasi", "Agenda sekolah", "Pengumuman", "Karya siswa"];

// Warna lencana kategori di daftar berita
export const KATEGORI_TONES = {
  Prestasi: "bg-[#fef9c3] text-[#a16207]",
  "Agenda sekolah": "bg-[#e0e7ff] text-[#4338ca]",
  "Informasi umum": "bg-[#dcfce7] text-[#15803d]",
  Pengumuman: "bg-[#ffedd5] text-[#c2410c]",
  "Karya siswa": "bg-[#fef9c3] text-[#a16207]",
};

// thumb = foto; bila kosong dipakai gradien
export const BERITA = [
  {
    slug: "siswa-gim-ciptakan-game-edukasi-ar",
    category: "Prestasi",
    title: "Siswa jurusan pengembangan gim SMKN 2 Kota Mojokerto ciptakan game edukasi AR untuk kenalkan batik Malang kepada anak-anak",
    date: "19 Juli 2026",
    thumb: "/images/berita/thumb-1.jpg",
    gradient: "from-[#3b82f6] to-[#1e40af]",
  },
  {
    slug: "belajar-teknologi-standar-global",
    category: "Agenda sekolah",
    title: "Belajar teknologi dengan standar global di SMK Negeri 2 Kota Mojokerto",
    date: "6 Maret 2026",
    gradient: "from-[#3b82f6] to-[#1e40af]",
  },
  {
    slug: "siswa-diterima-24-kampus-luar-negeri",
    category: "Informasi umum",
    title: "Belum lulus, siswa SMK sudah diterima 24 kampus luar negeri sekaligus",
    date: "3 Juli 2026",
    gradient: "from-[#4caf50] to-[#2e7d32]",
  },
  {
    slug: "jadwal-libur-semester-genap",
    category: "Pengumuman",
    title: "Jadwal libur semester genap tahun ajaran 2025/2026",
    date: "28 Februari 2026",
    gradient: "from-[#ef5a3c] to-[#b9382a]",
  },
  {
    slug: "pameran-karya-desain-dkv",
    category: "Karya siswa",
    title: "Pameran karya desain siswa jurusan DKV angkatan 2026",
    date: "15 Februari 2026",
    gradient: "from-[#e5c100] to-[#b38f00]",
  },
  {
    slug: "job-fair-bkk",
    category: "Agenda sekolah",
    title: "Job Fair BKK bersama 20+ perusahaan mitra industri",
    date: "2 Februari 2026",
    gradient: "from-[#334155] to-[#1e293b]",
  },
  {
    slug: "ukk-dkv-2024",
    category: "Prestasi",
    title: "Selamat dan Sukses! Desain Komunikasi Visual SMK Negeri 2 Mojokerto Laksanakan Uji Kompetensi Keahlian",
    date: "3 Maret 2024",
    thumb: "/images/berita/hero-1.jpg",
    gradient: "from-[#3b82f6] to-[#1e40af]",
  },
];

const UKK_DETAIL = {
  author: "Admin Sekolah",
  hero: "/images/berita/hero-1.jpg",
  paragraphs: [
    "Uji Kompetensi Keahlian (UKK) Desain Komunikasi Visual dilaksanakan pada Senin-Rabu, 24-26 Februari 2024 oleh siswa kelas XII. Kegiatan ini bertujuan mengukur pencapaian kompetensi peserta didik yang telah menyelesaikan proses pembelajaran sesuai konsentrasi keahlian dari kelas X, dan dibuktikan dengan sertifikat kompetensi.",
    "Materi yang diujikan meliputi rebranding potensi Kota Mojokerto — tempat kuliner, fasilitas olahraga, wisata budaya, hingga ruang terbuka hijau — dengan output berupa logo, karya foto, poster, desain feed instagram, hingga video vlog.",
    "Kegiatan ini mendapat dukungan langsung dari Kepala Sekolah dan Kepala Kompetensi Keahlian DKV, dengan harapan siswa dapat terus mengembangkan kemampuan desain untuk perkuliahan maupun dunia kerja.",
  ],
  gallery: ["/images/berita/galeri-1.jpg", "/images/berita/galeri-2.jpg", "/images/berita/galeri-3.jpg"],
};

export const getBerita = (slug) => {
  const item = BERITA.find((berita) => berita.slug === slug);
  if (!item) return null;
  if (slug === "ukk-dkv-2024" || slug === "siswa-gim-ciptakan-game-edukasi-ar") return { ...item, ...UKK_DETAIL };
  return {
    ...item,
    author: "Admin Sekolah",
    hero: item.thumb ?? null,
    paragraphs: [`${item.title}. Informasi lengkap mengenai kegiatan ini akan diperbarui oleh admin sekolah.`],
    gallery: [],
  };
};
