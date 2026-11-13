import type { ApiEnvelope } from "@/shared/types/api.type";
import { toFormData } from "@/shared/utils/form-data";
import { http } from "./client";

const ADMIN_BASE = "/api/v1/admin";

export interface AdminResource<TRecord, TPayload extends object> {
  list: () => Promise<TRecord[]>;
  get: (id: number | string) => Promise<TRecord>;
  create: (payload: TPayload) => Promise<TRecord>;
  update: (id: number | string, payload: TPayload) => Promise<TRecord>;
  remove: (id: number | string) => Promise<void>;
}

// CRUD standar untuk satu modul konten admin. Update memakai POST multipart agar
// unggahan berkas tetap terbaca Laravel saat mengubah data.
export function createAdminResource<TRecord, TPayload extends object>(path: string): AdminResource<TRecord, TPayload> {
  const url = (id?: number | string) => (id === undefined ? `${ADMIN_BASE}/${path}` : `${ADMIN_BASE}/${path}/${encodeURIComponent(String(id))}`);

  return {
    list: async () => (await http.get<ApiEnvelope<TRecord[]>>(url())).data.data,
    get: async (id) => (await http.get<ApiEnvelope<TRecord>>(url(id))).data.data,
    create: async (payload) => (await http.post<ApiEnvelope<TRecord>>(url(), toFormData(payload))).data.data,
    update: async (id, payload) => (await http.post<ApiEnvelope<TRecord>>(url(id), toFormData(payload))).data.data,
    remove: async (id) => {
      await http.delete(url(id));
    },
  };
}
