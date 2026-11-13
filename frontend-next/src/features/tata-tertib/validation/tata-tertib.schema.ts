import { z } from "zod";

export const ruleSchema = z.object({
  section: z.string().trim().min(1, "Bagian wajib diisi.").max(255, "Bagian maksimal 255 karakter."),
  content: z.string().trim().min(1, "Isi aturan wajib diisi.").max(2000, "Isi aturan maksimal 2000 karakter."),
  is_active: z.boolean(),
  sort_order: z.string().regex(/^\d{0,4}$/, "Urutan berupa angka."),
});
export type RuleFormValues = z.input<typeof ruleSchema>;

export const uniformSchema = z.object({
  name: z.string().trim().min(1, "Nama seragam wajib diisi.").max(255, "Nama maksimal 255 karakter."),
  description: z.string().max(2000, "Keterangan maksimal 2000 karakter."),
  image: z.union([z.instanceof(File), z.string()]).nullable(),
});
export type UniformFormValues = z.input<typeof uniformSchema>;
