import { z } from "zod";
import { SCHOOL_CLASSES } from "@/shared/constants/school-classes";

const thisYear = new Date().getFullYear();

export const alumniServiceSchema = z.object({
  nisn: z
    .string()
    .trim()
    .regex(/^\d{8,20}$/, "NISN berisi 8-20 digit angka."),
  full_name: z.string().trim().min(1, "Nama lengkap wajib diisi.").max(255, "Nama maksimal 255 karakter."),
  graduation_year: z
    .string()
    .regex(/^\d{4}$/, "Tahun lulus harus 4 digit.")
    .refine((value) => Number(value) >= 2000 && Number(value) <= thisYear + 1, "Tahun lulus tidak valid."),
  class_name: z.enum(SCHOOL_CLASSES, { message: "Pilih kelas terakhir." }),
  service_type: z.enum(["diploma_pickup", "fingerprint", "legalization"], { message: "Pilih jenis layanan." }),
  purpose: z.string().trim().min(5, "Keperluan minimal 5 karakter.").max(1000, "Keperluan maksimal 1000 karakter."),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || /^[0-9+\-\s]{8,20}$/.test(value), "Nomor HP berisi 8-20 angka."),
});

export type AlumniServiceFormValues = z.input<typeof alumniServiceSchema>;

export const ALUMNI_SERVICE_EMPTY: AlumniServiceFormValues = {
  nisn: "",
  full_name: "",
  graduation_year: "",
  class_name: "" as AlumniServiceFormValues["class_name"],
  service_type: "" as AlumniServiceFormValues["service_type"],
  purpose: "",
  phone: "",
};
