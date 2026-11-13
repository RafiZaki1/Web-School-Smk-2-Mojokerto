"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAutoSaveRow } from "@/shared/hooks/useAutoSave";
import { toast } from "@/shared/lib/toast";
import {
  createGuestVisitApi,
  deleteGuestMessageApi,
  deleteGuestVisitApi,
  getGuestMessagesApi,
  getGuestVisitsApi,
  updateGuestMessageApi,
  updateGuestVisitApi,
} from "../api/guestBookAdmin.api";
import { MESSAGE_SCOPE, VISIT_SCOPE, bukuTamuKeys } from "../constants/buku-tamu-keys";
import type { GuestMessageFilters, GuestMessageUpdateRequest, GuestVisitFilters, GuestVisitRequest, GuestVisitUpdateRequest } from "../types/buku-tamu.type";

// Dipakai bersama beberapa perangkat TU: data ditarik ulang tiap 5 detik.
const SYNC_MS = 5_000;

export const useGuestMessages = (filters: GuestMessageFilters) =>
  useQuery({ queryKey: bukuTamuKeys.messageList(filters), queryFn: () => getGuestMessagesApi(filters), placeholderData: keepPreviousData, refetchInterval: SYNC_MS });

export const useAutoSaveGuestMessage = () =>
  useAutoSaveRow(MESSAGE_SCOPE, bukuTamuKeys.messages(), (id: number, payload: GuestMessageUpdateRequest) => updateGuestMessageApi(id, payload));

export const useGuestVisits = (filters: GuestVisitFilters) =>
  useQuery({ queryKey: bukuTamuKeys.visitList(filters), queryFn: () => getGuestVisitsApi(filters), placeholderData: keepPreviousData, refetchInterval: SYNC_MS });

export const useAutoSaveGuestVisit = () => useAutoSaveRow(VISIT_SCOPE, bukuTamuKeys.visits(), (id: number, payload: GuestVisitUpdateRequest) => updateGuestVisitApi(id, payload));

function useRefreshGuestBook() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: bukuTamuKeys.messages() });
    void queryClient.invalidateQueries({ queryKey: bukuTamuKeys.visits() });
    void queryClient.invalidateQueries({ queryKey: ["tu", "dashboard"] });
  };
}

export function useCreateGuestVisit() {
  const refresh = useRefreshGuestBook();
  return useMutation({
    mutationFn: (payload: GuestVisitRequest) => createGuestVisitApi(payload),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      toast.success("Jadwal kunjungan dicatat.");
      refresh();
    },
  });
}

export function useDeleteGuestEntry(kind: "message" | "visit") {
  const refresh = useRefreshGuestBook();
  return useMutation({
    mutationFn: (id: number) => (kind === "message" ? deleteGuestMessageApi(id) : deleteGuestVisitApi(id)),
    onSuccess: () => {
      toast.success(kind === "message" ? "Pesan dihapus." : "Jadwal kunjungan dihapus.");
      refresh();
    },
  });
}
