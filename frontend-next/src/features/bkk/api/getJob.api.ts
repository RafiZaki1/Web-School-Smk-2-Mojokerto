import { fetchPublic } from "@/shared/lib/http/client";
import type { JobVacancyRecord } from "../types/bkk.type";

// Detail lowongan publik. undefined = tidak ditemukan, null = API tidak bisa dihubungi.
export const getJobApi = (slug: string) => fetchPublic<JobVacancyRecord>(`/jobs/${encodeURIComponent(slug)}`);
