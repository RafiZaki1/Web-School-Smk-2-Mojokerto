"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { checkGraduationApi, getGraduationStatusApi } from "../api/publicGraduation.api";
import { kelulusanKeys } from "../constants/kelulusan-keys";
import type { GraduationCheckRequest } from "../types/kelulusan.type";

// Status rilis diambil ulang tiap menit agar perubahan mode dari TU terlihat tanpa muat ulang halaman.
export const useGraduationStatus = () =>
  useQuery({
    queryKey: kelulusanKeys.status(),
    queryFn: getGraduationStatusApi,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

// Error 403/404/422 ditampilkan oleh form, jadi handler global dilewati.
export const useCheckGraduation = () =>
  useMutation({
    mutationFn: (payload: GraduationCheckRequest) => checkGraduationApi(payload),
    meta: { skipGlobalError: true },
  });
