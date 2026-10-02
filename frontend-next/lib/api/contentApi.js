import { fetchPublic } from "./client";
import { toAspirasiPublik, toBerita, toEkstra, toJurusan, toLowongan, toLulusan, toPrestasiCard, toPrestasiDetail } from "./adapters";
import { ASPIRASI_KATEGORI, ASPIRASI_PUBLIK } from "@/lib/data/aspirasiData";
import { BERITA, BERITA_KATEGORI, getBerita } from "@/lib/data/beritaData";
import { BKK_CONTACT, BKK_KATEGORI, BKK_MISI, BKK_MITRA, BKK_REKRUT, BKK_VISI, LOWONGAN, getLowongan } from "@/lib/data/bkkData";
import { EKSTRA_DATA, EKSTRA_LIST } from "@/lib/data/ekstraData";
import { FASILITAS_GROUPS } from "@/lib/data/fasilitasData";
import { JURUSAN_DATA, MITRA_LANDING_TOP_TIER } from "@/lib/data/jurusanData";
import { LULUSAN_DIREKTORI, LULUSAN_TERBAIK } from "@/lib/data/lulusanData";
import { PRESTASI_LIST, getPrestasiDetail } from "@/lib/data/prestasiData";
import { PRODUK, PRODUK_KEUNGGULAN, PRODUK_WHATSAPP } from "@/lib/data/produkData";
import { KEPALA_SEKOLAH, SEJARAH_INTRO, SEJARAH_TIMELINE } from "@/lib/data/sejarahData";
import { SPMB_DOMISILI, SPMB_JALUR, SPMB_NILAI_2025 } from "@/lib/data/spmbData";

/**
 * Data konten untuk Server Component. Sumber utama adalah API Laravel;
 * bila API tidak bisa dihubungi, data statis lib/data dipakai sebagai cadangan
 * sehingga halaman tetap tampil. Detail yang tidak ada (404) mengembalikan null.
 */

const list = async (endpoint, map, fallback) => {
  const data = await fetchPublic(endpoint);
  return Array.isArray(data) ? data.map(map) : fallback;
};

const detail = async (endpoint, map, fallback) => {
  const data = await fetchPublic(endpoint);
  if (data === undefined) return null;
  return data ? map(data) : fallback();
};

const content = async (key, fallback) => (await fetchPublic(`/contents/${key}`))?.value ?? fallback;

// Jurusan
export const getJurusanList = () => list("/majors", toJurusan, Object.values(JURUSAN_DATA));
export const getJurusan = (slug) => detail(`/majors/${encodeURIComponent(slug)}`, toJurusan, () => JURUSAN_DATA[slug] ?? null);

// Prestasi
export const getPrestasiList = () => list("/achievements", toPrestasiCard, PRESTASI_LIST);
export const getPrestasi = (slug) => detail(`/achievements/${encodeURIComponent(slug)}`, toPrestasiDetail, () => getPrestasiDetail(slug));

// Ekstrakurikuler
export const getEkstraList = () => list("/extracurriculars", toEkstra, EKSTRA_LIST);
export const getEkstra = (slug) => detail(`/extracurriculars/${encodeURIComponent(slug)}`, toEkstra, () => EKSTRA_DATA[slug] ?? null);

// Berita
export const getBeritaList = (limit) => list(`/articles${limit ? `?limit=${limit}` : ""}`, toBerita, limit ? BERITA.slice(0, limit) : BERITA);
export const getBeritaDetail = (slug) => detail(`/articles/${encodeURIComponent(slug)}`, toBerita, () => getBerita(slug));
export const getBeritaKategori = async () => (await fetchPublic("/articles/categories")) ?? BERITA_KATEGORI;

// Loker & BKK
export const getLowonganList = () => list("/jobs", toLowongan, LOWONGAN);
export const getLowonganDetail = (slug) => detail(`/jobs/${encodeURIComponent(slug)}`, toLowongan, () => getLowongan(slug));
export const getLowonganKategori = async () => (await fetchPublic("/jobs/options"))?.categories ?? BKK_KATEGORI;
export const getBkkContent = () =>
  content("bkk", { visi: BKK_VISI, misi: BKK_MISI, mitra: BKK_MITRA, rekrut: BKK_REKRUT, kontak: BKK_CONTACT });

// Lulusan
export const getLulusanList = () => list("/alumni", toLulusan, LULUSAN_DIREKTORI);
export const getLulusanTerbaik = () => list("/alumni?featured=1", toLulusan, LULUSAN_TERBAIK);

// Aspirasi
export async function getAspirasiPublik() {
  const data = await fetchPublic("/aspirations", { revalidate: 30 });
  return data ? { kategori: data.categories, items: data.items.map(toAspirasiPublik) } : { kategori: ASPIRASI_KATEGORI, items: ASPIRASI_PUBLIK };
}

// Konten halaman
export const getMitraLanding = async () => (await content("mitra", null))?.items ?? MITRA_LANDING_TOP_TIER;
export const getFasilitasGroups = async () => (await content("fasilitas", null))?.groups ?? FASILITAS_GROUPS;
export const getSpmbContent = () => content("spmb", { jalur: SPMB_JALUR, nilai: SPMB_NILAI_2025, nilai_tahun: 2025, domisili: SPMB_DOMISILI });
export const getProdukContent = () => content("produk", { whatsapp: PRODUK_WHATSAPP, items: PRODUK, keunggulan: PRODUK_KEUNGGULAN });
export const getSejarahContent = () => content("sejarah", { intro: SEJARAH_INTRO, timeline: SEJARAH_TIMELINE, kepala_sekolah: KEPALA_SEKOLAH });
