"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import { useAutoSaveRow } from "@/shared/hooks/useAutoSave";
import {
  archiveGraduateYearApi,
  createGraduateApi,
  deleteGraduateApi,
  deleteGraduateYearApi,
  getGraduatesApi,
  getGraduateYearsApi,
  getGraduationSettingsApi,
  importGraduatesApi,
  updateGraduateApi,
  updateGraduationSettingsApi,
} from "../api/adminGraduation.api";
import { kelulusanKeys } from "../constants/kelulusan-keys";
import type { GraduateFilters, GraduatePayload, GraduationSettingPayload } from "../types/kelulusan.type";

// Satu akun TU dipakai di banyak perangkat: tabel menarik data baru tiap 5 detik selama tab aktif.
export const TU_SYNC_MS = 5_000;
export const GRADUATE_SCOPE = "graduates";
export const SETTINGS_SCOPE = "graduation-settings";

export const useGraduationSettings = () => useQuery({ queryKey: kelulusanKeys.settings(), queryFn: getGraduationSettingsApi, refetchInterval: TU_SYNC_MS });

export function useSaveGraduationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["autosave", SETTINGS_SCOPE],
    mutationFn: (payload: GraduationSettingPayload) => updateGraduationSettingsApi(payload),
    meta: { skipGlobalError: true },
    onSuccess: (data) => {
      queryClient.setQueryData(kelulusanKeys.settings(), data);
      void queryClient.invalidateQueries({ queryKey: kelulusanKeys.dashboard() });
    },
  });
}

export const useGraduates = (filters: GraduateFilters) =>
  useQuery({
    queryKey: kelulusanKeys.graduateList(filters),
    queryFn: () => getGraduatesApi(filters),
    placeholderData: keepPreviousData,
    refetchInterval: TU_SYNC_MS,
  });

export const useGraduateYears = () => useQuery({ queryKey: kelulusanKeys.years(), queryFn: getGraduateYearsApi, refetchInterval: TU_SYNC_MS * 6 });

export const useAutoSaveGraduate = () => useAutoSaveRow(GRADUATE_SCOPE, kelulusanKeys.graduates(), (id: number, payload: GraduatePayload) => updateGraduateApi(id, payload));

const useInvalidateGraduates = () => {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: kelulusanKeys.graduates() });
    void queryClient.invalidateQueries({ queryKey: kelulusanKeys.dashboard() });
  };
};

// Form tambah/ubah menampilkan error 422 per kolom sendiri.
export function useSaveGraduate(id: number | null) {
  const invalidate = useInvalidateGraduates();
  return useMutation({
    mutationFn: (payload: GraduatePayload) => (id ? updateGraduateApi(id, payload) : createGraduateApi(payload)),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      toast.success(id ? "Data siswa diperbarui." : "Siswa ditambahkan.");
      invalidate();
    },
  });
}

export function useDeleteGraduate() {
  const invalidate = useInvalidateGraduates();
  return useMutation({
    mutationFn: deleteGraduateApi,
    onSuccess: () => {
      toast.success("Data siswa dihapus.");
      invalidate();
    },
  });
}

export function useImportGraduates() {
  const invalidate = useInvalidateGraduates();
  return useMutation({ mutationFn: importGraduatesApi, meta: { skipGlobalError: true }, onSuccess: invalidate });
}

export function useGraduateYearAction() {
  const invalidate = useInvalidateGraduates();
  return useMutation({
    mutationFn: ({ action, year }: { action: "archive" | "delete"; year: number }) => (action === "archive" ? archiveGraduateYearApi(year) : deleteGraduateYearApi(year)),
    onSuccess: ({ affected }, { action, year }) => {
      toast.success(action === "archive" ? `${affected} siswa angkatan ${year} diarsipkan.` : `${affected} data angkatan ${year} dihapus.`);
      invalidate();
    },
  });
}
