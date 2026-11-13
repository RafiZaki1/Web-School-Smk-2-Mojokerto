import { z } from "zod";

const imageValue = z.union([z.instanceof(File), z.string()]);

export const lokerSchema = z.object({
  poster: imageValue.nullable(),
  judul: z.string().trim().min(1, "Judul posisi dan nama perusahaan wajib diisi."),
  perusahaan: z.string().trim().min(1, "Judul posisi dan nama perusahaan wajib diisi."),
  lokasi: z.string(),
  kategori: z.string().min(1),
  tipe: z.string(),
  tutup: z.string(),
  status: z.enum(["Aktif", "Tutup"]),
  deskripsi: z.string(),
  tanggungJawab: z.array(z.string()),
  kualifikasi: z.array(z.string()),
  kontak: z.string(),
  email: z.string().refine((value) => !value || /^\S+@\S+\.\S+$/.test(value), "Format email pelamar tidak valid."),
});

export type LokerFormValues = z.infer<typeof lokerSchema>;
