import type { AlumniServiceStatus } from "@/shared/types/device-inbox.type";

// Mengikuti SchoolAdministrationDashboardService::summary() dan PortalLinkRequest di backend.
export interface TuDashboardSummary {
  graduation: {
    total: number;
    passed: number;
    deferred: number;
    administration_pending: number;
    active_year: number;
    mode: "draft" | "timer" | "open";
    is_open: boolean;
    release_at: string | null;
  };
  alumni_services: Record<AlumniServiceStatus, number>;
  guest_messages_new: number;
  guest_visits_upcoming: number;
  industry_partners: number;
}

export interface PortalLinkUpdateRequest {
  label?: string;
  url?: string;
  is_active?: boolean;
}
