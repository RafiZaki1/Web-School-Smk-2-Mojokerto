import { createAdminResource } from "@/shared/lib/http/admin-resource";
import type { AlumniPayload, AlumniRecord } from "../types/lulusan.type";

export const adminLulusanApi = createAdminResource<AlumniRecord, AlumniPayload>("alumni");
