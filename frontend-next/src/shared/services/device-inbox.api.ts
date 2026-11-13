import { http } from "@/shared/lib/http/client";
import { DEVICE_TOKEN_HEADER } from "@/shared/lib/device/device-token";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { DeviceInbox } from "@/shared/types/device-inbox.type";

const deviceHeaders = (token: string) => ({ [DEVICE_TOKEN_HEADER]: token });

// Isi lonceng: notifikasi dan status pengajuan milik perangkat ini saja.
export const getDeviceInboxApi = async (token: string): Promise<DeviceInbox> =>
  (await http.get<ApiEnvelope<DeviceInbox>>("/api/v1/public/device-notifications", { headers: deviceHeaders(token) })).data.data;

export const markDeviceInboxReadApi = async (token: string): Promise<void> => {
  await http.post("/api/v1/public/device-notifications/read", null, { headers: deviceHeaders(token) });
};

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export const getPushPublicKeyApi = async (): Promise<string | null> =>
  (await http.get<ApiEnvelope<{ public_key: string | null }>>("/api/v1/public/push/key")).data.data.public_key;

export const savePushSubscriptionApi = async (token: string, payload: PushSubscriptionPayload): Promise<void> => {
  await http.post("/api/v1/public/push/subscriptions", payload, { headers: deviceHeaders(token) });
};

export const deletePushSubscriptionApi = async (token: string, endpoint: string): Promise<void> => {
  await http.delete("/api/v1/public/push/subscriptions", { headers: deviceHeaders(token), data: { endpoint } });
};
