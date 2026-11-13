import type { ArticlePayload, ArticleRecord } from "../types/berita.type";
import type { BeritaFormValues } from "../validation/berita.schema";

export const BERITA_FORM_EMPTY: BeritaFormValues = {
  judul: "",
  kategori: "Informasi umum",
  penulis: "Admin Sekolah",
  tanggal: "",
  sampul: null,
  isi: "",
  galeri: [],
};

// Data API -> nilai form ubah
export function toBeritaFormValues(item: ArticleRecord): BeritaFormValues {
  return {
    judul: item.title,
    kategori: item.category,
    penulis: item.author ?? "Admin Sekolah",
    tanggal: item.published_at ?? "",
    sampul: item.cover_image,
    isi: item.body ?? "",
    galeri: item.gallery ?? [],
  };
}

// Nilai form -> muatan API. Draf disimpan dengan is_published = false.
export function toBeritaPayload(values: BeritaFormValues, draft: boolean): ArticlePayload {
  return {
    title: values.judul.trim(),
    category: values.kategori,
    author: values.penulis,
    published_at: values.tanggal || undefined,
    cover_image: values.sampul,
    body: values.isi,
    gallery: values.galeri,
    is_published: !draft,
  };
}
