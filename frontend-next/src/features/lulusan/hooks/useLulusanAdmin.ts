"use client";

import { useAdminRecord, useAdminSave } from "@/features/admin";
import { adminLulusanApi } from "../api/adminLulusan.api";
import { toLulusan } from "../services/lulusan.service";
import type { Lulusan } from "../types/lulusan.type";

export const LULUSAN_RESOURCE = "alumni";

// Pemuat daftar dan penghapus untuk AdminListPage lulusan (fungsi stabil di luar komponen).
export const loadLulusanAdmin = async (): Promise<Lulusan[]> => (await adminLulusanApi.list()).map(toLulusan);
export const removeLulusanAdmin = (row: Lulusan) => adminLulusanApi.remove(row.id ?? "");

// Detail lulusan untuk form ubah.
export const useLulusanRecord = (id?: string) => useAdminRecord(LULUSAN_RESOURCE, id, adminLulusanApi.get);

// Simpan lulusan: buat baru bila belum ada id, ubah bila ada.
export const useSaveLulusan = (id?: string) => useAdminSave(LULUSAN_RESOURCE, id, adminLulusanApi);
