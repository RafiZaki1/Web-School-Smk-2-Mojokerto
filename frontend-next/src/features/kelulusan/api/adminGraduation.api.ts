import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope, Paginated } from "@/shared/types/api.type";
import type {
  Graduate,
  GraduateFilters,
  GraduatePayload,
  GraduationSettingPayload,
  GraduationSettingResponse,
  ImportSummary,
  YearSummary,
} from "../types/kelulusan.type";

const TU = "/api/v1/admin/tu";

export const getGraduationSettingsApi = async (): Promise<GraduationSettingResponse> =>
  (await http.get<ApiEnvelope<GraduationSettingResponse>>(`${TU}/graduation-settings`)).data.data;

export const updateGraduationSettingsApi = async (payload: GraduationSettingPayload): Promise<GraduationSettingResponse> =>
  (await http.patch<ApiEnvelope<GraduationSettingResponse>>(`${TU}/graduation-settings`, payload)).data.data;

export const getGraduatesApi = async (filters: GraduateFilters): Promise<Paginated<Graduate>> =>
  (
    await http.get<ApiEnvelope<Paginated<Graduate>>>(`${TU}/graduates`, {
      params: {
        year: filters.year || undefined,
        class: filters.class || undefined,
        status: filters.status || undefined,
        administration: filters.administration || undefined,
        search: filters.search || undefined,
        archived: filters.archived ? 1 : undefined,
        page: filters.page,
        per_page: 50,
      },
    })
  ).data.data;

export const createGraduateApi = async (payload: GraduatePayload): Promise<Graduate> =>
  (await http.post<ApiEnvelope<Graduate>>(`${TU}/graduates`, payload)).data.data;

export const updateGraduateApi = async (id: number, payload: GraduatePayload): Promise<Graduate> =>
  (await http.patch<ApiEnvelope<Graduate>>(`${TU}/graduates/${id}`, payload)).data.data;

export const deleteGraduateApi = async (id: number): Promise<void> => {
  await http.delete(`${TU}/graduates/${id}`);
};

export const importGraduatesApi = async (file: File): Promise<ImportSummary> => {
  const form = new FormData();
  form.append("file", file);
  return (await http.post<ApiEnvelope<ImportSummary>>(`${TU}/graduates/import`, form)).data.data;
};

export const getGraduateYearsApi = async (): Promise<YearSummary[]> => (await http.get<ApiEnvelope<YearSummary[]>>(`${TU}/graduates/years`)).data.data;

export const archiveGraduateYearApi = async (year: number): Promise<{ affected: number }> =>
  (await http.post<ApiEnvelope<{ affected: number }>>(`${TU}/graduates/archive`, { year })).data.data;

export const deleteGraduateYearApi = async (year: number): Promise<{ affected: number }> =>
  (await http.delete<ApiEnvelope<{ affected: number }>>(`${TU}/graduates/years`, { data: { year } })).data.data;
