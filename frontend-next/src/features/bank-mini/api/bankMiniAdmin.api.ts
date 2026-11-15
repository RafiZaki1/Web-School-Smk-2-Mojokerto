import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { BankMiniAksesResponse, BankMiniTujuan } from "../types/bank-mini.type";

/** Minta tautan masuk panel Bank Mini yang berlaku singkat untuk admin yang sedang login. */
export const createBankMiniAksesApi = async (tujuan: BankMiniTujuan): Promise<BankMiniAksesResponse> =>
  (await http.post<ApiEnvelope<BankMiniAksesResponse>>("/api/v1/admin/bank-mini/akses", { tujuan })).data.data;
