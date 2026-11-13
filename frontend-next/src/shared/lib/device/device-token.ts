// Token perangkat pengaju layanan alumni. UUID acak disimpan di localStorage agar lonceng
// hanya menampilkan pengajuan milik HP/browser ini. Kunci sama dengan dokumentasi seeder backend.
const STORAGE_KEY = "tu_device_token";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const DEVICE_TOKEN_HEADER = "X-Device-Token";

/** Token yang sudah ada, atau null bila perangkat ini belum pernah mengajukan layanan. */
export function readDeviceToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value && UUID.test(value) ? value.toLowerCase() : null;
  } catch {
    return null;
  }
}

/** Ambil token, atau buat baru saat perangkat pertama kali mengajukan layanan. */
export function ensureDeviceToken(): string {
  const existing = readDeviceToken();
  if (existing) return existing;

  const token = crypto.randomUUID();
  try {
    window.localStorage.setItem(STORAGE_KEY, token);
    window.dispatchEvent(new Event("tu-device-token"));
  } catch {
    // Penyimpanan diblokir (mode privat): token hanya hidup selama tab ini terbuka
  }
  return token;
}

/** Berlangganan perubahan token (perangkat baru saja mengajukan layanan di tab ini atau tab lain). */
export function subscribeDeviceToken(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => event.key === STORAGE_KEY && onChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener("tu-device-token", onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("tu-device-token", onChange);
  };
}
