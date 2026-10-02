import { BriefcaseBusiness, GraduationCap, LayoutDashboard, MessageSquareText, Newspaper, PersonStanding, Trophy } from "lucide-react";

export const ADMIN_MENU = [
  { title: "Menu Utama", items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    title: "Kelola Konten",
    items: [
      { label: "Jurusan", href: "/admin/jurusan", icon: GraduationCap },
      { label: "Prestasi", href: "/admin/prestasi", icon: Trophy },
      { label: "Ekstrakurikuler", href: "/admin/ekstrakurikuler", icon: PersonStanding },
      { label: "Berita & Artikel", href: "/admin/berita", icon: Newspaper },
      { label: "Loker & BKK", href: "/admin/bkk", icon: BriefcaseBusiness },
    ],
  },
  { title: "Layanan Siswa", items: [{ label: "Aspirasi", href: "/admin/aspirasi", icon: MessageSquareText, badgeKey: "aspirations" }] },
];
