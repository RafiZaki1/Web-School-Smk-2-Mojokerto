"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ensureDeviceToken } from "@/shared/lib/device/device-token";
import { disablePush, enablePush, getPushState, type PushState } from "@/shared/lib/device/web-push";
import { submitAlumniServiceApi } from "../api/alumniServicePublic.api";
import { layananAlumniKeys } from "../constants/layanan-alumni-keys";
import type { AlumniServiceSubmitRequest } from "../types/layanan-alumni.type";

/**
 * Kirim pengajuan. Token perangkat dibuat saat pengajuan pertama dan disimpan di localStorage,
 * lalu lonceng navbar dimuat ulang agar tiket baru langsung terlihat.
 * Error 422 ditampilkan per kolom oleh form.
 */
export function useSubmitAlumniService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AlumniServiceSubmitRequest) => submitAlumniServiceApi(ensureDeviceToken(), payload),
    meta: { skipGlobalError: true },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["device-inbox"] }),
  });
}

/** Status izin notifikasi HP di browser ini (bukan data server, tapi tetap asinkron). */
export const usePushState = () =>
  useQuery({
    queryKey: layananAlumniKeys.pushState(),
    queryFn: getPushState,
    staleTime: Infinity,
    meta: { silent: true },
  });

export function useTogglePush() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (enable: boolean): Promise<PushState> => {
      const token = ensureDeviceToken();
      return enable ? enablePush(token) : disablePush(token);
    },
    onSuccess: (state) => queryClient.setQueryData(layananAlumniKeys.pushState(), state),
  });
}
