import type { ElearningTeacher } from "@/features/portal-belajar/types/portal-belajar.type";

/**
 * Daftar Bapak & Ibu Guru Mata Pelajaran Umum (Normatif & Adaptif)
 * berdasarkan struktur kategori pembelajaran di http://smkn2mojokerto.my.id/
 */
export const GURU_UMUM_DAN_BK: ElearningTeacher[] = [
  // Matematika
  { id: "alif-nursyah", name: "Alif Nursyah, S.Pd.", role: "Guru Matematika", group: "umum", subjects: ["Matematika"], categoryId: 4 },
  { id: "fajar-dhilamaya", name: "Fajar Dhilamaya, S.Pd.", role: "Guru Matematika", group: "umum", subjects: ["Matematika"], categoryId: 117 },
  { id: "mega-novinda-sari", name: "Mega Novinda Sari, S.Pd.", role: "Guru Matematika", group: "umum", subjects: ["Matematika"], categoryId: 118 },
  { id: "elok-zakiyatul", name: "Elok Zakiyatul M., S.Si.", role: "Guru Matematika", group: "umum", subjects: ["Matematika"], categoryId: 119 },
  { id: "sri-wahyuni", name: "Sri Wahyuni, S.Pd.", role: "Guru Matematika & KIK", group: "umum", subjects: ["Matematika", "Kreativitas, Inovasi & Kewirausahaan (KIK)"], categoryId: 120 },

  // Bahasa Indonesia
  { id: "oktavia-catur-handini", name: "Oktavia Catur Handini, S.Pd.", role: "Guru Bahasa Indonesia", group: "umum", subjects: ["Bahasa Indonesia"], categoryId: 25 },
  { id: "mochammad-asrori", name: "Mochammad Asrori, S.Pd.", role: "Guru Bahasa Indonesia", group: "umum", subjects: ["Bahasa Indonesia"], categoryId: 122 },
  { id: "indah-chodijah", name: "Indah Chodijah, S.Pd.", role: "Guru Bahasa Indonesia", group: "umum", subjects: ["Bahasa Indonesia"], categoryId: 123 },
  { id: "septa-yuda-pratama", name: "Septa Yuda Pratama, S.Pd.", role: "Guru Bahasa Indonesia", group: "umum", subjects: ["Bahasa Indonesia"], categoryId: 124 },
  { id: "brillian-wahyu-andrian", name: "Brillian Wahyu Andrian, S.Pd.", role: "Guru Bahasa Indonesia & Bahasa Inggris", group: "umum", subjects: ["Bahasa Indonesia", "Bahasa Inggris"], categoryId: 358 },

  // Bahasa Inggris
  { id: "rahmat-efendi", name: "Rahmat Efendi, S.Pd.", role: "Guru Bahasa Inggris", group: "umum", subjects: ["Bahasa Inggris"], categoryId: 40 },
  { id: "rudik-sanjaya-sugiarto", name: "Rudik Sanjaya Sugiarto, S.S., MBA.", role: "Guru Bahasa Inggris", group: "umum", subjects: ["Bahasa Inggris"], categoryId: 133 },
  { id: "eka-ardian-suharko", name: "Eka Ardian Suharko, M.Pd.", role: "Guru Bahasa Inggris", group: "umum", subjects: ["Bahasa Inggris"], categoryId: 134 },
  { id: "erik-efendi", name: "Erik Efendi, S.Pd.", role: "Guru Bahasa Inggris", group: "umum", subjects: ["Bahasa Inggris"], categoryId: 135 },
  { id: "puji-indah-kurniawati", name: "Puji Indah Kurniawati, S.Pd.", role: "Guru Bahasa Inggris", group: "umum", subjects: ["Bahasa Inggris"], categoryId: 136 },

  // Pendidikan Pancasila & Sejarah
  { id: "nur-maulidah-hasanah", name: "Nur Maulidah Hasanah, S.Pd.", role: "Guru Pendidikan Pancasila", group: "umum", subjects: ["Pendidikan Pancasila"], categoryId: 26 },
  { id: "sri-mulyati", name: "Sri Mulyati, S.Pd.", role: "Guru Pendidikan Pancasila", group: "umum", subjects: ["Pendidikan Pancasila"], categoryId: 125 },
  { id: "nurul-hidayah", name: "Nurul Hidayah, S.E.", role: "Guru Pendidikan Pancasila", group: "umum", subjects: ["Pendidikan Pancasila"], categoryId: 126 },
  { id: "cindy-endriana", name: "Cindy Endriana, S.Pd.", role: "Guru Sejarah Indonesia", group: "umum", subjects: ["Sejarah Indonesia"], categoryId: 22 },
  { id: "tyas-wahyu-ningsih", name: "Tyas Wahyu Ningsih, S.Pd.", role: "Guru Sejarah Indonesia", group: "umum", subjects: ["Sejarah Indonesia"], categoryId: 121 },

  // IPAS & Informatika
  { id: "yusi-herawati", name: "Yusi Herawati, S.Pd.", role: "Guru Proyek IPAS", group: "umum", subjects: ["Proyek IPAS"], categoryId: 30 },
  { id: "ainur-rofik", name: "Ainur Rofik, M.Pd.Si.", role: "Guru Proyek IPAS", group: "umum", subjects: ["Proyek IPAS"], categoryId: 116 },
  { id: "wira-hendy-himawan", name: "M. Wira Hendy Himawan, M.Pd.", role: "Guru Proyek IPAS", group: "umum", subjects: ["Proyek IPAS", "Penilaian Harian IPAS"], categoryId: 127 },
  { id: "indira-kusumaning-fuadah", name: "Indira Kusumaning Fuadah, S.Pd.", role: "Guru Informatika", group: "umum", subjects: ["Informatika"], categoryId: 140 },
];
