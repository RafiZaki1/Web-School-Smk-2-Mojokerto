import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { PortalLink } from "@/shared/types/device-inbox.type";
import type { PortalLinkUpdateRequest, TuDashboardSummary } from "../types/tata-usaha.type";

const TU = "/api/v1/admin/tu";

export const getTuDashboardApi = async (): Promise<TuDashboardSummary> => (await http.get<ApiEnvelope<TuDashboardSummary>>(`${TU}/dashboard`)).data.data;

export const getPortalLinksAdminApi = async (): Promise<PortalLink[]> => (await http.get<ApiEnvelope<PortalLink[]>>(`${TU}/portal-links`)).data.data;

export const updatePortalLinkApi = async (id: number, payload: PortalLinkUpdateRequest): Promise<PortalLink> =>
  (await http.patch<ApiEnvelope<PortalLink>>(`${TU}/portal-links/${id}`, payload)).data.data;
