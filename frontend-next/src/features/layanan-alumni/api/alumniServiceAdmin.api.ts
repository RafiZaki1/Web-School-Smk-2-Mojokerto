import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope, Paginated } from "@/shared/types/api.type";
import type { AlumniServiceFilters, AlumniServiceRequest, AlumniServiceSummary, AlumniServiceUpdateRequest } from "../types/layanan-alumni.type";

const BASE = "/api/v1/admin/tu/alumni-services";

export type AlumniServiceQueueResponse = Paginated<AlumniServiceRequest> & { summary: AlumniServiceSummary };

export const getAlumniServiceQueueApi = async (filters: AlumniServiceFilters): Promise<AlumniServiceQueueResponse> =>
  (
    await http.get<ApiEnvelope<AlumniServiceQueueResponse>>(BASE, {
      params: {
        class: filters.class || undefined,
        status: filters.status || undefined,
        type: filters.type || undefined,
        search: filters.search || undefined,
        page: filters.page,
        per_page: 50,
      },
    })
  ).data.data;

export const updateAlumniServiceApi = async (id: number, payload: AlumniServiceUpdateRequest): Promise<AlumniServiceRequest> =>
  (await http.patch<ApiEnvelope<AlumniServiceRequest>>(`${BASE}/${id}`, payload)).data.data;

export const deleteAlumniServiceApi = async (id: number): Promise<void> => {
  await http.delete(`${BASE}/${id}`);
};
