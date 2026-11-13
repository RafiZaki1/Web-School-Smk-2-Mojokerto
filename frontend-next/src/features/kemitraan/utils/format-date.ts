const ACTIVITY_FORMAT = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" });

/** "2026-08-14" -> "Agustus 2026"; kosong bila tanggal tidak diisi. */
export function formatActivityDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? "" : ACTIVITY_FORMAT.format(date);
}
