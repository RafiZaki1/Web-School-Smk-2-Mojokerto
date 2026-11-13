import { http } from "@/shared/lib/http/client";
import { DEVICE_TOKEN_HEADER } from "@/shared/lib/device/device-token";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { AlumniServiceSubmitRequest, AlumniServiceSubmitResponse } from "../types/layanan-alumni.type";

// Pengajuan diikat ke token perangkat, jadi lonceng hanya memuat pengajuan dari HP ini.
export const submitAlumniServiceApi = async (deviceToken: string, payload: AlumniServiceSubmitRequest): Promise<AlumniServiceSubmitResponse> =>
  (await http.post<ApiEnvelope<AlumniServiceSubmitResponse>>("/api/v1/public/alumni-services", payload, { headers: { [DEVICE_TOKEN_HEADER]: deviceToken } })).data.data;
