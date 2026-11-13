import { z } from "zod";

const imageValue = z.union([z.instanceof(File), z.string()]);

export const beritaSchema = z.object({
  judul: z.string().trim().min(1, "Judul berita wajib diisi."),
  kategori: z.string().min(1, "Kategori wajib dipilih."),
  penulis: z.string(),
  tanggal: z.string(),
  sampul: imageValue.nullable(),
  isi: z.string().refine((value) => value.trim().length >= 20, "Isi berita minimal 20 karakter."),
  galeri: z.array(imageValue),
});

export type BeritaFormValues = z.infer<typeof beritaSchema>;
