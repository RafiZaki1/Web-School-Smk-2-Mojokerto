import { publishLabel } from "@/shared/utils/publish-label";
import { getExtracurricularApi } from "../api/getExtracurricular.api";
import { getExtracurricularsApi } from "../api/getExtracurriculars.api";
import { EKSTRA_DATA, EKSTRA_LIST, type EkstraStatic } from "../constants/ekstra-data";
import type { Ekstrakurikuler, ExtracurricularRecord } from "../types/ekstrakurikuler.type";

// Ubah resource API menjadi bentuk yang dipakai komponen.
export function toEkstra(item: ExtracurricularRecord): Ekstrakurikuler {
  return {
    id: item.slug,
    dbId: item.id,
    name: item.name,
    subtitle: item.tagline,
    icon: item.icon,
    image: item.cover_image || "/paskib.webp",
    desc: item.summary,
    jadwal: item.schedule || "-",
    lokasi: item.location || "-",
    anggota: item.members || "-",
    tentangLabel: `Tentang ${item.name}`,
    tentangTitle: item.about_title,
    tentang: item.about,
    galleryTitle: item.gallery_title,
    gallery: item.gallery ?? [],
    prestasiTitle: `Pencapaian anggota ${item.name}`,
    prestasi: item.achievements ?? [],
    testimoni: item.testimonials?.[0]
      ? { quote: item.testimonials[0].quote, author: item.testimonials[0].author || `Anggota ${item.name}` }
      : null,
    testimonials: item.testimonials ?? [],
    status: publishLabel(item.is_published),
    updatedAt: item.updated_at,
  };
}

// Data statis dipetakan ke bentuk yang sama.
function toEkstraStatic(item: EkstraStatic): Ekstrakurikuler {
  return {
    id: item.id,
    dbId: null,
    name: item.name,
    subtitle: item.subtitle,
    icon: item.icon,
    image: item.image,
    desc: item.desc,
    jadwal: item.jadwal,
    lokasi: item.lokasi,
    anggota: item.anggota,
    tentangLabel: item.tentangLabel,
    tentangTitle: item.tentangTitle,
    tentang: item.tentang,
    galleryTitle: null,
    gallery: item.gallery,
    prestasiTitle: item.prestasiTitle,
    prestasi: item.prestasi,
    testimoni: item.testimoni,
    testimonials: [],
    status: null,
    updatedAt: null,
  };
}

// Daftar ekstrakurikuler untuk Server Component. Bila API tidak bisa dihubungi, data statis dipakai.
export async function getEkstraList(): Promise<Ekstrakurikuler[]> {
  const data = await getExtracurricularsApi();
  if (Array.isArray(data)) return data.map(toEkstra);
  return EKSTRA_LIST.map(toEkstraStatic);
}

// Detail ekstrakurikuler. Hasil null berarti data tidak ada.
export async function getEkstra(slug: string): Promise<Ekstrakurikuler | null> {
  const data = await getExtracurricularApi(slug);
  if (data === undefined) return null;
  if (data) return toEkstra(data);
  const fallback = EKSTRA_DATA[slug];
  return fallback ? toEkstraStatic(fallback) : null;
}
