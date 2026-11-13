import type { AlumniServiceStatus } from "@/shared/types/device-inbox.type";

// Kelas svc-tag per status pengajuan; label teks tetap ditulis, warna hanya penegas.
export const SERVICE_STATUS_TONE: Record<AlumniServiceStatus, string> = {
  pending: "svc-tag--neutral",
  processing: "svc-tag--info",
  approved: "svc-tag--ok",
  rejected: "svc-tag--bad",
  completed: "svc-tag--ok",
};

const TIME_FORMAT = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

/** Waktu WIB yang mudah dibaca, mis. "12 Nov 2026, 09.30". */
export function formatServiceTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : TIME_FORMAT.format(date);
}
