import type { AlumniServiceStatus, TrackedServiceRequest } from "@/shared/types/device-inbox.type";

// Mengikuti StoreAlumniServiceRequest, AlumniServiceRequestResource, dan AlumniServiceRequestController.
export type AlumniServiceType = "diploma_pickup" | "fingerprint" | "legalization";

export interface AlumniServiceSubmitRequest {
  nisn: string;
  full_name: string;
  graduation_year: number;
  class_name: string;
  service_type: AlumniServiceType;
  purpose: string;
  phone: string | null;
}

export type AlumniServiceSubmitResponse = TrackedServiceRequest;

export interface AlumniServiceRequest {
  id: number;
  ticket_code: string;
  nisn: string;
  full_name: string;
  graduation_year: number;
  class_name: string;
  major_code: string;
  major_label: string | null;
  service_type: AlumniServiceType;
  service_type_label: string | null;
  purpose: string;
  phone: string | null;
  status: AlumniServiceStatus;
  status_label: string | null;
  admin_note: string | null;
  processed_at: string | null;
  approved_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AlumniServiceUpdateRequest {
  status?: AlumniServiceStatus;
  admin_note?: string | null;
}

export interface AlumniServiceFilters {
  class: string;
  status: string;
  type: string;
  search: string;
  page: number;
}

export interface AlumniServiceSummary {
  statuses: Record<AlumniServiceStatus, number>;
  open_by_class: Record<string, number>;
}
