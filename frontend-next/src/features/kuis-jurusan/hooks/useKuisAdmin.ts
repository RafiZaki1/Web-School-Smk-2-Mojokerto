"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateAdminResource, useAdminRecord } from "@/features/admin";
import { adminKuisApi } from "../api/adminKuis.api";
import { toAdminKuis, type AdminKuis } from "../services/kuis.service";
import type { QuizReviewPayload } from "../types/kuis.type";

export const KUIS_RESOURCE = "major-quiz-submissions";

// Pemuat daftar dan penghapus untuk AdminListPage log kuis (fungsi stabil di luar komponen).
export const loadKuisAdmin = async (): Promise<AdminKuis[]> => (await adminKuisApi.list()).map(toAdminKuis);
export const removeKuisAdmin = (row: AdminKuis) => adminKuisApi.remove(row.id);

// Detail log kuis untuk halaman tinjau.
export const useKuisRecord = (id: string) => useAdminRecord(KUIS_RESOURCE, id, adminKuisApi.get);

// Simpan tinjauan admin. Error ditampilkan oleh form, daftar dan ringkasan admin ikut diperbarui.
export function useReviewKuis(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuizReviewPayload) => adminKuisApi.review(id, payload),
    meta: { skipGlobalError: true },
    onSuccess: () => invalidateAdminResource(queryClient, KUIS_RESOURCE),
  });
}
