import { fetchPublic } from "@/shared/lib/http/client";
import type { ExtracurricularRecord } from "../types/ekstrakurikuler.type";

// Detail ekstrakurikuler publik. undefined = tidak ditemukan, null = API tidak bisa dihubungi.
export const getExtracurricularApi = (slug: string) => fetchPublic<ExtracurricularRecord>(`/extracurriculars/${encodeURIComponent(slug)}`);
