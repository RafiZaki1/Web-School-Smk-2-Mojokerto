import {
  Award,
  BookUser,
  ClipboardCheck,
  Building2,
  FileCheck2,
  Flag,
  GraduationCap,
  Handshake,
  History,
  LibraryBig,
  Lightbulb,
  Newspaper,
  ScrollText,
  ShoppingBag,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavChild {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  // Tautan ke domain lain (pintasan portal) dibuka di tab baru
  external?: boolean;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Jurusan", href: "/#jurusan" },
  { label: "Kuis Jurusan", href: "/kuis-jurusan" },
  {
    label: "Informasi",
    children: [
      { label: "Berita & Artikel", description: "Kabar kegiatan baru sekolah", href: "/berita", icon: Newspaper },
      { label: "Sejarah", description: "Sejarah SMKN 2 dari masa ke masa", href: "/sejarah", icon: History },
      { label: "Fasilitas", description: "Lab dan workshop tiap jurusan", href: "/fasilitas", icon: Building2 },
      { label: "Kemitraan & PKL", description: "Mitra DU/DI dan dokumentasi PKL", href: "/kemitraan", icon: Handshake },
      { label: "Tata Tertib & Seragam", description: "Aturan siswa dan jadwal seragam", href: "/tata-tertib", icon: ScrollText },
      { label: "Buku Tamu", description: "Kirim pesan atau jadwalkan kunjungan", href: "/buku-tamu", icon: BookUser },
      { label: "Layanan Berkas Alumni", description: "Ambil ijazah, cap tiga jari, legalisir", href: "/layanan-alumni", icon: FileCheck2 },
    ],
  },
  {
    label: "Kesiswaan",
    children: [
      { label: "Cek Kelulusan", description: "Hasil kelulusan siswa kelas XII", href: "/cek-kelulusan", icon: ClipboardCheck },
      { label: "Pembayaran SPP", description: "Bayar SPP online & cek tabungan Bank Mini", href: "/pembayaran-spp", icon: Wallet },
      { label: "Portal Belajar", description: "E-Learning sekolah & data Bapak/Ibu Guru", href: "/portal-belajar", icon: LibraryBig },
      { label: "Ekstrakurikuler", description: "Kegiatan minat dan bakat siswa", href: "/#ekstrakurikuler", icon: Flag },
      { label: "Prestasi", description: "Penghargaan siswa di berbagai ajang", href: "/prestasi", icon: Award },
      { label: "Karya Siswa", description: "Karya nyata hasil bekal PKL", href: "/karya-siswa", icon: Lightbulb },
      { label: "Lulusan Terbaik", description: "Kisah alumni SMKN 2 Mojokerto", href: "/lulusan", icon: GraduationCap },
      { label: "Produk", description: "Produk unggulan sekolah", href: "/produk", icon: ShoppingBag },
    ],
  },
  { label: "Loker & BKK", href: "/bkk" },
];

/** Grup navbar yang ditambah pintasan portal (E-Learning) dari pengaturan TU. */
export const PORTAL_NAV_GROUP = "Kesiswaan";

export const PPDB_HREF = "/spmb";

export const FOOTER_NAV: { label: string; href: string }[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/sejarah" },
  { label: "Profil Jurusan", href: "/#jurusan" },
  { label: "PPDB", href: PPDB_HREF },
];

export const SOCIAL_LINKS: { label: string; href: string; icon: string }[] = [
  { label: "Facebook SMKN 2 Kota Mojokerto", href: "https://facebook.com/smkn2kotamojokerto", icon: "/images/icons/facebook.svg" },
  { label: "Instagram @smkn2kotamojokerto", href: "https://www.instagram.com/smkn2kotamojokerto", icon: "/images/icons/instagram.svg" },
  { label: "TikTok SMKN 2 Kota Mojokerto", href: "https://tiktok.com/@smkn2kotamojokerto", icon: "/images/icons/tiktok.svg" },
];

export const CONTACT = {
  telepon: "(0321) 387-356",
  whatsapp: "0857-3050-2173",
  email: "smkn2mr@gmail.com",
} as const;
