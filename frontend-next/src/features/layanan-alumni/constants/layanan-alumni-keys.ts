import type { AlumniServiceFilters, AlumniServiceType } from "../types/layanan-alumni.type";
import type { AlumniServiceStatus } from "@/shared/types/device-inbox.type";

// Query key layanan alumni; data TU berada di bawah ["tu", ...].
export const layananAlumniKeys = {
  queue: () => ["tu", "alumni-services"] as const,
  queueList: (filters: AlumniServiceFilters) => ["tu", "alumni-services", "list", filters] as const,
  pushState: () => ["push-state"] as const,
};

export const SERVICE_TYPE_OPTIONS: readonly { value: AlumniServiceType; label: string; hint: string }[] = [
  { value: "diploma_pickup", label: "Ambil Ijazah", hint: "Ijazah asli dan SKHUN yang belum diambil." },
  { value: "fingerprint", label: "Cap Tiga Jari", hint: "Cap jari pada ijazah dan buku induk." },
  { value: "legalization", label: "Legalisir", hint: "Legalisir fotokopi ijazah atau transkrip." },
];

export const SERVICE_STATUS_OPTIONS: readonly { value: AlumniServiceStatus; label: string }[] = [
  { value: "pending", label: "Menunggu" },
  { value: "processing", label: "Diproses" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
  { value: "completed", label: "Selesai" },
];

export const ALUMNI_QUEUE_SCOPE = "alumni-services";
