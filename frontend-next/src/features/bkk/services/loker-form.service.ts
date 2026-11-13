import type { JobVacancyPayload, JobVacancyRecord } from "../types/bkk.type";
import type { LokerFormValues } from "../validation/loker.schema";

export const LOKER_TIPE = ["Full-time", "Part-time", "Magang", "Kontrak"];
export const LOKER_STATUS = ["Aktif", "Tutup"];

export const LOKER_FORM_EMPTY: LokerFormValues = {
  poster: null,
  judul: "",
  perusahaan: "",
  lokasi: "",
  kategori: "IT & Teknologi",
  tipe: "Full-time",
  tutup: "",
  status: "Aktif",
  deskripsi: "",
  tanggungJawab: [""],
  kualifikasi: [""],
  kontak: "",
  email: "",
};

export function toLokerFormValues(job: JobVacancyRecord): LokerFormValues {
  return {
    poster: job.poster,
    judul: job.title,
    perusahaan: job.company,
    lokasi: job.location ?? "",
    kategori: job.category ?? "IT & Teknologi",
    tipe: job.employment_type ?? "Full-time",
    tutup: job.closes_at ?? "",
    status: job.status === "closed" ? "Tutup" : "Aktif",
    deskripsi: job.description ?? "",
    tanggungJawab: job.responsibilities?.length ? job.responsibilities : [""],
    kualifikasi: job.qualifications?.length ? job.qualifications : [""],
    kontak: job.contact_phone ?? "",
    email: job.contact_email ?? "",
  };
}

export function toLokerPayload(values: LokerFormValues): JobVacancyPayload {
  return {
    poster: values.poster,
    title: values.judul.trim(),
    company: values.perusahaan.trim(),
    location: values.lokasi,
    category: values.kategori,
    employment_type: values.tipe,
    closes_at: values.tutup || null,
    status: values.status === "Tutup" ? "closed" : "open",
    description: values.deskripsi,
    responsibilities: values.tanggungJawab.filter((item) => item.trim()),
    qualifications: values.kualifikasi.filter((item) => item.trim()),
    contact_phone: values.kontak,
    contact_email: values.email,
  };
}
