"use client";

import { useSyncExternalStore } from "react";
import { readDeviceToken, subscribeDeviceToken } from "@/shared/lib/device/device-token";

/** Token perangkat dari localStorage; null saat render server atau bila belum pernah mengajukan layanan. */
export function useDeviceToken(): string | null {
  return useSyncExternalStore(subscribeDeviceToken, readDeviceToken, () => null);
}
