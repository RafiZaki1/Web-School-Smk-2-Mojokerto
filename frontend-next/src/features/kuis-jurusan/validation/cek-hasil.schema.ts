import { z } from "zod";

export const cekHasilSchema = z.object({
  kode: z.string().trim().min(1, "Masukkan kode hasil kuis.").max(12, "Kode hasil maksimal 12 karakter."),
});

export type CekHasilFormValues = z.infer<typeof cekHasilSchema>;
