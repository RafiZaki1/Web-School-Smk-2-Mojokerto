import { fetchPublic } from "@/shared/lib/http/client";
import type { ExtracurricularRecord } from "../types/ekstrakurikuler.type";

// Daftar ekstrakurikuler publik. null = API tidak bisa dihubungi.
export const getExtracurricularsApi = () => fetchPublic<ExtracurricularRecord[]>("/extracurriculars");
