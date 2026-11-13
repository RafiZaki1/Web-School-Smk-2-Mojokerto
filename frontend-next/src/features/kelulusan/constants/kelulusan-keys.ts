import type { GraduateFilters } from "../types/kelulusan.type";

// Query key kelulusan. Semua data TU berada di bawah ["tu", ...] agar mudah di-invalidate.
export const kelulusanKeys = {
  status: () => ["graduation", "status"] as const,
  settings: () => ["tu", "graduation-settings"] as const,
  graduates: () => ["tu", "graduates"] as const,
  graduateList: (filters: GraduateFilters) => ["tu", "graduates", "list", filters] as const,
  years: () => ["tu", "graduates", "years"] as const,
  dashboard: () => ["tu", "dashboard"] as const,
};

export const RELEASE_MODE_OPTIONS = [
  { value: "draft", label: "Draft / Sembunyikan", hint: "Halaman menampilkan pesan bahwa pengumuman belum dibuka." },
  { value: "timer", label: "Gunakan Timer", hint: "Form terkunci dan hitung mundur tampil sampai waktu rilis, lalu terbuka otomatis." },
  { value: "open", label: "Buka Langsung", hint: "Form cek kelulusan langsung bisa dipakai." },
] as const;

export const GRADUATION_STATUS_OPTIONS = [
  { value: "passed", label: "Lulus" },
  { value: "deferred", label: "Ditunda" },
] as const;

export const ADMINISTRATION_OPTIONS = [
  { value: "cleared", label: "Beres" },
  { value: "pending", label: "Belum" },
] as const;

/** Header file impor; kolom jurusan boleh ada, tetapi jurusan selalu diambil dari kelas. */
export const IMPORT_TEMPLATE_HREF = "/templates/format-kelulusan.csv";
