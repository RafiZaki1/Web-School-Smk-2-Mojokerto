import { http } from "@/shared/lib/http/client";
import type { ApiEnvelope } from "@/shared/types/api.type";
import type { Room, RoomCategory } from "../types/denah.type";

// Pemanggilan denah dari browser: galat jaringan dilempar agar UI bisa menampilkan pesan.
// Daftar ruangan, kategori, dan detail ruangan diambil lewat route Next (src/app/api/denah) yang
// di-cache, bukan langsung ke Laravel, karena diminta oleh hampir setiap pengunjung beranda.
export const getRoomsApi = async (): Promise<Room[]> => {
  const { data } = await http.get<ApiEnvelope<Room[]>>("/api/denah/rooms", { baseURL: "" });
  return data.data ?? [];
};

export const getRoomDetailApi = async (slugOrId: string): Promise<Room | null> => {
  const { data } = await http.get<ApiEnvelope<Room | null>>(`/api/denah/rooms/${encodeURIComponent(slugOrId)}`, { baseURL: "" });
  return data.data ?? null;
};

export const searchRoomsApi = async (query: string): Promise<Room[]> => {
  const term = query.trim();
  if (!term) return [];
  const { data } = await http.get<ApiEnvelope<Room[]>>(`/api/v1/public/rooms/search?q=${encodeURIComponent(term)}`);
  return data.data ?? [];
};

export const getCategoriesApi = async (): Promise<RoomCategory[]> => {
  const { data } = await http.get<ApiEnvelope<RoomCategory[]>>("/api/denah/categories", { baseURL: "" });
  return data.data ?? [];
};
