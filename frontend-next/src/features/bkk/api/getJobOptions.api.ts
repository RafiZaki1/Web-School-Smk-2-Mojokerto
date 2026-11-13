import { fetchPublic } from "@/shared/lib/http/client";

export interface JobOptionsRecord {
  categories: string[];
}

// Pilihan bidang untuk filter lowongan. null = API tidak bisa dihubungi.
export const getJobOptionsApi = () => fetchPublic<JobOptionsRecord>("/jobs/options");
