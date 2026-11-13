"use client";

import { useMutation, useQueryClient, type QueryClient, type QueryKey } from "@tanstack/react-query";
import type { Paginated } from "@/shared/types/api.type";

/** Kunci mutasi auto-save per tabel; dipakai indikator "Tersimpan" untuk membaca status simpan. */
export const autoSaveKey = (scope: string) => ["autosave", scope] as const;

type RowCache<T> = T[] | Paginated<T> | undefined;

/**
 * Ganti satu baris di semua cache daftar yang memuatnya (daftar biasa maupun berhalaman),
 * agar sel yang baru disimpan langsung menampilkan nilai dari server tanpa menunggu polling.
 */
export function patchRowInCaches<T extends { id: number }>(queryClient: QueryClient, listKey: QueryKey, row: T): void {
  queryClient.setQueriesData<RowCache<T>>({ queryKey: listKey }, (cache) => {
    if (!cache) return cache;
    if (Array.isArray(cache)) return cache.map((item) => (item.id === row.id ? row : item));
    return { ...cache, data: cache.data.map((item) => (item.id === row.id ? row : item)) };
  });
}

/**
 * Mutasi auto-save satu baris. Setelah berhasil, baris di cache diganti dengan data server lalu
 * daftar ditandai stale agar ringkasan ikut segar. Error tetap lewat handler global (toast).
 */
export function useAutoSaveRow<T extends { id: number }, TPayload>(scope: string, listKey: QueryKey, save: (id: number, payload: TPayload) => Promise<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: autoSaveKey(scope),
    mutationFn: ({ id, payload }: { id: number; payload: TPayload }) => save(id, payload),
    onSuccess: (row) => {
      patchRowInCaches(queryClient, listKey, row);
      void queryClient.invalidateQueries({ queryKey: listKey, refetchType: "none" });
    },
  });
}
