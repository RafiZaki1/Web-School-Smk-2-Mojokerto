"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import type { AdminResource } from "@/shared/lib/http/admin-resource";
import { adminKeys } from "../constants/query-keys";

// Setelah data modul berubah, daftar modul dan ringkasan dashboard ikut diperbarui.
export function invalidateAdminResource(queryClient: QueryClient, resource: string) {
  void queryClient.invalidateQueries({ queryKey: adminKeys.resource(resource) });
  void queryClient.invalidateQueries({ queryKey: adminKeys.summary() });
}

export function useAdminList<TRow>(resource: string, load: () => Promise<TRow[]>) {
  return useQuery({
    queryKey: adminKeys.list(resource),
    queryFn: load,
  });
}

export function useAdminDelete<TRow>(resource: string, remove: (row: TRow) => Promise<void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success("Data berhasil dihapus.");
      invalidateAdminResource(queryClient, resource);
    },
  });
}

export function useAdminRecord<TRecord>(resource: string, id: string | undefined, fetchRecord: (id: string) => Promise<TRecord>) {
  return useQuery({
    queryKey: adminKeys.detail(resource, id ?? ""),
    queryFn: () => fetchRecord(id as string),
    enabled: Boolean(id),
  });
}

// Simpan record: buat jika belum ada id, ubah jika ada. Error validasi ditampilkan oleh form.
export function useAdminSave<TRecord, TPayload extends object>(resource: string, id: string | undefined, api: AdminResource<TRecord, TPayload>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TPayload) => (id ? api.update(id, payload) : api.create(payload)),
    meta: { skipGlobalError: true },
    onSuccess: () => invalidateAdminResource(queryClient, resource),
  });
}
