import { createAdminResource } from "@/shared/lib/http/admin-resource";
import type { MajorPayload, MajorRecord } from "../types/jurusan.type";

export const adminJurusanApi = createAdminResource<MajorRecord, MajorPayload>("majors");
