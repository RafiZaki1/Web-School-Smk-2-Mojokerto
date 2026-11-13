// Mengikuti resource backend modul kelulusan (GraduationPublicController & GraduateController).
export type ReleaseMode = "draft" | "timer" | "open";
export type GraduationStatusValue = "passed" | "deferred";
export type AdministrationStatusValue = "cleared" | "pending";

export interface GraduationPublicStatus {
  mode: ReleaseMode;
  is_open: boolean;
  active_year: number;
  release_at: string | null;
  seconds_until_release: number;
  server_time: string;
  closed_message: string | null;
}

export interface GraduationCheckRequest {
  nisn: string;
  full_name: string;
}

export interface GraduationResult {
  nisn: string;
  full_name: string;
  class_name: string;
  major_label: string | null;
  graduation_year: number;
  status: GraduationStatusValue;
  status_label: string | null;
  administration_status: AdministrationStatusValue;
  administration_label: string | null;
  note: string | null;
}

export interface Graduate {
  id: number;
  nisn: string;
  full_name: string;
  birth_date: string | null;
  class_name: string;
  major_code: string;
  major_label: string | null;
  graduation_year: number;
  status: GraduationStatusValue;
  status_label: string | null;
  administration_status: AdministrationStatusValue;
  administration_label: string | null;
  note: string | null;
  is_archived: boolean;
  updated_at: string | null;
}

export type GraduatePayload = Partial<Pick<Graduate, "nisn" | "full_name" | "birth_date" | "class_name" | "graduation_year" | "status" | "administration_status" | "note">>;

export interface GraduateFilters {
  year: string;
  class: string;
  status: string;
  administration: string;
  search: string;
  archived: boolean;
  page: number;
}

export interface GraduationSetting {
  active_year: number;
  release_mode: ReleaseMode;
  release_mode_label: string;
  release_at: string | null;
  closed_message: string | null;
  updated_at: string | null;
}

export interface GraduationSettingResponse {
  setting: GraduationSetting;
  public_status: GraduationPublicStatus;
}

export type GraduationSettingPayload = Partial<Pick<GraduationSetting, "active_year" | "release_mode" | "release_at" | "closed_message">>;

export interface ImportSummary {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: { row: number; message: string }[];
}

export interface YearSummary {
  year: number;
  active: number;
  archived: number;
}
