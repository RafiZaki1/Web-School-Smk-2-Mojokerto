import type { GuestMessageFilters, GuestMessageStatus, GuestVisitFilters, GuestVisitStatus } from "../types/buku-tamu.type";

// Query key buku tamu; data TU berada di bawah ["tu", ...].
export const bukuTamuKeys = {
  messages: () => ["tu", "guest-messages"] as const,
  messageList: (filters: GuestMessageFilters) => ["tu", "guest-messages", "list", filters] as const,
  visits: () => ["tu", "guest-visits"] as const,
  visitList: (filters: GuestVisitFilters) => ["tu", "guest-visits", "list", filters] as const,
};

export const MESSAGE_SCOPE = "guest-messages";
export const VISIT_SCOPE = "guest-visits";

export const MESSAGE_STATUS_OPTIONS: readonly { value: GuestMessageStatus; label: string }[] = [
  { value: "new", label: "Baru" },
  { value: "read", label: "Dibaca" },
  { value: "replied", label: "Dibalas" },
];

export const VISIT_STATUS_OPTIONS: readonly { value: GuestVisitStatus; label: string }[] = [
  { value: "scheduled", label: "Terjadwal" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Batal" },
];
