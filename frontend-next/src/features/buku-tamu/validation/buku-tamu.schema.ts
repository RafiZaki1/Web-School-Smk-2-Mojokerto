import { z } from "zod";

const phonePattern = /^[0-9+\-\s]{8,20}$/;
const optionalPhone = z
  .string()
  .trim()
  .refine((value) => value === "" || phonePattern.test(value), "Nomor HP berisi 8-20 angka.");

export const guestMessageSchema = z
  .object({
    name: z.string().trim().min(1, "Nama wajib diisi.").max(255, "Nama maksimal 255 karakter."),
    email: z
      .string()
      .trim()
      .refine((value) => value === "" || z.email().safeParse(value).success, "Alamat email tidak valid."),
    phone: optionalPhone,
    subject: z.string().trim().min(1, "Perihal wajib diisi.").max(255, "Perihal maksimal 255 karakter."),
    message: z.string().trim().min(10, "Pesan minimal 10 karakter.").max(2000, "Pesan maksimal 2000 karakter."),
  })
  .refine((values) => values.email !== "" || values.phone !== "", { path: ["phone"], message: "Isi email atau nomor HP agar TU bisa membalas." });
export type GuestMessageFormValues = z.input<typeof guestMessageSchema>;

const todayIso = () => new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10);

/** `publicForm`: tamu hanya boleh memilih tanggal hari ini atau sesudahnya, dan wajib mengisi HP. */
export const guestVisitSchema = (publicForm: boolean) =>
  z.object({
    visitor_name: z.string().trim().min(1, "Nama tamu wajib diisi.").max(255, "Nama maksimal 255 karakter."),
    institution: z.string().trim().min(1, "Nama instansi wajib diisi.").max(255, "Nama instansi maksimal 255 karakter."),
    phone: publicForm ? z.string().trim().regex(phonePattern, "Nomor HP berisi 8-20 angka.") : optionalPhone,
    purpose: z.string().trim().min(1, "Tujuan kunjungan wajib diisi.").max(2000, "Tujuan maksimal 2000 karakter."),
    visit_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Pilih tanggal kunjungan.")
      .refine((value) => !publicForm || value >= todayIso(), "Tanggal kunjungan tidak boleh lewat dari hari ini."),
    visit_time: z.string().refine((value) => value === "" || /^\d{2}:\d{2}$/.test(value), "Jam tidak valid."),
    participants: z.string().refine((value) => value === "" || (Number(value) >= 1 && Number(value) <= 500), "Jumlah peserta 1-500 orang."),
    person_to_meet: z.string().max(255, "Maksimal 255 karakter."),
  });
export type GuestVisitFormValues = z.input<ReturnType<typeof guestVisitSchema>>;

export const GUEST_MESSAGE_EMPTY: GuestMessageFormValues = { name: "", email: "", phone: "", subject: "", message: "" };
export const GUEST_VISIT_EMPTY: GuestVisitFormValues = { visitor_name: "", institution: "", phone: "", purpose: "", visit_date: "", visit_time: "", participants: "", person_to_meet: "" };
