import type { AchievementPayload, AchievementRecord } from "../types/prestasi.type";
import type { PrestasiFormValues } from "../validation/prestasi.schema";

export const PREDIKAT = ["Juara 1", "Juara 2", "Juara 3", "Medali", "Harapan"];
export const TINGKAT = ["Lokal", "Regional", "Provinsi", "Nasional", "Internasional"];
export const KATEGORI = ["Akademik", "Non-akademik", "Olahraga", "Seni"];

export const PRESTASI_FORM_EMPTY: PrestasiFormValues = {
  judul: "",
  predikat: "Juara 1",
  tingkat: "Provinsi",
  kategori: "Akademik",
  siswa: "",
  kelas: "",
  fotoProfil: null,
  sampul: null,
  mulai: "",
  selesai: "",
  lokasi: "",
  penyelenggara: "",
  ringkasan: "",
  deskripsi: "",
  dokumen: null,
  testimoni: "",
  testiNama: "",
  testiJabatan: "",
  galeriJudul: "Galeri Momen",
  galeriDesc: "",
  galeri: [],
};

export function toPrestasiFormValues(item: AchievementRecord): PrestasiFormValues {
  return {
    judul: item.title,
    predikat: item.rank,
    tingkat: item.level,
    kategori: item.category ?? "Akademik",
    siswa: item.student_name,
    kelas: item.student_class ?? "",
    fotoProfil: item.student_photo,
    sampul: item.cover_image,
    mulai: item.start_date ?? "",
    selesai: item.end_date ?? "",
    lokasi: item.location ?? "",
    penyelenggara: item.organizer ?? "",
    ringkasan: item.summary ?? "",
    deskripsi: item.description ?? "",
    dokumen: item.document,
    testimoni: item.testimonial?.quote ?? "",
    testiNama: item.testimonial?.name ?? "",
    testiJabatan: item.testimonial?.position ?? "",
    galeriJudul: item.gallery_title ?? "Galeri Momen",
    galeriDesc: item.gallery_description ?? "",
    galeri: item.gallery ?? [],
  };
}

export function toPrestasiPayload(values: PrestasiFormValues, draft: boolean): AchievementPayload {
  return {
    title: values.judul.trim(),
    rank: values.predikat,
    level: values.tingkat,
    category: values.kategori,
    student_name: values.siswa.trim(),
    student_class: values.kelas,
    student_photo: values.fotoProfil,
    cover_image: values.sampul,
    start_date: values.mulai || null,
    end_date: values.selesai || null,
    location: values.lokasi,
    organizer: values.penyelenggara,
    summary: values.ringkasan,
    description: values.deskripsi,
    document: values.dokumen,
    testimonial: { quote: values.testimoni, name: values.testiNama, position: values.testiJabatan },
    gallery_title: values.galeriJudul,
    gallery_description: values.galeriDesc,
    gallery: values.galeri,
    is_published: !draft,
  };
}
