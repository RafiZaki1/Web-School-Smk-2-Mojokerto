import {
  BookUser,
  BriefcaseBusiness,
  Camera,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Handshake,
  IdCard,
  LayoutDashboard,
  Link2,
  ListChecks,
  Newspaper,
  PersonStanding,
  ScrollText,
  Trophy,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ROLES, type Role } from "@/shared/types/user.type";

export interface AdminMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  // Kunci ringkasan dashboard yang jumlah data barunya ditampilkan sebagai badge
  badgeKey?: "major_quiz";
}

export interface AdminMenuGroup {
  title: string;
  // Role yang boleh melihat grup ini; admin utama melihat semua grup
  roles: readonly Role[];
  items: AdminMenuItem[];
}

const ADMIN_ONLY = [ROLES.admin] as const;
const ADMIN_AND_TU = [ROLES.admin, ROLES.adminTu] as const;

export const ADMIN_MENU: AdminMenuGroup[] = [
  { title: "Menu Utama", roles: ADMIN_ONLY, items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    title: "Kelola Konten",
    roles: ADMIN_ONLY,
    items: [
      { label: "Jurusan", href: "/admin/jurusan", icon: GraduationCap },
      { label: "Prestasi", href: "/admin/prestasi", icon: Trophy },
      { label: "Ekstrakurikuler", href: "/admin/ekstrakurikuler", icon: PersonStanding },
      { label: "Berita & Artikel", href: "/admin/berita", icon: Newspaper },
      { label: "Loker & BKK", href: "/admin/bkk", icon: BriefcaseBusiness },
      { label: "Lulusan & Testimoni", href: "/admin/lulusan", icon: IdCard },
    ],
  },
  {
    title: "Layanan Siswa",
    roles: ADMIN_ONLY,
    items: [{ label: "Kuis Jurusan", href: "/admin/kuis-jurusan", icon: ClipboardList, badgeKey: "major_quiz" }],
  },
  {
    title: "Keuangan Siswa",
    roles: ADMIN_ONLY,
    items: [{ label: "Bank Mini & SPP", href: "/admin/bank-mini", icon: Wallet }],
  },
  {
    title: "Tata Usaha",
    roles: ADMIN_AND_TU,
    items: [
      { label: "Ringkasan TU", href: "/admin/tu", icon: ListChecks },
      { label: "Kelulusan", href: "/admin/tu/kelulusan", icon: GraduationCap },
      { label: "Layanan Alumni", href: "/admin/tu/layanan-alumni", icon: FileCheck2 },
      { label: "Mitra DU/DI", href: "/admin/tu/kemitraan", icon: Handshake },
      { label: "Dokumentasi PKL", href: "/admin/tu/dokumentasi-pkl", icon: Camera },
      { label: "Tata Tertib & Seragam", href: "/admin/tu/tata-tertib", icon: ScrollText },
      { label: "Buku Tamu", href: "/admin/tu/buku-tamu", icon: BookUser },
      { label: "Pintasan Portal", href: "/admin/tu/portal", icon: Link2 },
    ],
  },
];

/** Grup menu yang boleh dilihat role tertentu. Role tak dikenal tidak melihat apa pun. */
export const menuForRole = (role: string | null | undefined): AdminMenuGroup[] =>
  ADMIN_MENU.filter((group) => group.roles.some((allowed) => allowed === role));

/** Akun TU hanya boleh membuka halaman di bawah /admin/tu. */
export const isPathAllowed = (role: string | null | undefined, pathname: string): boolean =>
  role !== ROLES.adminTu || pathname === "/admin/tu" || pathname.startsWith("/admin/tu/");
