"use client";

import { useQuery } from "@tanstack/react-query";
import { denahKeys } from "../constants/query-keys";
import type { Room } from "../types/denah.type";

const MAX_RESULTS = 8;

// Saran pencarian ruangan untuk kata kunci (sudah di-debounce). Kosong bila kata kunci kosong.
export function useRoomSearch(term: string, search: (query: string) => Promise<Room[]>): Room[] {
  const results = useQuery({
    queryKey: denahKeys.search(term),
    queryFn: async () => (await search(term)).slice(0, MAX_RESULTS),
    enabled: term.length > 0,
  });
  return term.length > 0 ? (results.data ?? []) : [];
}
