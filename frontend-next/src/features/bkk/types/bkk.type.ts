import type { PublishStatus } from "@/shared/utils/publish-label";

export interface JobBannerRecord {
  color: string | null;
  headline: string | null;
  subtitle: string | null;
}

// Bentuk resource Laravel (App\Http\Resources\JobVacancyResource).
export interface JobVacancyRecord {
  id: number;
  slug: string;
  title: string;
  company: string;
  location: string | null;
  category: string;
  employment_type: string;
  closes_label: string | null;
  closes_at: string | null;
  status: "open" | "closed";
  poster: string | null;
  banner: JobBannerRecord | null;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  contact_phone: string | null;
  contact_email: string | null;
  updated_at: string | null;
}

export interface LowonganKontak {
  telepon: string | null;
  whatsapp: string | null;
  email: string | null;
}

export interface LowonganBanner {
  bg: string;
  headline: string;
  sub: string;
}

// Bentuk yang dipakai komponen publik dan admin.
export interface Lowongan {
  id: number | null;
  slug: string;
  title: string;
  company: string;
  location: string;
  kategori: string;
  tipe: string;
  tutup: string;
  closesAt: string | null;
  status: PublishStatus | "Tutup" | "Aktif" | string;
  poster: string | null;
  banner: LowonganBanner;
  deskripsi: string;
  tanggungJawab: string[];
  kualifikasi: string[];
  kontak: LowonganKontak;
  updatedAt: string | null;
}

export interface BkkRekrutItem {
  nama: string;
  kelas: string;
  perusahaan: string;
  foto: string;
}

export interface BkkKontak {
  telepon: string;
  whatsapp: string;
  email: string;
}

// Konten halaman BKK yang dikelola admin, dengan cadangan dari data statis.
export interface BkkContent {
  visi: string;
  misi: string[];
  mitra: string[];
  rekrut: BkkRekrutItem[];
  kontak: BkkKontak;
}

// Muatan API saat membuat atau mengubah lowongan.
export interface JobVacancyPayload {
  title: string;
  company: string;
  location: string;
  category: string;
  employment_type: string;
  closes_at: string | null;
  status: "open" | "closed";
  poster: File | string | null;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  contact_phone: string;
  contact_email: string;
}
