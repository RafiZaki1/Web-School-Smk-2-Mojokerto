export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8001";

export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  // FormData dibiarkan tanpa Content-Type agar browser mengisi boundary multipart
  const defaultHeaders = {
    Accept: "application/json",
    ...(options.body && typeof options.body === "string" ? { "Content-Type": "application/json" } : {}),
  };

  // Batas waktu agar UI tidak menunggu selamanya saat API macet (GET 15 detik, kirim data 60 detik)
  const { timeout, ...fetchOptions } = options;
  const isRead = !options.method || options.method === "GET";
  const timeoutMs = timeout ?? (isRead ? 15000 : 60000);
  const signal = options.signal ?? AbortSignal.timeout(timeoutMs);

  let response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      signal,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // For server components / fetch caching
      next: options.next || undefined,
      cache: options.cache || (options.method && options.method !== "GET" ? "no-store" : undefined),
    });
  } catch (cause) {
    const timedOut = cause?.name === "TimeoutError" || cause?.name === "AbortError";
    const error = new Error(timedOut ? "Server tidak merespons. Coba muat ulang halaman." : "Tidak dapat terhubung ke server.");
    error.status = 0;
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // not json
    }
    const message = errorData?.message || `HTTP error! status: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = errorData;
    error.errors = errorData?.errors || null;
    throw error;
  }

  return response.json();
}

/**
 * Ambil `data` dari endpoint publik untuk Server Component (ISR 60 detik).
 * Mengembalikan null bila API tidak bisa dihubungi, supaya halaman bisa
 * memakai data cadangan.
 */
export async function fetchPublic(endpoint, { revalidate = 60 } = {}) {
  try {
    // Lebih singkat dari default: kalau API lambat, halaman langsung pakai data cadangan
    const json = await apiClient(`/api/v1/public${endpoint}`, { next: { revalidate }, timeout: 8000 });
    return json.data ?? null;
  } catch (error) {
    if (error.status !== 404) console.error(`[api] ${endpoint}:`, error.message);
    return error.status === 404 ? undefined : null;
  }
}

export function getAssetUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `${API_BASE}/storage/${path.replace(/^storage\//, "")}`;
}
