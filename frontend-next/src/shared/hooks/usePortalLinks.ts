"use client";

import { useQuery } from "@tanstack/react-query";
import { getPortalLinksApi } from "@/shared/services/getPortalLinks.api";

// Pintasan portal jarang berubah; satu kali muat per sesi cukup.
export function usePortalLinks() {
  return useQuery({
    queryKey: ["portal-links"],
    queryFn: getPortalLinksApi,
    staleTime: 30 * 60_000,
    meta: { silent: true },
  });
}
