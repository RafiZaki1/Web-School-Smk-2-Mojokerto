// Mengikuti GuestMessageRequest/Resource, GuestVisitRequest/Resource, dan UpdateGuestMessageRequest.
export type GuestMessageStatus = "new" | "read" | "replied";
export type GuestVisitStatus = "scheduled" | "completed" | "cancelled";

export interface GuestMessageRequest {
  name: string;
  email: string | null;
  phone: string | null;
  subject: string;
  message: string;
}

export interface GuestVisitRequest {
  visitor_name: string;
  institution: string;
  phone: string | null;
  purpose: string;
  visit_date: string;
  visit_time: string | null;
  participants: number | null;
  person_to_meet: string | null;
}

export interface GuestMessage {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string;
  message: string;
  status: GuestMessageStatus;
  status_label: string;
  admin_note: string | null;
  read_at: string | null;
  replied_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface GuestMessageUpdateRequest {
  status?: GuestMessageStatus;
  admin_note?: string | null;
}

export interface GuestVisit {
  id: number;
  visitor_name: string;
  institution: string;
  phone: string | null;
  purpose: string;
  visit_date: string | null;
  visit_time: string | null;
  participants: number;
  person_to_meet: string | null;
  status: GuestVisitStatus;
  status_label: string;
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type GuestVisitUpdateRequest = Partial<GuestVisitRequest> & { status?: GuestVisitStatus; note?: string | null };

export interface GuestMessageFilters {
  status: string;
  search: string;
}

export interface GuestVisitFilters {
  status: string;
  when: "" | "upcoming" | "past";
}
