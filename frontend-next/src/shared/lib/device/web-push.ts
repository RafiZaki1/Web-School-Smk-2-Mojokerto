import { deletePushSubscriptionApi, getPushPublicKeyApi, savePushSubscriptionApi } from "@/shared/services/device-inbox.api";

// Web Push: notifikasi muncul di bar atas layar HP walau situs sedang tidak dibuka.
// Butuh HTTPS (atau localhost), service worker /sw.js, dan izin notifikasi dari pengguna.
export type PushState = "unsupported" | "denied" | "off" | "on";

const SERVICE_WORKER_URL = "/sw.js";

export const isPushSupported = (): boolean =>
  typeof window !== "undefined" && window.isSecureContext && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

const urlBase64ToBytes = (base64: string): Uint8Array<ArrayBuffer> => {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
};

const registration = () => navigator.serviceWorker.register(SERVICE_WORKER_URL, { scope: "/" });

export async function getPushState(): Promise<PushState> {
  if (!isPushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  const existing = await navigator.serviceWorker.getRegistration("/");
  const subscription = await existing?.pushManager.getSubscription();
  return subscription ? "on" : "off";
}

/** Minta izin, daftarkan langganan ke browser, lalu simpan di server untuk token perangkat ini. */
export async function enablePush(deviceToken: string): Promise<PushState> {
  if (!isPushSupported()) return "unsupported";

  const publicKey = await getPushPublicKeyApi();
  if (!publicKey) throw new Error("Notifikasi HP belum tersedia di server sekolah.");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission === "denied" ? "denied" : "off";

  const worker = await registration();
  await navigator.serviceWorker.ready;
  const subscription =
    (await worker.pushManager.getSubscription()) ??
    (await worker.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToBytes(publicKey) }));

  const json = subscription.toJSON();
  await savePushSubscriptionApi(deviceToken, {
    endpoint: subscription.endpoint,
    keys: { p256dh: json.keys?.p256dh ?? "", auth: json.keys?.auth ?? "" },
  });
  return "on";
}

export async function disablePush(deviceToken: string): Promise<PushState> {
  const existing = await navigator.serviceWorker.getRegistration("/");
  const subscription = await existing?.pushManager.getSubscription();
  if (subscription) {
    await deletePushSubscriptionApi(deviceToken, subscription.endpoint);
    await subscription.unsubscribe();
  }
  return "off";
}
