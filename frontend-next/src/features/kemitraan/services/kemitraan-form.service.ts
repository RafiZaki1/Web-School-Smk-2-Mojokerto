import type { UploadValue } from "@/shared/components/form/FormImageUpload";
import type { DocumentationFormValues, PartnerFormValues } from "../validation/kemitraan.schema";
import type { IndustryPartner, IndustryPartnerPayload, InternshipDocumentation, InternshipDocumentationPayload } from "../types/kemitraan.type";

// Gambar lama (URL dari server) tidak dikirim ulang; hanya file baru atau null (hapus) yang dikirim.
const imageField = (value: UploadValue): UploadValue | undefined => (typeof value === "string" ? undefined : value);

export const toPartnerFormValues = (partner: IndustryPartner | null): PartnerFormValues => ({
  name: partner?.name ?? "",
  logo: partner?.logo ?? null,
  major_codes: partner?.major_codes ?? [],
  city: partner?.city ?? "",
  website: partner?.website ?? "",
  description: partner?.description ?? "",
  is_active: partner?.is_active ?? true,
  sort_order: String(partner?.sort_order ?? 0),
});

export const toPartnerPayload = (values: PartnerFormValues): IndustryPartnerPayload => ({
  name: values.name.trim(),
  logo: imageField(values.logo),
  major_codes: values.major_codes,
  city: values.city.trim() || null,
  website: values.website.trim() || null,
  description: values.description.trim() || null,
  is_active: values.is_active,
  sort_order: Number(values.sort_order || 0),
});

export const toDocumentationFormValues = (doc: InternshipDocumentation | null): DocumentationFormValues => ({
  title: doc?.title ?? "",
  description: doc?.description ?? "",
  image: doc?.image ?? null,
  major_code: doc?.major_code ?? "",
  industry_partner_id: doc?.industry_partner_id ? String(doc.industry_partner_id) : "",
  activity_date: doc?.activity_date ?? "",
  is_published: doc?.is_published ?? true,
  sort_order: String(doc?.sort_order ?? 0),
});

export const toDocumentationPayload = (values: DocumentationFormValues): InternshipDocumentationPayload => ({
  title: values.title.trim(),
  description: values.description.trim() || null,
  image: imageField(values.image),
  major_code: values.major_code || null,
  industry_partner_id: values.industry_partner_id ? Number(values.industry_partner_id) : null,
  activity_date: values.activity_date || null,
  is_published: values.is_published,
  sort_order: Number(values.sort_order || 0),
});
