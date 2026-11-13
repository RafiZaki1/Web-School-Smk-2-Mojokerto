import { createAdminResource } from "@/shared/lib/http/admin-resource";
import type { AchievementPayload, AchievementRecord } from "../types/prestasi.type";

export const adminPrestasiApi = createAdminResource<AchievementRecord, AchievementPayload>("achievements");
