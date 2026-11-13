import { z } from "zod";

const imageValue = z.union([z.instanceof(File), z.string()]);

export const ekstrakurikulerSchema = z.object({
  ikon: z.string(),
  nama: z.string().trim().min(1, "Nama ekstrakurikuler wajib diisi."),
  fokus: z.string(),
  deskripsi: z.string(),
  sampul: imageValue.nullable(),
  jadwal: z.string(),
  lokasi: z.string(),
  anggota: z.string(),
  tentangJudul: z.string(),
  tentang: z.string(),
  galeriJudul: z.string(),
  galeri: z.array(imageValue.nullable()),
  pencapaian: z.array(z.string()),
  pencapaianIkon: z.array(z.string()),
  testimoni: z.array(z.object({ kutipan: z.string(), nama: z.string() })),
});

export type EkstrakurikulerFormValues = z.infer<typeof ekstrakurikulerSchema>;
