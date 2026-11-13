"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAutoSaveRow } from "@/shared/hooks/useAutoSave";
import { toast } from "@/shared/lib/toast";
import { deleteAlumniServiceApi, getAlumniServiceQueueApi, updateAlumniServiceApi } from "../api/alumniServiceAdmin.api";
import { ALUMNI_QUEUE_SCOPE, layananAlumniKeys } from "../constants/layanan-alumni-keys";
import type { AlumniServiceFilters, AlumniServiceUpdateRequest } from "../types/layanan-alumni.type";

// Antrean dipakai bersama beberapa perangkat TU; data ditarik ulang tiap 5 detik.
const QUEUE_SYNC_MS = 5_000;

export const useAlumniServiceQueue = (filters: AlumniServiceFilters) =>
  useQuery({
    queryKey: layananAlumniKeys.queueList(filters),
    queryFn: () => getAlumniServiceQueueApi(filters),
    placeholderData: keepPreviousData,
    refetchInterval: QUEUE_SYNC_MS,
  });

export const useAutoSaveAlumniService = () =>
  useAutoSaveRow(ALUMNI_QUEUE_SCOPE, layananAlumniKeys.queue(), (id: number, payload: AlumniServiceUpdateRequest) => updateAlumniServiceApi(id, payload));

export function useDeleteAlumniService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAlumniServiceApi,
    onSuccess: () => {
      toast.success("Pengajuan dihapus.");
      void queryClient.invalidateQueries({ queryKey: layananAlumniKeys.queue() });
      void queryClient.invalidateQueries({ queryKey: ["tu", "dashboard"] });
    },
  });
}
