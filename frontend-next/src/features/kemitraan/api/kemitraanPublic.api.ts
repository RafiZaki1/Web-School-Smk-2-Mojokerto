import { fetchPublic } from "@/shared/lib/http/client";
import type { IndustryPartner, InternshipDocumentation } from "../types/kemitraan.type";

// Data publik untuk Server Component (ISR). null = API tidak bisa dihubungi.
export const getIndustryPartnersApi = (): Promise<IndustryPartner[] | null | undefined> => fetchPublic<IndustryPartner[]>("/industry-partners", { revalidate: 60 });

export const getInternshipDocumentationsApi = (limit = 0): Promise<InternshipDocumentation[] | null | undefined> =>
  fetchPublic<InternshipDocumentation[]>(limit ? `/internship-documentations?limit=${limit}` : "/internship-documentations", { revalidate: 60 });
