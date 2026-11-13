import { getAlumniApi } from "../api/getAlumni.api";
import { LULUSAN_DIREKTORI, LULUSAN_TERBAIK, type LulusanStatic } from "../constants/lulusan-data";
import type { AlumniRecord, Lulusan } from "../types/lulusan.type";

// Ubah resource API menjadi bentuk yang dipakai komponen.
export function toLulusan(item: AlumniRecord): Lulusan {
  return {
    id: item.id,
    name: item.name,
    jurusan: item.major_code,
    angkatan: item.graduation_year,
    karier: item.career,
    lokasi: item.work_location ?? "",
    testimoni: item.testimonial ?? "",
    jalur: "",
    skill: [],
    rating: item.rating ?? null,
    photo: item.photo,
    featured: Boolean(item.is_featured),
  };
}

// Data statis dipetakan ke bentuk yang sama.
function toLulusanStatic(item: LulusanStatic): Lulusan {
  return {
    id: null,
    name: item.name,
    jurusan: item.jurusan,
    angkatan: item.angkatan,
    karier: item.karier,
    lokasi: item.lokasi ?? "",
    testimoni: item.testimoni ?? "",
    jalur: item.jalur ?? "",
    skill: item.skill ?? [],
    rating: item.rating ?? null,
    photo: item.photo ?? null,
    featured: true,
  };
}

// Semua lulusan untuk direktori. Bila API tidak bisa dihubungi, data statis dipakai.
export async function getLulusanList(): Promise<Lulusan[]> {
  const data = await getAlumniApi();
  if (Array.isArray(data)) return data.map(toLulusan);
  return LULUSAN_DIREKTORI.map(toLulusanStatic);
}

// Testimoni hanya dari data asli di database: tanpa cadangan statis, section disembunyikan bila kosong.
export async function getTestimoniAlumni(): Promise<Lulusan[]> {
  return (await getLulusanList()).filter((alumni) => alumni.testimoni.trim());
}

// Lulusan terbaik untuk beranda.
export async function getLulusanTerbaik(): Promise<Lulusan[]> {
  const data = await getAlumniApi({ featured: true });
  if (Array.isArray(data)) return data.map(toLulusan);
  return LULUSAN_TERBAIK.map(toLulusanStatic);
}
