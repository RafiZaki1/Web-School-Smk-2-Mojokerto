import { z } from "zod";
import { SCHOOL_CLASSES } from "@/shared/constants/school-classes";

const nisn = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ""))
  .pipe(z.string().min(8, "NISN minimal 8 digit angka.").max(20, "NISN maksimal 20 digit angka."));

const birthDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Isi tanggal lahir.");

export const graduationCheckSchema = z.object({
  full_name: z.string().trim().min(3, "Tulis nama lengkap sesuai rapor.").max(255, "Nama maksimal 255 karakter."),
  nisn,
});
export type GraduationCheckValues = z.input<typeof graduationCheckSchema>;

export const graduateSchema = z.object({
  nisn,
  full_name: z.string().trim().min(1, "Nama lengkap wajib diisi.").max(255, "Nama maksimal 255 karakter."),
  birth_date: birthDate,
  class_name: z.enum(SCHOOL_CLASSES, { message: "Pilih salah satu dari 12 kelas XII." }),
  graduation_year: z.string().regex(/^\d{4}$/, "Tahun lulus harus 4 digit."),
  status: z.enum(["passed", "deferred"]),
  administration_status: z.enum(["cleared", "pending"]),
  note: z.string().max(2000, "Catatan maksimal 2000 karakter."),
});
export type GraduateFormValues = z.input<typeof graduateSchema>;

export const graduationSettingSchema = z
  .object({
    active_year: z.string().regex(/^\d{4}$/, "Tahun angkatan harus 4 digit."),
    release_mode: z.enum(["draft", "timer", "open"]),
    // Nilai input datetime-local, dibaca sebagai waktu WIB
    release_at: z.string(),
    closed_message: z.string().max(500, "Pesan maksimal 500 karakter."),
  })
  .refine((values) => values.release_mode !== "timer" || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(values.release_at), {
    path: ["release_at"],
    message: "Isi tanggal dan jam rilis untuk mode timer.",
  });
export type GraduationSettingValues = z.input<typeof graduationSettingSchema>;
