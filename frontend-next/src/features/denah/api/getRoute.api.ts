import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { MapRouteRecord } from "../types/denah.type";

// Rute antar dua ruangan. Asal dan tujuan wajib diisi. Lewat route Next yang di-cache
// (src/app/api/denah/route), karena rute bawaan denah diminta oleh setiap pengunjung beranda.
export const getRouteApi = async (from: string, to: string): Promise<MapRouteRecord> => {
  if (!from || !to) throw new Error("Origin dan destination wajib ditentukan.");
  const { data } = await http.get<ApiEnvelope<MapRouteRecord>>(`/api/denah/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, { baseURL: "" });
  return data.data;
};
