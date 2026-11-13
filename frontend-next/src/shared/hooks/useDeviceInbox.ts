"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeviceInboxApi, markDeviceInboxReadApi } from "@/shared/services/device-inbox.api";
import { useDeviceToken } from "./useDeviceToken";

const INBOX_POLL_MS = 30_000;

export const deviceInboxKeys = {
  inbox: (token: string | null) => ["device-inbox", token ?? "none"] as const,
};

/**
 * Lonceng navbar: diperbarui tiap 30 detik selama tab terbuka. Hanya aktif bila perangkat ini
 * pernah mengajukan layanan, jadi pengunjung biasa tidak memanggil API sama sekali.
 */
export function useDeviceInbox() {
  const token = useDeviceToken();

  return useQuery({
    queryKey: deviceInboxKeys.inbox(token),
    queryFn: () => getDeviceInboxApi(token as string),
    enabled: Boolean(token),
    refetchInterval: INBOX_POLL_MS,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
    meta: { silent: true },
  });
}

export function useMarkDeviceInboxRead() {
  const token = useDeviceToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markDeviceInboxReadApi(token as string),
    meta: { skipGlobalError: true },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: deviceInboxKeys.inbox(token) }),
  });
}
