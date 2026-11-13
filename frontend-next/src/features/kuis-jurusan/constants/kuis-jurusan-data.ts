/**
 * Cadangan pertanyaan kuis minat jurusan, dipakai hanya untuk menampilkan chat
 * saat API belum bisa dihubungi. Sumber utamanya config/major_quiz.php —
 * ubah teks pertanyaan di kedua tempat bersamaan.
 */
import type { QuizQuestion } from "../types/kuis.type";

export const ESTIMASI_MENIT = "3-5";
export const MAKS_JAWABAN = 500;

// Ikon jurusan di halaman kuis (nama ikon untuk JurusanIcon)
export const IKON_JURUSAN: Record<string, string> = {
  rpl: "Code",
  dkv: "Palette",
  boga: "ChefHat",
  aphp: "Leaf",
  lps: "Landmark",
};

export const KUIS_JURUSAN: QuizQuestion[] = [
  {
    id: 1,
    question: "Kalau kamu dikasih modal dan alat lengkap buat bikin satu karya atau produk sendiri, kamu paling pengen bikin apa? (Misal: bikin aplikasi/game, desain poster/video keren, racik makanan/minuman kemasan unik, masak menu spesial, atau bikin usaha jasa keuangan?)",
    hint: "Jawab apa adanya, misalnya: pengen bikin aplikasi absensi buat sekolah.",
    required: true,
  },
  {
    id: 2,
    question: "Bayangkan sekolah mau ngadain acara bazar besar. Kamu paling semangat kalau kebagian tugas apa? (Misal: ngurus uang kas & catat laba-rugi, desain dekorasi & promosi medsos, bikin sistem web pemesanan, masak hidangan utama di dapur, atau ngolah bahan mentah jadi jajanan awet?)",
    hint: "Misalnya: pegang uang kas, atau masak hidangan utama.",
    required: true,
  },
  {
    id: 3,
    question: "Kalau lagi santai di rumah atau di sekolah, aktivitas produktif apa yang paling bikin kamu betah: ngutak-atik sistem HP/komputer, gambar/ngedit foto & video, eksperimen meracik bahan makanan, atau ngerapihin catatan dan hitungan uang?",
    hint: "Misalnya: ngedit video, atau ngerapihin catatan keuangan.",
    required: true,
  },
  {
    id: 4,
    question: 'Saat kamu main game, nonton YouTube/TikTok, atau jajan di luar, hal apa yang pernah bikin kamu mikir "Kok bisa ya orang bikin kayak gini?" dan bikin kamu penasaran pengen nyoba bikin sendiri?',
    hint: "Misalnya: penasaran cara bikin animasi, atau resep kue yang ditonton.",
    required: true,
  },
  {
    id: 5,
    question: "Masalah seperti apa yang paling seru buat kamu pecahkan sampai tuntas? (Nyari letak error di HP/aplikasi, nyocokin hitungan uang yang selisih, nyari komposisi warna/gambar yang pas, atau nyoba-nyoba takaran resep sampai rasanya pas?)",
    hint: "Misalnya: nyari kenapa aplikasi error, atau takaran resep yang pas.",
    required: true,
  },
  {
    id: 6,
    question: "Bayangkan beberapa tahun lagi kamu lulus dan bekerja. Kamu lebih betah kerja rapi di kantor perbankan, duduk fokus ngoding/desain di depan layar komputer, sibuk berkreasi di dapur restoran/hotel, atau meneliti kualitas produk pangan di laboratorium/pabrik?",
    hint: "Jawab tempat kerja yang kamu bayangkan.",
    required: true,
  },
  {
    id: 7,
    question: "Saat mengerjakan sesuatu, kamu lebih suka bekerja mengikuti prosedur/aturan hitung yang pasti, mencari celah logika teknologi, bebas berekspresi secara visual, atau praktik fisik langsung menghasilkan produk makanan?",
    hint: "Pilih yang paling kamu rasakan, dan ceritakan alasannya.",
    required: true,
  },
];
