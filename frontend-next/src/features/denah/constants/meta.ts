import { Building2, Ellipsis, GraduationCap, LayoutGrid, Laptop, Trees } from "lucide-react";

// Label pendek & ikon kategori mengikuti Figma (Semua, Kelas, Lab, Fasilitas, Kantor, Lapangan, Lainnya)
export const CATEGORY_META = {
  semua: { label: "Semua", icon: LayoutGrid },
  "ruang-kelas": { label: "Kelas", icon: GraduationCap },
  "lab-bengkel": { label: "Lab", icon: Laptop },
  fasilitas: { label: "Fasilitas", icon: Building2 },
  kantor: { label: "Kantor", icon: Building2 },
  "area-terbuka": { label: "Lapangan", icon: Trees },
  lainnya: { label: "Lainnya", icon: Ellipsis },
};

export const CATEGORY_ORDER = ["ruang-kelas", "lab-bengkel", "fasilitas", "kantor", "area-terbuka", "lainnya"];

// Lokasi cepat di bawah peta (urutan sesuai Figma; yang tidak ada di data dilewati)
export const QUICK_SLUGS = ["lab-tefa", "perpustakaan", "kantin", "lapangan-olahraga", "musholla", "uks", "kantor-pusat"];

export const DEFAULT_ORIGIN_SLUG = "gerbang-utama";
export const DEFAULT_DEST_SLUG = "lab-tefa";

export const ROOM_FALLBACK_IMAGE = "/images/sejarah/gedung.jpg";

export const roomKey = (room: { slug?: string | null; id?: number | string | null } | null | undefined): string =>
  room?.slug || (room?.id != null ? String(room.id) : "");

export const categoryMeta = (slug: string | null | undefined) =>
  (slug ? CATEGORY_META[slug as keyof typeof CATEGORY_META] : undefined) ?? { label: "Ruangan", icon: Building2 };
