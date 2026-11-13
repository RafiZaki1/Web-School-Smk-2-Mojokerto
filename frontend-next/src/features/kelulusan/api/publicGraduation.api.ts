import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { GraduationCheckRequest, GraduationPublicStatus, GraduationResult } from "../types/kelulusan.type";

const PUBLIC = "/api/v1/public/graduation";

export const getGraduationStatusApi = async (): Promise<GraduationPublicStatus> =>
  (await http.get<ApiEnvelope<GraduationPublicStatus>>(`${PUBLIC}/status`)).data.data;

export const checkGraduationApi = async (payload: GraduationCheckRequest): Promise<GraduationResult> =>
  (await http.post<ApiEnvelope<GraduationResult>>(`${PUBLIC}/check`, payload)).data.data;
