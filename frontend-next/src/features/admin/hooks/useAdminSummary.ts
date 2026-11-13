"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth.store";
import { ROLES } from "@/shared/types/user.type";
import { getDashboardApi } from "../api/getDashboard.api";
import { adminKeys } from "../constants/query-keys";

const SUMMARY_STALE_TIME_MS = 2 * 60_000;

// Ringkasan dashboard dipakai bersama oleh sidebar (badge) dan halaman dashboard.
// Endpoint ini khusus admin utama, jadi akun TU tidak memanggilnya (bisa 403).
export function useAdminSummary() {
  const hasToken = useAuthStore((state) => Boolean(state.token));
  const isAdmin = useAuthStore((state) => state.user?.role === ROLES.admin);

  return useQuery({
    queryKey: adminKeys.summary(),
    queryFn: getDashboardApi,
    enabled: hasToken && isAdmin,
    staleTime: SUMMARY_STALE_TIME_MS,
  });
}
