import { createAdminResource } from "@/shared/lib/http/admin-resource";
import { DOCUMENTATION_PATH, PARTNER_PATH } from "../constants/kemitraan-keys";
import type { IndustryPartner, IndustryPartnerPayload, InternshipDocumentation, InternshipDocumentationPayload } from "../types/kemitraan.type";

// CRUD TU: daftar, tambah, ubah (POST multipart agar logo/foto terbaca), hapus.
export const industryPartnerAdminApi = createAdminResource<IndustryPartner, IndustryPartnerPayload>(PARTNER_PATH);
export const internshipDocumentationAdminApi = createAdminResource<InternshipDocumentation, InternshipDocumentationPayload>(DOCUMENTATION_PATH);
