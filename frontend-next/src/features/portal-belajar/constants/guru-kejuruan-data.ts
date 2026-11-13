import type { ElearningTeacher } from "@/features/portal-belajar/types/portal-belajar.type";
import { GURU_UMUM_DAN_BK } from "./guru-umum-data";
import { GURU_LANJUTAN_DAN_BK } from "./guru-lanjutan-data";

/**
 * Daftar Bapak & Ibu Guru Produktif 5 Konsentrasi Keahlian (RPL, DKV, Kuliner, LPS, APHP)
 * berdasarkan struktur kategori pembelajaran di http://smkn2mojokerto.my.id/
 */
export const GURU_KEJURUAN: ElearningTeacher[] = [
  // Rekayasa Perangkat Lunak (RPL)
  { id: "supriati", name: "Supriati, S.Kom.", role: "Guru Produktif RPL", group: "rpl", subjects: ["Pemrograman Berorientasi Objek (PBO)", "Basis Data"], categoryId: 29 },
  { id: "sri-astutik-ningsih", name: "Sri Astutik Ningsih, S.T.", role: "Guru Produktif RPL & KIK", group: "rpl", subjects: ["Dasar Desain Grafis", "Kreativitas, Inovasi & Kewirausahaan (KIK)"], categoryId: 23 },
  { id: "lilik-emi-rahayu", name: "Lilik Emi Rahayu, S.Pd., M.Pd.", role: "Guru Produktif RPL", group: "rpl", subjects: ["Pemrograman Web", "Mapel Pilihan Web"], categoryId: 94 },
  { id: "vebriyanti-dwi-anggraini", name: "Vebriyanti Dwi Anggraini, S.Pd., M.Pd.", role: "Guru Produktif RPL & KIK", group: "rpl", subjects: ["Pemrograman Web", "Kreativitas, Inovasi & Kewirausahaan (KIK)"], categoryId: 95 },
  { id: "leni-kristiana-dewi", name: "Leni Kristiana Dewi, S.T.", role: "Guru Produktif RPL", group: "rpl", subjects: ["Pemrograman Web"], categoryId: 150 },
  { id: "indah-tri-utami", name: "Indah Tri Utami, S.Pd.", role: "Guru Produktif RPL", group: "rpl", subjects: ["Pemrograman Mobile", "Basis Data"], categoryId: 97 },
  { id: "danang-teguh-santoso", name: "Danang Teguh Santoso, S.Kom.", role: "Guru Produktif RPL", group: "rpl", subjects: ["Pemrograman Mobile", "Mapel Pilihan RPL"], categoryId: 104 },
  { id: "irsam-muhammad-fathoni", name: "Irsam Muhammad Fathoni, S.Pd., Gr.", role: "Guru Produktif RPL", group: "rpl", subjects: ["Basis Data", "Mapel Pilihan RPL"], categoryId: 156 },

  // Desain Komunikasi Visual (DKV)
  { id: "jatmiko-tri-wijayanto", name: "Jatmiko Tri Wijayanto, S.T.", role: "Guru Produktif DKV", group: "dkv", subjects: ["Tipografi, Sketsa & Ilustrasi", "Fotografi & Fotografi Lanjut", "Proses Produksi Desain", "Wawasan Dunia Kerja"], categoryId: 81 },
  { id: "susi-suryani-rahayu", name: "Susi Suryani Rahayu, S.Sn.", role: "Guru Produktif DKV", group: "dkv", subjects: ["Komputer Grafis", "Desain Brief", "Wawasan Dunia Kerja"], categoryId: 32 },
  { id: "novaria-fajar-kurniawan", name: "Novaria Fajar Kurniawan, S.Sn.", role: "Guru Produktif DKV", group: "dkv", subjects: ["Kecakapan Kerja Dasar (KKD)", "Perangkat Lunak Desain", "Karya Desain Komunikasi Visual"], categoryId: 191 },
  { id: "nurfalah-septayoga", name: "Nurfalah Septayoga, S.Kom.", role: "Guru Produktif DKV & Informatika", group: "dkv", subjects: ["Mapel Pilihan Videografi", "Mapel Pilihan Fotografi Lanjut", "Informatika"], categoryId: 28 },

  // Kuliner (Tata Boga)
  { id: "mulat-adityawiranti", name: "Mulat Adityawiranti, S.Pd.", role: "Guru Produktif Kuliner", group: "kuliner", subjects: ["Dasar Keahlian Kuliner (8 Jam)", "Makanan Indonesia"], categoryId: 161 },
  { id: "arini-prasetyoningtyas", name: "Arini Prasetyoningtyas, S.Pd., M.Pd.", role: "Guru Produktif Kuliner", group: "kuliner", subjects: ["Bakery & Pastry", "Pengolahan & Penyajian Makanan", "Dasar Keahlian Kuliner"], categoryId: 168 },
  { id: "sutarjo-suparman", name: "Sutarjo Suparman Nur Cahyono, S.Pd., Gr.", role: "Guru Produktif Kuliner", group: "kuliner", subjects: ["Dasar Keahlian Kuliner (4 Jam)", "Mapel Pilihan Masakan Oriental"], categoryId: 77, semesterInfo: "Semester Gasal & Genap" },
  { id: "endah-trapsilawati", name: "Endah Trapsilawati Nawangsih, S.Pd.", role: "Guru Produktif Kuliner", group: "kuliner", subjects: ["Tata Hidang", "Dasar Keahlian Kuliner (4 Jam)"], categoryId: 163 },
  { id: "anissa-diana-sugiyono", name: "Anissa Diana Sugiyono, S.Pd.", role: "Guru Produktif Kuliner & KIK", group: "kuliner", subjects: ["Tata Hidang", "Mapel Pilihan Kue Indonesia", "KIK"], categoryId: 186 },
  { id: "dhiyah-amanati", name: "Dhiyah Amanati Kartika Sari, S.Pd.", role: "Guru Produktif Kuliner", group: "kuliner", subjects: ["Produk Cake & Bakery Pastry"], categoryId: 167 },
  { id: "ika-noviyati", name: "Ika Noviyati, S.Pd.", role: "Guru Produktif Kuliner & KIK", group: "kuliner", subjects: ["Mapel Pilihan Kue Indonesia", "Bakery Pastry", "KIK"], categoryId: 176 },
  { id: "lastiani-sundari", name: "Lastiani Sundari, S.Pd.", role: "Guru Produktif Kuliner", group: "kuliner", subjects: ["Makanan Kontinental", "Pengolahan & Penyajian Makanan"], categoryId: 171 },
  { id: "lugiati", name: "Dra. Lugiati", role: "Guru Produktif Kuliner", group: "kuliner", subjects: ["Produk Cake dan Kue Indonesia (PCKI)"], categoryId: 179 },
  { id: "sri-andrijanti", name: "Sri Andrijanti, S.Pd.", role: "Guru Produktif Kuliner & KIK", group: "kuliner", subjects: ["Makanan Indonesia", "Mapel Pilihan Masakan Oriental", "KIK"], categoryId: 183 },

  // Layanan Perbankan Syariah (LPS)
  { id: "hafifah-ratna-damayanti", name: "Hafifah Ratna Damayanti, S.Pd.", role: "Guru Produktif LPS & KIK", group: "lps", subjects: ["Spreadsheet", "Accurate / Komputer Akuntansi", "Mapel Pilihan Bisnis Digital", "KIK"], categoryId: 34 },
  { id: "melati-puspita-sari", name: "Melati Puspita Sari, S.Pd.", role: "Guru Produktif LPS", group: "lps", subjects: ["Etika Profesi", "Akuntansi Syariah", "Pengelolaan Kas", "Ekonomi Islam"], categoryId: 214 },
  { id: "arikaweku-ckrisna", name: "Arikaweku Ckrisna, S.Pd., M.Pd.", role: "Guru Produktif LPS", group: "lps", subjects: ["Dasar Akuntansi", "Ekonomi Islam", "Akuntansi Syariah"], categoryId: 205 },
  { id: "maratus-sholihah", name: "Mar'atus Sholihah Wahyuliati, S.Pd.", role: "Guru Produktif LPS & KIK", group: "lps", subjects: ["Dasar Perbankan", "Ekonomi Islam", "Accurate / Komputer Akuntansi", "KIK"], categoryId: 69 },
  { id: "metiy-ardiana", name: "Metiy Ardiana, S.Pd., M.Pd.", role: "Guru Produktif LPS", group: "lps", subjects: ["Ekonomi Bisnis & Administrasi Umum", "Layanan Lembaga Keuangan Syariah"], categoryId: 211 },

  // Agribisnis Pengolahan Hasil Pertanian (APHP)
  { id: "rani-puspitasari", name: "Rani Puspitasari, S.T.P.", role: "Guru Produktif APHP", group: "aphp", subjects: ["Dasar Keahlian APHP", "Produksi Olahan Hewani", "Keamanan Pangan", "Penyimpanan & Penggudangan", "Mamin Herbal"], categoryId: 27 },
  { id: "desy-andini-diliawati", name: "Desy Andini Diliawati, S.TP.", role: "Guru Produktif APHP", group: "aphp", subjects: ["Dasar Keahlian APHP", "Produksi Olahan Hasil Hewani"], categoryId: 71 },
  { id: "liawanti-gestika-ardiyana", name: "Liawanti Gestika Ardiyana, S.Pi.", role: "Guru Produktif APHP", group: "aphp", subjects: ["Produksi Olahan Nabati", "Rempah, Bahan Penyegar & Perkebunan", "Mapel Pilihan Kimia Hasil Pertanian"], categoryId: 231 },
  { id: "intan-switzerlistania-martha", name: "Intan Switzerlistania Martha, S.Pi.", role: "Guru Produktif APHP", group: "aphp", subjects: ["Produksi Olahan Nabati", "Rempah, Bahan Penyegar & Perkebunan", "Penyimpanan & Penggudangan", "Mamin Herbal"], categoryId: 240 },
];

export const ELEARNING_TEACHERS: ElearningTeacher[] = [
  ...GURU_KEJURUAN,
  ...GURU_UMUM_DAN_BK,
  ...GURU_LANJUTAN_DAN_BK,
];
