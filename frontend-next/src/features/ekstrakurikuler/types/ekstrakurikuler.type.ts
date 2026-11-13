import type { PublishStatus } from "@/shared/utils/publish-label";

export interface ExtraAchievementRecord {
  icon: string;
  text: string;
}

export interface ExtraTestimonialRecord {
  quote: string;
  author: string | null;
}

// Bentuk resource Laravel (App\Http\Resources\ExtracurricularResource).
export interface ExtracurricularRecord {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  icon: string | null;
  cover_image: string | null;
  summary: string | null;
  schedule: string | null;
  location: string | null;
  members: string | null;
  about_title: string | null;
  about: string | null;
  gallery_title: string | null;
  gallery: string[];
  achievements: ExtraAchievementRecord[];
  testimonials: ExtraTestimonialRecord[];
  is_published: boolean;
  sort_order: number;
  updated_at: string | null;
}

export interface EkstraTestimoni {
  quote: string;
  author: string;
}

// Bentuk yang dipakai komponen publik dan admin.
export interface Ekstrakurikuler {
  id: string;
  dbId: number | null;
  name: string;
  subtitle: string | null;
  icon: string | null;
  image: string;
  desc: string | null;
  jadwal: string;
  lokasi: string;
  anggota: string;
  tentangLabel: string;
  tentangTitle: string | null;
  tentang: string | null;
  galleryTitle: string | null;
  gallery: string[];
  prestasiTitle: string;
  prestasi: ExtraAchievementRecord[];
  testimoni: EkstraTestimoni | null;
  testimonials: ExtraTestimonialRecord[];
  status: PublishStatus | null;
  updatedAt: string | null;
}

// Muatan API saat membuat atau mengubah ekstrakurikuler.
export interface ExtracurricularPayload {
  icon: string;
  name: string;
  tagline: string;
  summary: string;
  cover_image: File | string | null;
  schedule: string;
  location: string;
  members: string;
  about_title: string;
  about: string;
  gallery_title: string;
  gallery: (File | string | null)[];
  achievements: ExtraAchievementRecord[];
  testimonials: ExtraTestimonialRecord[];
  is_published: boolean;
}
