import { getSiteContentApi } from "@/shared/services/getSiteContent.api";
import { getJobApi } from "../api/getJob.api";
import { getJobOptionsApi } from "../api/getJobOptions.api";
import { getJobsApi } from "../api/getJobs.api";
import { BKK_CONTACT, BKK_KATEGORI, BKK_MISI, BKK_MITRA, BKK_REKRUT, BKK_VISI, LOWONGAN, getLowongan, type LowonganStatic } from "../constants/bkk-data";
import type { BkkContent, JobVacancyRecord, Lowongan } from "../types/bkk.type";

const LOKER_COLORS: Record<string, string> = {
  Perbankan: "#1d52c7",
  "IT & Teknologi": "#0c7870",
  "Kuliner & Hospitality": "#b22321",
  "Desain & Kreatif": "#e8890b",
  Manufaktur: "#4e369f",
};

const LOKER_STATUS_LABEL: Record<string, string> = { open: "Aktif", closed: "Tutup" };

// Ubah resource API menjadi bentuk yang dipakai komponen.
export function toLowongan(job: JobVacancyRecord): Lowongan {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    company: job.company,
    location: job.location || "-",
    kategori: job.category,
    tipe: job.employment_type,
    tutup: job.closes_label || "-",
    closesAt: job.closes_at,
    status: LOKER_STATUS_LABEL[job.status] ?? job.status,
    poster: job.poster,
    banner: {
      bg: job.banner?.color || LOKER_COLORS[job.category] || "#1d52c7",
      headline: job.banner?.headline || job.title,
      sub: job.banner?.subtitle || job.company,
    },
    deskripsi: job.description,
    tanggungJawab: job.responsibilities ?? [],
    kualifikasi: job.qualifications ?? [],
    kontak: { telepon: job.contact_phone, whatsapp: job.contact_phone, email: job.contact_email },
    updatedAt: job.updated_at,
  };
}

// Data statis dipetakan ke bentuk yang sama.
function toLowonganStatic(item: LowonganStatic): Lowongan {
  return {
    id: null,
    slug: item.slug,
    title: item.title,
    company: item.company,
    location: item.location,
    kategori: item.kategori,
    tipe: item.tipe,
    tutup: item.tutup,
    closesAt: null,
    status: item.status,
    poster: item.poster ?? null,
    banner: item.banner,
    deskripsi: item.deskripsi,
    tanggungJawab: item.tanggungJawab,
    kualifikasi: item.kualifikasi,
    kontak: item.kontak ?? { telepon: null, whatsapp: null, email: null },
    updatedAt: null,
  };
}

// Daftar lowongan untuk Server Component. Bila API tidak bisa dihubungi, data statis dipakai.
export async function getLowonganList(): Promise<Lowongan[]> {
  const data = await getJobsApi();
  if (Array.isArray(data)) return data.map(toLowongan);
  return LOWONGAN.map(toLowonganStatic);
}

// Detail lowongan. Hasil null berarti lowongan tidak ada.
export async function getLowonganDetail(slug: string): Promise<Lowongan | null> {
  const data = await getJobApi(slug);
  if (data === undefined) return null;
  if (data) return toLowongan(data);
  const fallback = getLowongan(slug);
  return fallback ? toLowonganStatic(fallback) : null;
}

export async function getLowonganKategori(): Promise<string[]> {
  return (await getJobOptionsApi())?.categories ?? BKK_KATEGORI;
}

// Konten halaman BKK. Bila admin sudah menyimpan konten, konten itu dipakai utuh.
export async function getBkkContent(): Promise<BkkContent> {
  const fallback: BkkContent = { visi: BKK_VISI, misi: BKK_MISI, mitra: BKK_MITRA, rekrut: BKK_REKRUT, kontak: BKK_CONTACT };
  const content = await getSiteContentApi<BkkContent>("bkk");
  return content?.value ?? fallback;
}
