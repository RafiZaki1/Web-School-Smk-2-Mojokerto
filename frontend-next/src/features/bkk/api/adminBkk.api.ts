import { createAdminResource } from "@/shared/lib/http/admin-resource";
import type { JobVacancyPayload, JobVacancyRecord } from "../types/bkk.type";

export const adminLokerApi = createAdminResource<JobVacancyRecord, JobVacancyPayload>("jobs");
