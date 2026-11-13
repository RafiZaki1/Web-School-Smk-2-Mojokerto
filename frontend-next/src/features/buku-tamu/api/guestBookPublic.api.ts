import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { GuestMessageRequest, GuestVisitRequest } from "../types/buku-tamu.type";

const BASE = "/api/v1/public/guest-book";

// Respons hanya berisi pesan konfirmasi dari server (meta.message).
export const sendGuestMessageApi = async (payload: GuestMessageRequest): Promise<string> =>
  (await http.post<ApiEnvelope<null>>(`${BASE}/messages`, payload)).data.meta?.message ?? "Pesan terkirim.";

export const requestGuestVisitApi = async (payload: GuestVisitRequest): Promise<string> =>
  (await http.post<ApiEnvelope<null>>(`${BASE}/visits`, payload)).data.meta?.message ?? "Permohonan kunjungan tercatat.";
