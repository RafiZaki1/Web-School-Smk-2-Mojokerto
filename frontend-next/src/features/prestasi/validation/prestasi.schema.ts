import { z } from "zod";

const imageValue = z.union([z.instanceof(File), z.string()]);
const WAJIB_JUDUL_SISWA = "Judul prestasi dan nama siswa wajib diisi.";

export const prestasiSchema = z
  .object({
    judul: z.string().trim().min(1, WAJIB_JUDUL_SISWA),
    predikat: z.string(),
    tingkat: z.string(),
    kategori: z.string(),
    siswa: z.string().trim().min(1, WAJIB_JUDUL_SISWA),
    kelas: z.string(),
    fotoProfil: imageValue.nullable(),
    sampul: imageValue.nullable(),
    mulai: z.string(),
    selesai: z.string(),
    lokasi: z.string(),
    penyelenggara: z.string(),
    ringkasan: z.string(),
    deskripsi: z.string(),
    dokumen: imageValue.nullable(),
    testimoni: z.string(),
    testiNama: z.string(),
    testiJabatan: z.string(),
    galeriJudul: z.string(),
    galeriDesc: z.string(),
    galeri: z.array(imageValue.nullable()),
  })
  .refine((values) => !(values.mulai && values.selesai && values.selesai < values.mulai), {
    message: "Tanggal selesai tidak boleh sebelum tanggal mulai.",
    path: ["selesai"],
  });

export type PrestasiFormValues = z.infer<typeof prestasiSchema>;
