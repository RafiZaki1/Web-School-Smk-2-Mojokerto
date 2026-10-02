const DEFAULT_GALLERY = [
  "/images/ekstra/paskibra-1.jpg",
  "/images/ekstra/paskibra-2.jpg",
  "/images/ekstra/paskibra-3.jpg",
  "/images/ekstra/paskibra-4.jpg",
];

const DEFAULT_ACHIEVEMENTS = [
  { icon: "trophy", text: "Juara 1 Lomba Baris-Berbaris Tingkat Kota Mojokerto — 2024" },
  { icon: "medal", text: "2 Siswa terpilih jadi Paskibraka Kota Mojokerto — 2025" },
];

export const EKSTRA_DATA = {
  paskibra: {
    id: "paskibra",
    name: "Paskibra",
    subtitle: "Disiplin & kepemimpinan",
    icon: "flag",
    image: "/paskib.png",
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
    testimoni: {
      quote:
        "Latihan di Paskibra ngajarin aku disiplin waktu dan cara memimpin teman-teman, yang ternyata sangat bermanfaat bukan hanya di luar kegiatan sekolah.",
      author: "Anggota Paskibra, kelas 11",
    },
  },
  futsal: {
    id: "futsal",
    name: "Futsal",
    subtitle: "Kerja sama & sportivitas",
    icon: "ball",
    image: "/futsal.png",
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
      { icon: "trophy", text: "Juara 3 Turnamen Futsal Tunas Cup — 2026" },
      { icon: "medal", text: "Peserta Liga Futsal Pelajar Kota Mojokerto — 2025" },
    ],
    testimoni: {
      quote:
        "Bermain futsal bersama bukan hanya tentang mencetak gol, tetapi juga belajar bekerja sama, menjaga kekompakan, dan membangun semangat untuk berjuang bersama dalam setiap pertandingan.",
      author: "Anggota Ekstrakurikuler Futsal",
    },
  },
  tari: {
    id: "tari",
    name: "Tari",
    subtitle: "Seni & budaya",
    icon: "music",
    image: "/Tari.png",
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
    testimoni: {
      quote:
        "Menari bersama bukan hanya tentang menghafal setiap gerakan, tetapi juga belajar percaya diri, bekerja sama, dan mengekspresikan diri melalui setiap karya yang kami tampilkan.",
      author: "Anggota Ekstrakurikuler Tari",
    },
  },
  pikr: {
    id: "pikr",
    name: "Pik-r",
    subtitle: "Edukasi",
    icon: "hand-heart",
    image: "/Pik-r.jpeg",
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
    prestasi: [{ icon: "trophy", text: "Duta Genre Kota Mojokerto — 2025" }],
    testimoni: {
      quote: "Di Pik-r aku belajar mendengarkan teman dan berani bicara soal hal-hal penting dengan cara yang menyenangkan.",
      author: "Anggota Pik-r, kelas 11",
    },
  },
};

export const EKSTRA_LIST = Object.values(EKSTRA_DATA);
