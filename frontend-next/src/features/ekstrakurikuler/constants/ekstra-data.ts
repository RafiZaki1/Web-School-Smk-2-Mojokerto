export interface EkstraStatic {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  image: string;
  desc: string;
  jadwal: string;
  lokasi: string;
  anggota: string;
  tentangLabel: string;
  tentangTitle: string;
  tentang: string;
  gallery: string[];
  prestasiTitle: string;
  prestasi: { icon: string; text: string }[];
  testimoni: { quote: string; author: string } | null;
}

const DEFAULT_GALLERY: string[] = [
  "/images/ekstra/paskibra-1.jpg",
  "/images/ekstra/paskibra-2.jpg",
  "/images/ekstra/paskibra-3.jpg",
  "/images/ekstra/paskibra-4.jpg",
];

const DEFAULT_ACHIEVEMENTS: { icon: string; text: string }[] = [
  { icon: "trophy", text: "Juara 1 Lomba Baris-Berbaris Tingkat Kota Mojokerto (2024)" },
  { icon: "medal", text: "2 Siswa terpilih jadi Paskibraka Kota Mojokerto (2025)" },
];

export const EKSTRA_DATA: Record<string, EkstraStatic> = {
  paskibra: {
    id: "paskibra",
    name: "Paskibra",
    subtitle: "Disiplin & kepemimpinan",
    icon: "flag",
    image: "/paskib.webp",
    desc: "Membentuk karakter disiplin, tanggung jawab, dan jiwa kepemimpinan melalui latihan baris-berbaris serta kegiatan upacara.",
    jadwal: "Selasa & Jumat",
    lokasi: "Lapangan Upacara",
    anggota: "45 Siswa",
    tentangLabel: "Tentang Paskibra",
    tentangTitle: "Lebih dari sekadar baris-berbaris",
    tentang:
      "Paskibra melatih siswa menjadi pribadi yang disiplin, tangguh, dan siap memimpin. Anggota rutin bertugas dalam upacara bendera sekolah dan berkesempatan mewakili sekolah dalam seleksi Paskibra di tingkat kota.",
    gallery: DEFAULT_GALLERY,
    prestasiTitle: "Pencapaian anggota Paskibra",
    prestasi: DEFAULT_ACHIEVEMENTS,
    testimoni: null,
  },
  futsal: {
    id: "futsal",
    name: "Futsal",
    subtitle: "Kerja sama & sportivitas",
    icon: "ball",
    image: "/futsal.webp",
    desc: "Mengasah keterampilan fisik, kelincahan teknik, strategi tim, dan menjunjung tinggi sportivitas dalam olahraga futsal.",
    jadwal: "Selasa & Kamis",
    lokasi: "Lapangan Futsal",
    anggota: "45 Siswa",
    tentangLabel: "Tentang Ekstrakurikuler Futsal",
    tentangTitle: "Lebih dari sekedar olahraga",
    tentang:
      "Futsal menjadi wadah bagi siswa untuk melatih fisik, strategi, dan kekompakan tim. Setiap latihan menjadi kesempatan untuk belajar sportivitas, saling percaya, dan memberikan penampilan terbaik di setiap pertandingan.",
    gallery: DEFAULT_GALLERY,
    prestasiTitle: "Pencapaian Futsal SMKN 2 Mojokerto",
    prestasi: [
      { icon: "trophy", text: "Juara 3 Turnamen Futsal Tunas Cup (2026)" },
      { icon: "medal", text: "Peserta Liga Futsal Pelajar Kota Mojokerto (2025)" },
    ],
    testimoni: null,
  },
  tari: {
    id: "tari",
    name: "Tari",
    subtitle: "Seni & budaya",
    icon: "music",
    image: "/Tari.webp",
    desc: "Ekstrakurikuler Tari menjadi wadah bagi siswa untuk mengembangkan bakat, kreativitas, dan kemampuan dalam seni tari, serta melestarikan budaya melalui setiap gerakan dan karya.",
    jadwal: "Selasa & Jumat",
    lokasi: "Lapangan Upacara",
    anggota: "45 Siswa",
    tentangLabel: "Tentang Ekstrakurikuler Tari",
    tentangTitle: "Lebih dari sekedar gerakan",
    tentang:
      "Tari menjadi wadah bagi siswa untuk mengekspresikan diri, mengembangkan kreativitas, dan melestarikan seni budaya. Setiap latihan menjadi kesempatan untuk belajar kekompakan, menghayati setiap gerakan, dan menampilkan karya terbaik.",
    gallery: DEFAULT_GALLERY,
    prestasiTitle: "Pencapaian anggota Tari",
    prestasi: DEFAULT_ACHIEVEMENTS,
    testimoni: null,
  },
  pikr: {
    id: "pikr",
    name: "Pik-r",
    subtitle: "Edukasi",
    icon: "hand-heart",
    image: "/Pik-r.webp",
    desc: "Pusat informasi dan konseling remaja sebaya untuk membentuk generasi muda yang cerdas, peduli, sehat, dan berencana.",
    jadwal: "Rabu",
    lokasi: "Ruang BK",
    anggota: "30 Siswa",
    tentangLabel: "Tentang Pik-r",
    tentangTitle: "Teman sebaya yang siap mendengar",
    tentang:
      "Pik-r membekali anggotanya dengan wawasan kesehatan remaja, keterampilan konseling sebaya, dan kampanye positif agar teman-teman di sekolah tumbuh menjadi pribadi yang sehat, peduli, dan berencana.",
    gallery: DEFAULT_GALLERY,
    prestasiTitle: "Pencapaian anggota Pik-r",
    prestasi: [{ icon: "trophy", text: "Duta Genre Kota Mojokerto (2025)" }],
    testimoni: null,
  },
};

export const EKSTRA_LIST: EkstraStatic[] = Object.values(EKSTRA_DATA);
