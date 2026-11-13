import axios, { isAxiosError, isCancel, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/shared/config/env";
import { useAuthStore } from "@/shared/stores/auth.store";
import type { ApiEnvelope, ApiErrorBody } from "@/shared/types/api.type";
import { ApiError } from "./api-error";

const READ_TIMEOUT_MS = 15_000;
const WRITE_TIMEOUT_MS = 60_000;
const PUBLIC_TIMEOUT_MS = 8_000;

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { Accept: "application/json" },
});

// Batas waktu: GET 15 detik, kirim data 60 detik, kecuali pemanggil menentukan sendiri.
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.timeout === undefined || config.timeout === 0) {
    const isRead = !config.method || config.method.toLowerCase() === "get";
    config.timeout = isRead ? READ_TIMEOUT_MS : WRITE_TIMEOUT_MS;
  }
  const token = useAuthStore.getState().token;
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);

// Ubah error axios menjadi ApiError. Pembatalan permintaan dibiarkan apa adanya.
export function toApiError(error: unknown): unknown {
  if (isCancel(error)) return error;
  if (!isAxiosError<ApiErrorBody>(error)) return error;

  if (!error.response) {
    const timedOut = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
    const message = timedOut ? "Server tidak merespons. Coba muat ulang halaman." : "Tidak dapat terhubung ke server.";
    return new ApiError(message, 0, null, { cause: error });
  }

  const { status, data } = error.response;
  const message = data?.meta?.message ?? `HTTP error! status: ${status}`;
  return new ApiError(message, status, status === 422 ? (data?.data ?? null) : null, { cause: error });
}

// Ambil `data` dari endpoint publik untuk Server Component (ISR). Hasil:
// - data: isi `data` respons
// - null: API tidak bisa dihubungi, pemanggil memakai data cadangan
// - undefined: 404, data memang tidak ada
export async function fetchPublic<T>(
  endpoint: string,
  { revalidate = 60, timeout = PUBLIC_TIMEOUT_MS }: { revalidate?: number; timeout?: number } = {},
): Promise<T | null | undefined> {
  try {
    const { data } = await http.get<ApiEnvelope<T>>(`/api/v1/public${endpoint}`, {
      // Di server, axios memakai fetch agar opsi cache `next.revalidate` tetap berlaku
      adapter: "fetch",
      fetchOptions: { next: { revalidate } },
      timeout,
    });
    return data.data ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    return null;
  }
}

export function getAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `${env.apiBaseUrl}/storage/${path.replace(/^storage\//, "")}`;
}
