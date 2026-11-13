import { fetchPublic } from "@/shared/lib/http/client";
import type { MajorRecord } from "../types/jurusan.type";

// Detail jurusan publik. undefined = tidak ditemukan, null = API tidak bisa dihubungi.
export const getMajorApi = (slug: string) => fetchPublic<MajorRecord>(`/majors/${encodeURIComponent(slug)}`);
