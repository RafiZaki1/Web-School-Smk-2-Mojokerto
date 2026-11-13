import type { UploadValue } from "@/shared/components/form/FormImageUpload";

// Mengikuti IndustryPartnerResource dan InternshipDocumentationResource di backend.
export interface IndustryPartner {
  id: number;
  name: string;
  logo: string | null;
  major_codes: string[];
  major_labels: string[];
  city: string | null;
  website: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  updated_at: string | null;
}

export interface IndustryPartnerPayload {
  name: string;
  logo?: UploadValue;
  major_codes: string[];
  city: string | null;
  website: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface InternshipDocumentation {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  major_code: string | null;
  major_label: string | null;
  industry_partner_id: number | null;
  industry_partner?: string | null;
  activity_date: string | null;
  is_published: boolean;
  sort_order: number;
  updated_at: string | null;
}

export interface InternshipDocumentationPayload {
  title: string;
  description: string | null;
  image?: UploadValue;
  major_code: string | null;
  industry_partner_id: number | null;
  activity_date: string | null;
  is_published: boolean;
  sort_order: number;
}
