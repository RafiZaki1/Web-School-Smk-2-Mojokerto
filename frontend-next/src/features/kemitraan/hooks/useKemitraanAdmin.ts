"use client";

import { useAdminDelete, useAdminList, useAdminSave } from "@/features/admin";
import { industryPartnerAdminApi, internshipDocumentationAdminApi } from "../api/kemitraanAdmin.api";
import { DOCUMENTATION_RESOURCE, PARTNER_RESOURCE } from "../constants/kemitraan-keys";
import type { IndustryPartner, InternshipDocumentation } from "../types/kemitraan.type";

export const useIndustryPartnersAdmin = () => useAdminList(PARTNER_RESOURCE, industryPartnerAdminApi.list);
export const useSaveIndustryPartner = (id: number | null) => useAdminSave(PARTNER_RESOURCE, id ? String(id) : undefined, industryPartnerAdminApi);
export const useDeleteIndustryPartner = () => useAdminDelete<IndustryPartner>(PARTNER_RESOURCE, (row) => industryPartnerAdminApi.remove(row.id));

export const useDocumentationsAdmin = () => useAdminList(DOCUMENTATION_RESOURCE, internshipDocumentationAdminApi.list);
export const useSaveDocumentation = (id: number | null) => useAdminSave(DOCUMENTATION_RESOURCE, id ? String(id) : undefined, internshipDocumentationAdminApi);
export const useDeleteDocumentation = () => useAdminDelete<InternshipDocumentation>(DOCUMENTATION_RESOURCE, (row) => internshipDocumentationAdminApi.remove(row.id));
