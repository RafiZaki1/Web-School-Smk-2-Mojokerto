import { fetchPublic } from "@/shared/lib/http/client";
import type { AchievementRecord } from "../types/prestasi.type";

// Daftar prestasi publik. null = API tidak bisa dihubungi.
export const getAchievementsApi = () => fetchPublic<AchievementRecord[]>("/achievements");
