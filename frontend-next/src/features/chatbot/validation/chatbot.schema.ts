import { z } from "zod";

// Isi kolom ketik SADA. Pesan kosong (setelah dipangkas) tidak dikirim.
export const chatComposerSchema = z.object({
  message: z.string().trim().min(1, "Ketik pesan terlebih dahulu."),
});

export type ChatComposerValues = z.infer<typeof chatComposerSchema>;
