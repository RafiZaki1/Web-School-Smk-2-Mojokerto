import type { Partner } from "@/shared/components/ui/LogoGrid";
import { publishLabel } from "@/shared/utils/publish-label";
import { getMajorApi } from "../api/getMajor.api";
import { getMajorsApi } from "../api/getMajors.api";
import { JURUSAN_DATA } from "../constants/jurusan-data";
import type { Jurusan, JurusanFasilitas, JurusanKarier, JurusanKompetensi, MajorRecord } from "../types/jurusan.type";

const DEFAULT_IMAGE = "/images/sejarah/gedung.jpg";

// Bentuk data statis (constants/jurusan-data.ts) yang dipakai sebagai cadangan.
interface JurusanStatic {
  id: string;
  code: string;
  fullName: string;
  image: string;
  tag: string;
  akreditasi: string;
  desc: string;
  tentang: string;
  kompetensi: JurusanKompetensi[];
  karir: JurusanKarier[];
  fasilitasTitle: string;
  fasilitas: JurusanFasilitas[];
  mitra: Partner[] | null;
  labTarget: string;
}

// Ubah resource API menjadi bentuk yang dipakai komponen.
export function toJurusan(major: MajorRecord): Jurusan {
  return {
    id: major.slug,
    dbId: major.id,
    code: major.code,
    fullName: major.name,
    image: major.image || DEFAULT_IMAGE,
    tag: major.tagline,
    akreditasi: major.accreditation,
    accent: major.accent_color,
    desc: major.summary,
    tentang: major.description,
    kompetensi: major.competencies ?? [],
    karir: (major.careers ?? []).map((item) => ({ icon: item.icon, title: item.title, desc: item.description ?? undefined })),
    fasilitasTitle: major.facility_title,
    fasilitas: (major.facilities ?? []).map((item) => ({ title: item.title, image: item.image || DEFAULT_IMAGE })),
    mitra: major.partners?.length ? major.partners.map((item) => ({ name: item.name, logo: item.logo, height: "h-12 sm:h-14" })) : null,
    labTarget: major.lab_room_slug,
    status: publishLabel(major.is_published),
    updatedAt: major.updated_at,
  };
}

function toJurusanStatic(item: JurusanStatic): Jurusan {
  return { ...item, dbId: null, accent: null, status: null, updatedAt: null };
}

// Daftar jurusan untuk Server Component. Bila API tidak bisa dihubungi, data statis dipakai.
export async function getJurusanList(): Promise<Jurusan[]> {
  const data = await getMajorsApi();
  if (Array.isArray(data)) return data.map(toJurusan);
  return Object.values(JURUSAN_DATA).map(toJurusanStatic);
}

// Detail jurusan. Hasil null berarti jurusan tidak ada.
export async function getJurusan(slug: string): Promise<Jurusan | null> {
  const data = await getMajorApi(slug);
  if (data === undefined) return null;
  if (data) return toJurusan(data);
  const fallback = JURUSAN_DATA[slug as keyof typeof JURUSAN_DATA] as JurusanStatic | undefined;
  return fallback ? toJurusanStatic(fallback) : null;
}
