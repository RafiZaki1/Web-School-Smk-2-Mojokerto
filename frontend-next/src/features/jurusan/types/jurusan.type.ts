import type { Partner } from "@/shared/components/ui/LogoGrid";
import type { PublishStatus } from "@/shared/utils/publish-label";

// Bentuk resource Laravel (App\Http\Resources\MajorResource).
export interface MajorRecord {
  id: number;
  slug: string;
  code: string;
  name: string;
  tagline: string | null;
  accreditation: string | null;
  summary: string | null;
  description: string | null;
  image: string | null;
  accent_color: string | null;
  competencies: JurusanKompetensi[];
  careers: MajorCareerRecord[];
  facility_title: string | null;
  facilities: MajorFacilityRecord[];
  partners: MajorPartnerRecord[];
  lab_room_slug: string | null;
  is_published: boolean;
  sort_order: number;
  updated_at: string | null;
}

export interface MajorCareerRecord {
  icon: string;
  title: string;
  description?: string | null;
}

export interface MajorFacilityRecord {
  title: string;
  image: string | null;
}

export interface MajorPartnerRecord {
  name: string;
  logo: string | null;
  height?: string;
}

export interface JurusanKompetensi {
  icon: string;
  title: string;
}

export interface JurusanKarier {
  icon: string;
  title: string;
  desc?: string;
}

export interface JurusanFasilitas {
  title: string;
  image: string;
}

// Bentuk yang dipakai komponen publik dan admin.
export interface Jurusan {
  id: string;
  dbId: number | null;
  code: string;
  fullName: string;
  image: string;
  tag: string | null;
  akreditasi: string | null;
  accent: string | null;
  desc: string | null;
  tentang: string | null;
  kompetensi: JurusanKompetensi[];
  karir: JurusanKarier[];
  fasilitasTitle: string | null;
  fasilitas: JurusanFasilitas[];
  mitra: Partner[] | null;
  labTarget: string | null;
  status: PublishStatus | null;
  updatedAt: string | null;
}

// Muatan API saat membuat atau mengubah jurusan.
export interface MajorPayload {
  code: string;
  name: string;
  tagline: string;
  accreditation: string;
  summary: string;
  description: string;
  image: File | string | null;
  accent_color: string;
  competencies: JurusanKompetensi[];
  careers: { icon: string; title: string; description: string }[];
  partners: { logo: File | string | null; name?: string }[];
  facility_title: string;
  facilities: { title: string; image: File | string | null }[];
  is_published: boolean;
}
