import { fetchPublic } from "@/shared/lib/http/client";
import type { JobVacancyRecord } from "../types/bkk.type";

// Daftar lowongan publik. null = API tidak bisa dihubungi.
export const getJobsApi = () => fetchPublic<JobVacancyRecord[]>("/jobs");
