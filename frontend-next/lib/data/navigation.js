import { Award, Building2, Flag, GraduationCap, History, MessageSquareText, Newspaper, ShoppingBag } from "lucide-react";

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "Jurusan", href: "/#jurusan" },
  {
    label: "Informasi",
    children: [
      { label: "Berita & Artikel", description: "Kabar kegiatan baru sekolah", href: "/berita", icon: Newspaper },
      { label: "Sejarah", description: "Sejarah SMKN 2 dari masa ke masa", href: "/sejarah", icon: History },
      { label: "Fasilitas", description: "Lab dan workshop tiap jurusan", href: "/fasilitas", icon: Building2 },
      { label: "Kotak Aspirasi", description: "Sampaikan saran untuk sekolah", href: "/aspirasi", icon: MessageSquareText },
    ],
  },
  {
    label: "Kesiswaan",
    children: [
      { label: "Ekstrakurikuler", description: "Kegiatan minat dan bakat siswa", href: "/#ekstrakurikuler", icon: Flag },
      { label: "Prestasi", description: "Penghargaan siswa di berbagai ajang", href: "/prestasi", icon: Award },
      { label: "Lulusan Terbaik", description: "Kisah alumni SMKN 2 Mojokerto", href: "/lulusan", icon: GraduationCap },
      { label: "Produk", description: "Produk unggulan sekolah", href: "/produk", icon: ShoppingBag },
    ],
  },
  { label: "Loker & BKK", href: "/bkk" },
];

export const PPDB_HREF = "/spmb";

export const FOOTER_NAV = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/sejarah" },
  { label: "Profil Jurusan", href: "/#jurusan" },
  { label: "PPDB", href: PPDB_HREF },
];

export const SOCIAL_LINKS = [
  { label: "Facebook SMKN 2 Kota Mojokerto", href: "https://facebook.com/smkn2kotamojokerto", icon: "/images/icons/facebook.svg" },
  { label: "Instagram @smkn2kotamojokerto", href: "https://www.instagram.com/smkn2kotamojokerto", icon: "/images/icons/instagram.svg" },
  { label: "TikTok SMKN 2 Kota Mojokerto", href: "https://tiktok.com/@smkn2kotamojokerto", icon: "/images/icons/tiktok.svg" },
];

export const CONTACT = {
  telepon: "(0321) 387-356",
  whatsapp: "0812-3456-7890",
  email: "smkn2mr@gmail.com",
};
