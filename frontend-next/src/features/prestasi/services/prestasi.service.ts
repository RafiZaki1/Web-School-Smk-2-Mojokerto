import { publishLabel } from "@/shared/utils/publish-label";
import { getAchievementApi } from "../api/getAchievement.api";
import { getAchievementsApi } from "../api/getAchievements.api";
import { getPrestasiDetail, PRESTASI_LIST, type PrestasiStaticItem } from "../constants/prestasi-data";
import type { AchievementRecord, PrestasiCardItem, PrestasiDetail, PrestasiTone } from "../types/prestasi.type";

const PRESTASI_TONES: Record<string, PrestasiTone> = { Akademik: "blue", "Non-akademik": "teal", Olahraga: "indigo", Seni: "sky" };

const LEGACY_PRESTASI_SLUGS = new Set([
  "lomba-menulis-surat-gubernur",
  "duta-koperasi-provinsi",
  "turnamen-futsal-tunas-cup-2026",
  "kejurprov-dayung-2026",
  "graphic-design-technology",
  "lomba-debat-bahasa-inggris",
]);

// Ubah resource API menjadi kartu prestasi.
export function toPrestasiCard(item: AchievementRecord): PrestasiCardItem {
  const staticMatch = PRESTASI_LIST.find((entry) => entry.slug === item.slug);
  return {
    id: item.id,
    slug: item.slug,
    badge: staticMatch?.badge ?? item.rank,
    cardTitle: staticMatch?.cardTitle ?? item.card_title,
    title: staticMatch?.title ?? item.title,
    date: item.date_label || staticMatch?.date || "",
    level: staticMatch?.level ?? item.level,
    kategori: staticMatch?.kategori ?? item.category ?? "Lainnya",
    year: item.year ? String(item.year) : staticMatch?.year ?? "",
    subtitle: staticMatch?.subtitle ?? item.subtitle,
    tone: staticMatch?.tone ?? PRESTASI_TONES[item.category ?? ""] ?? "blue",
    image: staticMatch?.image ?? item.cover_image,
    siswa: item.student_name,
    kelas: item.student_class,
    status: publishLabel(item.is_published),
    updatedAt: item.updated_at,
  };
}

// Ubah resource API menjadi detail halaman prestasi.
export function toPrestasiDetail(item: AchievementRecord): PrestasiDetail {
  const staticDetail = getPrestasiDetail(item.slug);
  if (staticDetail) {
    return {
      ...staticDetail,
      slug: item.slug,
      dokumen: item.document ?? staticDetail.dokumen ?? null,
    };
  }

  return {
    slug: item.slug,
    predikat: item.rank,
    tingkat: `Tingkat ${item.level}`,
    bulan: item.date_label ?? "",
    title: item.title,
    hero: item.cover_image || "/prestasi-utama.webp",
    siswa: { nama: item.student_name, kelas: item.student_class || "SMKN 2 Kota Mojokerto", foto: item.student_photo },
    tanggal: item.date_range_label || item.date_label || "-",
    lokasi: item.location || "-",
    penyelenggara: item.organizer || "-",
    ringkasan: item.summary || item.title,
    deskripsi: item.paragraphs?.length ? item.paragraphs : [item.subtitle],
    dokumen: item.document,
    testimoni: item.testimonial?.quote ? { quote: item.testimonial.quote, nama: item.testimonial.name, jabatan: item.testimonial.position } : null,
    galeri: item.gallery?.length ? { judul: item.gallery_title || "Galeri Momen", deskripsi: item.gallery_description || "", foto: item.gallery } : null,
  };
}

// Data statis dipetakan ke bentuk kartu yang sama.
function toPrestasiCardStatic(item: PrestasiStaticItem): PrestasiCardItem {
  return { ...item, id: null, image: item.image ?? null, siswa: null, kelas: null, status: null, updatedAt: null };
}

// Daftar prestasi untuk Server Component. Bila API mengembalikan data contoh lama atau tidak terhubung, gunakan daftar prestasi resmi.
export async function getPrestasiList(): Promise<PrestasiCardItem[]> {
  const data = await getAchievementsApi();
  if (Array.isArray(data)) {
    const valid = data.filter((item) => !LEGACY_PRESTASI_SLUGS.has(item.slug));
    if (valid.length > 0) {
      const apiCards = valid.map(toPrestasiCard);
      const existingSlugs = new Set(apiCards.map((item) => item.slug));
      const missingStatic = PRESTASI_LIST.filter((item) => !existingSlugs.has(item.slug)).map(toPrestasiCardStatic);
      return [...apiCards, ...missingStatic];
    }
  }
  return PRESTASI_LIST.map(toPrestasiCardStatic);
}

// Detail prestasi. Hasil null berarti prestasi tidak ada.
export async function getPrestasi(slug: string): Promise<PrestasiDetail | null> {
  const fallback = getPrestasiDetail(slug);
  if (fallback) {
    return { ...fallback, slug, dokumen: fallback.dokumen ?? null };
  }
  const data = await getAchievementApi(slug);
  if (data) return toPrestasiDetail(data);
  return null;
}
