import { createAdminResource } from "@/shared/lib/http/admin-resource";
import type { ExtracurricularPayload, ExtracurricularRecord } from "../types/ekstrakurikuler.type";

export const adminEkstrakurikulerApi = createAdminResource<ExtracurricularRecord, ExtracurricularPayload>("extracurriculars");
