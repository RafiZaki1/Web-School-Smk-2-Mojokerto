"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAutoSaveRow } from "@/shared/hooks/useAutoSave";
import { getPortalLinksAdminApi, getTuDashboardApi, updatePortalLinkApi } from "../api/tataUsahaAdmin.api";
import type { PortalLinkUpdateRequest } from "../types/tata-usaha.type";

// Query key Tata Usaha; sama dengan kunci yang di-invalidate fitur lain setelah data berubah.
export const tataUsahaKeys = {
  dashboard: () => ["tu", "dashboard"] as const,
  portalLinks: () => ["tu", "portal-links"] as const,
};

export const PORTAL_SCOPE = "portal-links";

export const useTuDashboard = () => useQuery({ queryKey: tataUsahaKeys.dashboard(), queryFn: getTuDashboardApi, refetchInterval: 15_000 });

export const usePortalLinksAdmin = () => useQuery({ queryKey: tataUsahaKeys.portalLinks(), queryFn: getPortalLinksAdminApi, refetchInterval: 15_000 });

/** Simpan otomatis label, URL, atau status tampil; navbar publik ikut dimuat ulang. */
export function useAutoSavePortalLink() {
  const queryClient = useQueryClient();
  const mutation = useAutoSaveRow(PORTAL_SCOPE, tataUsahaKeys.portalLinks(), (id: number, payload: PortalLinkUpdateRequest) => updatePortalLinkApi(id, payload));
  return {
    ...mutation,
    save: (id: number, payload: PortalLinkUpdateRequest) => mutation.mutateAsync({ id, payload }).then(() => queryClient.invalidateQueries({ queryKey: ["portal-links"] })),
  };
}
