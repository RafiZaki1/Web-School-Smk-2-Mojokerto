"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth.store";
import { getProfileApi } from "../api/getProfile.api";
import { logoutApi } from "../api/logout.api";
import { authKeys } from "../constants/auth-keys";

const PROFILE_STALE_TIME_MS = 5 * 60_000;

// Profil admin yang sedang login. Menggunakan data sesi dari store sebagai placeholder
// agar halaman admin langsung tampil instan tanpa menunggu request jaringan.
export function useAdminSession() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const storedUser = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const profile = useQuery({
    queryKey: authKeys.profile(),
    queryFn: getProfileApi,
    enabled: Boolean(token),
    staleTime: PROFILE_STALE_TIME_MS,
    placeholderData: storedUser ?? undefined,
  });

  useEffect(() => {
    if (token && profile.data) {
      setSession(token, profile.data);
    }
  }, [token, profile.data, setSession]);

  const logout = useMutation({
    mutationFn: logoutApi,
    meta: { skipGlobalError: true },
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.replace("/login");
    },
  });

  const user = profile.data ?? storedUser ?? null;

  return {
    user,
    hasToken: Boolean(token),
    ready: Boolean(token) && (Boolean(user) || profile.isSuccess),
    logout: () => logout.mutate(),
  };
}
