import { z } from "zod";

const imageValue = z.union([z.instanceof(File), z.string()]).nullable();
const sortOrder = z.string().regex(/^\d{0,4}$/, "Urutan berupa angka.");

export const partnerSchema = z.object({
  name: z.string().trim().min(1, "Nama perusahaan wajib diisi.").max(255, "Nama maksimal 255 karakter."),
  logo: imageValue,
  major_codes: z.array(z.string()),
  city: z.string().max(255, "Kota maksimal 255 karakter."),
  website: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\/\S+$/i.test(value), "Alamat situs diawali http:// atau https://."),
  description: z.string().max(2000, "Deskripsi maksimal 2000 karakter."),
  is_active: z.boolean(),
  sort_order: sortOrder,
});
export type PartnerFormValues = z.input<typeof partnerSchema>;

export const documentationSchema = z
  .object({
    title: z.string().trim().min(1, "Judul kegiatan wajib diisi.").max(255, "Judul maksimal 255 karakter."),
    description: z.string().max(2000, "Deskripsi maksimal 2000 karakter."),
    image: imageValue,
    major_code: z.string(),
    industry_partner_id: z.string(),
    activity_date: z.string(),
    is_published: z.boolean(),
    sort_order: sortOrder,
  })
  .refine((values) => values.image !== null, { path: ["image"], message: "Unggah foto kegiatan." });
export type DocumentationFormValues = z.input<typeof documentationSchema>;
