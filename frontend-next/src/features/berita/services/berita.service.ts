import { publishLabel } from "@/shared/utils/publish-label";
import { getArticleApi } from "../api/getArticle.api";
import { getArticleCategoriesApi } from "../api/getArticleCategories.api";
import { getArticlesApi } from "../api/getArticles.api";
import { BERITA, BERITA_KATEGORI, getBerita, type BeritaStaticItem } from "../constants/berita-data";
import type { ArticleRecord, Berita, BeritaTeaser } from "../types/berita.type";

const BERITA_GRADIENTS: Record<string, string> = {
  Prestasi: "from-[var(--color-primary)] to-[var(--color-navy)]",
  "Agenda sekolah": "from-[var(--color-navy)] to-[var(--color-navy-deep)]",
  "Informasi umum": "from-[var(--color-navy)] to-[var(--color-navy-deep)]",
  Pengumuman: "from-[var(--color-brand)] to-[var(--color-primary)]",
  "Karya siswa": "from-[var(--color-primary-dark)] to-[var(--color-navy-deep)]",
};

const DEFAULT_GRADIENT = BERITA_GRADIENTS.Prestasi;

const LEGACY_SAMPLE_SLUGS = new Set([
  "siswa-gim-ciptakan-game-edukasi-ar",
  "belajar-teknologi-standar-global",
  "siswa-diterima-24-kampus-luar-negeri",
  "jadwal-libur-semester-genap",
  "pameran-karya-desain-dkv",
  "job-fair-bkk",
  "ukk-dkv-2024",
]);

/**
 * Ubah resource API menjadi bentuk domain Berita yang dipakai komponen.
 * Jika slug cocok dengan 4 berita resmi sekolah, pastikan gambar sampul WebP
 * dan paragraf bersih yang telah terkurasi tetap terjaga.
 */
export function toBerita(item: ArticleRecord): Berita {
  const staticMatch = getBerita(item.slug);
  const cover = staticMatch?.thumb ?? item.cover_image;
  const paragraphs = staticMatch?.paragraphs?.length ? staticMatch.paragraphs : item.paragraphs;
  const safeGallery = (staticMatch?.gallery ?? item.gallery ?? []).filter((src) => src.startsWith("/"));

  return {
    id: item.id,
    slug: item.slug,
    category: staticMatch?.category ?? item.category,
    title: staticMatch?.title ?? item.title,
    date: item.published_label || staticMatch?.date || "",
    publishedAt: item.published_at,
    thumb: cover,
    hero: staticMatch?.hero ?? cover,
    gradient: BERITA_GRADIENTS[staticMatch?.category ?? item.category] ?? DEFAULT_GRADIENT,
    author: staticMatch?.author || item.author || "Admin Sekolah",
    excerpt: paragraphs[0] ?? item.excerpt,
    paragraphs,
    gallery: safeGallery,
    status: publishLabel(item.is_published),
    updatedAt: item.updated_at,
  };
}

// Data statis dipetakan ke bentuk yang sama agar komponen tidak bercabang.
function toBeritaStatic(item: BeritaStaticItem): Berita {
  const detail = getBerita(item.slug);
  return {
    id: null,
    slug: item.slug,
    category: item.category,
    title: item.title,
    date: item.date,
    publishedAt: null,
    thumb: item.thumb ?? null,
    hero: detail?.hero ?? item.thumb ?? null,
    gradient: item.gradient,
    author: detail?.author ?? "Admin Sekolah",
    excerpt: detail?.paragraphs[0] ?? "",
    paragraphs: detail?.paragraphs ?? [],
    gallery: detail?.gallery ?? [],
    status: "Aktif",
    updatedAt: null,
  };
}

export function toBeritaTeaser(item: Berita): BeritaTeaser {
  return {
    title: item.title,
    tag: item.category,
    gradient: item.gradient,
    thumb: item.thumb,
    href: `/berita/${item.slug}`,
  };
}

// Daftar berita untuk Server Component. Bila API tidak bisa dihubungi, data statis dipakai.
export async function getBeritaList(limit?: number): Promise<Berita[]> {
  const data = await getArticlesApi({ limit });
  if (Array.isArray(data)) {
    const valid = data.filter((item) => !LEGACY_SAMPLE_SLUGS.has(item.slug));
    if (valid.length > 0) {
      const mapped = valid.map(toBerita);
      const existingSlugs = new Set(mapped.map((item) => item.slug));
      const missingStatic = BERITA.filter((item) => !existingSlugs.has(item.slug)).map(toBeritaStatic);
      const combined = [...mapped, ...missingStatic];
      return limit ? combined.slice(0, limit) : combined;
    }
  }
  const fallback = limit ? BERITA.slice(0, limit) : BERITA;
  return fallback.map(toBeritaStatic);
}

// Detail berita. Hasil null berarti berita tidak ada.
export async function getBeritaDetail(slug: string): Promise<Berita | null> {
  const data = await getArticleApi(slug);
  if (data) return toBerita(data);
  const fallback = getBerita(slug);
  return fallback ? toBeritaStatic(fallback) : null;
}

export async function getBeritaKategori(): Promise<string[]> {
  return (await getArticleCategoriesApi()) ?? BERITA_KATEGORI;
}
