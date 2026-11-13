import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type {
  GuestMessage,
  GuestMessageFilters,
  GuestMessageUpdateRequest,
  GuestVisit,
  GuestVisitFilters,
  GuestVisitRequest,
  GuestVisitUpdateRequest,
} from "../types/buku-tamu.type";

const TU = "/api/v1/admin/tu";

export const getGuestMessagesApi = async (filters: GuestMessageFilters): Promise<GuestMessage[]> =>
  (await http.get<ApiEnvelope<GuestMessage[]>>(`${TU}/guest-messages`, { params: { status: filters.status || undefined, search: filters.search || undefined } })).data.data;

export const updateGuestMessageApi = async (id: number, payload: GuestMessageUpdateRequest): Promise<GuestMessage> =>
  (await http.patch<ApiEnvelope<GuestMessage>>(`${TU}/guest-messages/${id}`, payload)).data.data;

export const deleteGuestMessageApi = async (id: number): Promise<void> => {
  await http.delete(`${TU}/guest-messages/${id}`);
};

export const getGuestVisitsApi = async (filters: GuestVisitFilters): Promise<GuestVisit[]> =>
  (await http.get<ApiEnvelope<GuestVisit[]>>(`${TU}/guest-visits`, { params: { status: filters.status || undefined, when: filters.when || undefined } })).data.data;

export const createGuestVisitApi = async (payload: GuestVisitRequest): Promise<GuestVisit> => (await http.post<ApiEnvelope<GuestVisit>>(`${TU}/guest-visits`, payload)).data.data;

export const updateGuestVisitApi = async (id: number, payload: GuestVisitUpdateRequest): Promise<GuestVisit> =>
  (await http.patch<ApiEnvelope<GuestVisit>>(`${TU}/guest-visits/${id}`, payload)).data.data;

export const deleteGuestVisitApi = async (id: number): Promise<void> => {
  await http.delete(`${TU}/guest-visits/${id}`);
};
