import { z } from "zod";

const imageValue = z.union([z.instanceof(File), z.string()]);

export const lulusanSchema = z
  .object({
    nama: z.string().trim().min(1, "Nama dan tahun lulus wajib diisi."),
    jurusan: z.string(),
    angkatan: z.string().min(1, "Nama dan tahun lulus wajib diisi."),
    karier: z.string(),
    lokasi: z.string(),
    foto: imageValue.nullable(),
    unggulan: z.enum(["Ya", "Tidak"]),
    testimoni: z.string().max(600, "Testimoni maksimal 600 karakter."),
    rating: z.string(),
  })
  .refine((values) => /^\d{4}$/.test(values.angkatan), { message: "Tahun lulus harus 4 digit, mis: 2021.", path: ["angkatan"] });

export type LulusanFormValues = z.infer<typeof lulusanSchema>;
