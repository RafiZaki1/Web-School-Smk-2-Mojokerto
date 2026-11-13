import { fetchPublic } from "@/shared/lib/http/client";
import type { AchievementRecord } from "../types/prestasi.type";

// Detail prestasi publik. undefined = tidak ditemukan, null = API tidak bisa dihubungi.
export const getAchievementApi = (slug: string) => fetchPublic<AchievementRecord>(`/achievements/${encodeURIComponent(slug)}`);
