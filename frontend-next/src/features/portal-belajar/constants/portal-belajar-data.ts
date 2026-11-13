import {
  Clock,
  FolderCheck,
  Globe,
  KeyRound,
  MousePointerClick,
  Sparkles,
  Users,
} from "lucide-react";
import type {
  ElearningPillar,
  ElearningStat,
  PortalStep,
  TeacherGroupKey,
  TeacherGroupMeta,
} from "@/features/portal-belajar/types/portal-belajar.type";

/** Portal pembelajaran resmi SMKN 2 Kota Mojokerto berbasis LMS Moodle (elearningsmkn2). */
export const ELEARNING = {
  name: "e-Learning SMKN 2 Mojokerto",
  shortName: "elearningsmkn2",
  kepanjangan: "Learning Management System (LMS) Resmi SMK Negeri 2 Kota Mojokerto",
  domain: "smkn2mojokerto.my.id",
  url: "http://smkn2mojokerto.my.id",
  whatsapp: "085648687223",
} as const;

export const elearningUrl = (path = "/") => `${ELEARNING.url}${path}`;
export const elearningCategoryUrl = (categoryId: number) =>
  `${ELEARNING.url}/course/index.php?categoryid=${categoryId}`;

export const E_LEARNING_URL = "http://smkn2mojokerto.my.id/";
export const E_LEARNING_LOGIN_URL = "http://smkn2mojokerto.my.id/login/index.php";
export const E_LEARNING_COURSES_URL = "http://smkn2mojokerto.my.id/course/index.php?categoryid=1";

/** Statistik resmi dari halaman beranda http://smkn2mojokerto.my.id/ */
export const ELEARNING_STATS: ElearningStat[] = [
  {
    value: "1.339",
    label: "Pengguna Aktif",
    detail: "Siswa & guru aktif mengakses materi dan penilaian daring",
  },
  {
    value: "237",
    label: "Kelas & Modul",
    detail: "Ruang belajar terstruktur untuk Semester Ganjil & Genap",
  },
  {
    value: "50",
    label: "Bapak & Ibu Guru",
    detail: "Pendidik pengampu mata pelajaran umum & produktif kejuruan",
  },
  {
    value: "30+",
    label: "Kategori Mapel",
    detail: "Mencakup Normatif-Adaptif, RPL, DKV, Kuliner, LPS, APHP & BK",
  },
];

/** 4 Pilar pembelajaran pada http://smkn2mojokerto.my.id/ (#feature) */
export const ELEARNING_PILLARS: ElearningPillar[] = [
  {
    id: "aksesibilitas",
    title: "Aksesibilitas",
    description:
      "Siswa bisa mengakses materi dan tugas kapan saja dan dari mana saja, tidak terikat oleh jam atau lokasi sekolah.",
    icon: Globe,
    tone: "bg-sky-500/12 text-sky-600",
  },
  {
    id: "fleksibilitas",
    title: "Fleksibilitas",
    description:
      "Siswa dapat belajar sesuai kecepatan mereka sendiri, mengulang materi yang sulit dan maju ke materi berikutnya jika sudah menguasai.",
    icon: Clock,
    tone: "bg-amber-500/12 text-amber-600",
  },
  {
    id: "personalisasi",
    title: "Personalisasi",
    description:
      "Guru bisa menyesuaikan materi belajar untuk setiap siswa, memberikan materi tambahan atau bantuan ekstra sesuai kebutuhan.",
    icon: Sparkles,
    tone: "bg-emerald-500/12 text-emerald-600",
  },
  {
    id: "kolaborasi",
    title: "Kolaborasi",
    description:
      "E-learning mendorong siswa untuk berinteraksi dan bekerja sama dalam tim melalui forum diskusi atau proyek kelompok daring.",
    icon: Users,
    tone: "bg-violet-500/12 text-violet-600",
  },
];

/** Rumpun Bapak & Ibu Guru di E-Learning SMKN 2 Kota Mojokerto */
export const TEACHER_GROUPS: TeacherGroupMeta[] = [
  { id: "semua", label: "Semua Guru", shortLabel: "Semua", badgeClass: "bg-tint text-primary", categoryId: 1 },
  { id: "rpl", label: "Rekayasa Perangkat Lunak (RPL)", shortLabel: "Produktif RPL", badgeClass: "bg-blue-500/12 text-blue-600", categoryId: 93 },
  { id: "dkv", label: "Desain Komunikasi Visual (DKV)", shortLabel: "Produktif DKV", badgeClass: "bg-amber-500/14 text-amber-700", categoryId: 80 },
  { id: "kuliner", label: "Kuliner (Tata Boga)", shortLabel: "Produktif Kuliner", badgeClass: "bg-pink-500/12 text-pink-600", categoryId: 21 },
  { id: "lps", label: "Layanan Perbankan Syariah (LPS)", shortLabel: "Produktif LPS", badgeClass: "bg-rose-500/12 text-rose-600", categoryId: 65 },
  { id: "aphp", label: "Agribisnis Pengolahan Hasil Pertanian (APHP)", shortLabel: "Produktif APHP", badgeClass: "bg-emerald-500/12 text-emerald-600", categoryId: 20 },
  { id: "umum", label: "Mata Pelajaran Umum (Normatif & Adaptif)", shortLabel: "Mapel Umum", badgeClass: "bg-sky-500/12 text-sky-600", categoryId: 2 },
  { id: "bk-kik", label: "Bimbingan Konseling (BK) & Kewirausahaan (KIK)", shortLabel: "BK & KIK", badgeClass: "bg-violet-500/12 text-violet-600", categoryId: 141 },
];

export const TEACHER_GROUP_MAP: Record<Exclude<TeacherGroupKey, "semua">, TeacherGroupMeta> = {
  rpl: TEACHER_GROUPS[1],
  dkv: TEACHER_GROUPS[2],
  kuliner: TEACHER_GROUPS[3],
  lps: TEACHER_GROUPS[4],
  aphp: TEACHER_GROUPS[5],
  umum: TEACHER_GROUPS[6],
  "bk-kik": TEACHER_GROUPS[7],
};

export const PORTAL_STEPS: PortalStep[] = [
  {
    title: "Pilih Bapak/Ibu Guru atau Mapel",
    description: "Cari nama Bapak/Ibu Guru pengampu atau mata pelajaran pada direktori di bawah, lalu klik Buka Kelas Guru.",
    icon: MousePointerClick,
  },
  {
    title: "Login di smkn2mojokerto.my.id",
    description: "Masuk menggunakan username dan password akun e-Learning SMKN 2 Mojokerto melalui halaman login resmi.",
    icon: KeyRound,
  },
  {
    title: "Akses Materi & Penilaian",
    description: "Pilih kategori Semester Ganjil atau Genap untuk mengunduh modul ajar, mengumpulkan tugas, dan mengikuti penilaian.",
    icon: FolderCheck,
  },
];
