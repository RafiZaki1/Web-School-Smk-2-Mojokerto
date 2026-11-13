import { z } from "zod";

export const tinjauKuisSchema = z.object({
  hasil: z.string().min(1, "Pilih jurusan yang disarankan."),
  catatanSiswa: z.string().max(2000, "Catatan untuk siswa maksimal 2000 karakter."),
  catatanInternal: z.string().max(5000, "Catatan internal maksimal 5000 karakter."),
});

export type TinjauKuisFormValues = z.infer<typeof tinjauKuisSchema>;
