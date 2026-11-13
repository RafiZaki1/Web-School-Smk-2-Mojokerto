import type { AlumniPayload, AlumniRecord } from "../types/lulusan.type";
import type { LulusanFormValues } from "../validation/lulusan.schema";

export const JURUSAN_LULUSAN = ["RPL", "APHP", "LPS", "DKV", "TB"];
export const TAMPIL = ["Ya", "Tidak"];
export const RATING_OPTIONS = ["5 ★", "4 ★", "3 ★", "2 ★", "1 ★"];

export const LULUSAN_FORM_EMPTY: LulusanFormValues = {
  nama: "",
  jurusan: "RPL",
  angkatan: "",
  karier: "",
  lokasi: "",
  foto: null,
  unggulan: "Tidak",
  testimoni: "",
  rating: "5 ★",
};

export function toLulusanFormValues(item: AlumniRecord): LulusanFormValues {
  return {
    nama: item.name,
    jurusan: item.major_code,
    angkatan: String(item.graduation_year ?? ""),
    karier: item.career ?? "",
    lokasi: item.work_location ?? "",
    foto: item.photo,
    unggulan: item.is_featured ? "Ya" : "Tidak",
    testimoni: item.testimonial ?? "",
    rating: `${item.rating ?? 5} ★`,
  };
}

export function toLulusanPayload(values: LulusanFormValues): AlumniPayload {
  return {
    name: values.nama.trim(),
    major_code: values.jurusan,
    graduation_year: values.angkatan,
    career: values.karier,
    work_location: values.lokasi,
    photo: values.foto,
    is_featured: values.unggulan === "Ya",
    testimonial: values.testimoni.trim(),
    rating: values.testimoni.trim() ? Number(values.rating.split(" ")[0]) : null,
  };
}
