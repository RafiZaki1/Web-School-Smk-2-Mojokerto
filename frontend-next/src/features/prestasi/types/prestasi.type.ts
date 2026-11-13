import type { PublishStatus } from "@/shared/utils/publish-label";

// Bentuk resource Laravel (App\Http\Resources\AchievementResource).
export interface AchievementRecord {
  id: number;
  slug: string;
  title: string;
  card_title: string;
  rank: string;
  level: string;
  category: string | null;
  subtitle: string;
  student_name: string;
  student_class: string | null;
  student_photo: string | null;
  cover_image: string | null;
  start_date: string | null;
  end_date: string | null;
  year: number | null;
  date_label: string | null;
  date_range_label: string | null;
  location: string | null;
  organizer: string | null;
  summary: string | null;
  description: string | null;
  paragraphs: string[];
  document: string | null;
  testimonial: { quote: string; name: string; position: string } | null;
  gallery_title: string | null;
  gallery_description: string | null;
  gallery: string[];
  is_published: boolean;
  updated_at: string | null;
}

export type PrestasiTone = "blue" | "teal" | "indigo" | "sky";

// Kartu prestasi di daftar (halaman Semua Prestasi dan panel admin).
export interface PrestasiCardItem {
  id: number | null;
  slug: string;
  badge: string;
  cardTitle: string;
  title: string;
  date: string;
  level: string;
  kategori: string;
  year: string;
  subtitle: string;
  tone: PrestasiTone;
  image: string | null;
  siswa: string | null;
  kelas: string | null;
  status: PublishStatus | null;
  updatedAt: string | null;
}

// Detail prestasi untuk halaman /prestasi/[slug].
export interface PrestasiDetail {
  slug: string;
  predikat: string;
  tingkat: string;
  bulan: string;
  title: string;
  hero: string | null;
  siswa: { nama: string; kelas: string; foto: string | null };
  tanggal: string;
  lokasi: string;
  penyelenggara: string;
  ringkasan: string;
  deskripsi: string[];
  dokumen?: string | null;
  testimoni: { quote: string; nama: string; jabatan: string } | null;
  galeri: { judul: string; deskripsi: string; foto: string[] } | null;
}

// Muatan API saat membuat atau mengubah prestasi.
export interface AchievementPayload {
  title: string;
  rank: string;
  level: string;
  category: string;
  student_name: string;
  student_class: string;
  student_photo: File | string | null;
  cover_image: File | string | null;
  start_date: string | null;
  end_date: string | null;
  location: string;
  organizer: string;
  summary: string;
  description: string;
  document: File | string | null;
  testimonial: { quote: string; name: string; position: string };
  gallery_title: string;
  gallery_description: string;
  gallery: (File | string | null)[];
  is_published: boolean;
}
