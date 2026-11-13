import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { PortalLink } from "@/shared/types/device-inbox.type";

// Pintasan navbar ke E-Learning (domain luar), diatur TU.
export const getPortalLinksApi = async (): Promise<PortalLink[]> =>
  (await http.get<ApiEnvelope<PortalLink[]>>("/api/v1/public/portal-links")).data.data;
