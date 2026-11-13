// Mengikuti DeviceNotificationResource dan AlumniServiceTrackResource di backend.
export type AlumniServiceStatus = "pending" | "processing" | "approved" | "rejected" | "completed";

export interface DeviceNotification {
  id: number;
  title: string;
  body: string;
  url: string | null;
  is_read: boolean;
  created_at: string | null;
}

export interface TrackedServiceRequest {
  ticket_code: string;
  full_name: string;
  class_name: string;
  service_type: string;
  service_type_label: string | null;
  status: AlumniServiceStatus;
  status_label: string | null;
  admin_note: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DeviceInbox {
  unread: number;
  notifications: DeviceNotification[];
  requests: TrackedServiceRequest[];
}

export interface PortalLink {
  id: number;
  key: string;
  label: string;
  url: string;
  is_active: boolean;
  sort_order: number;
  updated_at: string | null;
}
