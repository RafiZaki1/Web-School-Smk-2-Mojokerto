import { z } from "zod";

const imageValue = z.union([z.instanceof(File), z.string()]);
const WAJIB_KODE_NAMA = "Kode dan nama jurusan wajib diisi.";

export const jurusanSchema = z.object({
  foto: imageValue.nullable(),
  code: z.string().trim().min(1, WAJIB_KODE_NAMA),
  status: z.enum(["Aktif", "Draf"]),
  name: z.string().trim().min(1, WAJIB_KODE_NAMA),
  tagline: z.string(),
  akreditasi: z.string(),
  shortDesc: z.string(),
  longDesc: z.string(),
  accent: z.string(),
  kompetensi: z.array(z.object({ icon: z.string(), title: z.string() })),
  karir: z.array(z.object({ title: z.string(), desc: z.string(), icon: z.string() })),
  mitra: z.array(imageValue.nullable()),
  mitraNama: z.record(z.string(), z.string()),
  fasilitasLabel: z.string(),
  grupFasilitas: z.array(z.object({ judul: z.string(), foto: z.array(imageValue.nullable()) })),
});

export type JurusanFormValues = z.infer<typeof jurusanSchema>;
