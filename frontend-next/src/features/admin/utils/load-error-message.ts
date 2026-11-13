import { ApiError } from "@/shared/lib/http/api-error";

// Pesan untuk data yang gagal dimuat di form ubah.
export function loadErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 404) return "Data tidak ditemukan.";
  return error instanceof Error ? error.message : "Gagal memuat data.";
}
