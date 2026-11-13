"use client";

import { useAdminRecord, useAdminSave } from "@/features/admin";
import { adminLokerApi } from "../api/adminBkk.api";
import { toLowongan } from "../services/bkk.service";
import type { Lowongan } from "../types/bkk.type";

export const LOKER_RESOURCE = "jobs";

// Pemuat daftar dan penghapus untuk AdminListPage lowongan kerja (fungsi stabil di luar komponen).
export const loadLokerAdmin = async (): Promise<Lowongan[]> => (await adminLokerApi.list()).map(toLowongan);
export const removeLokerAdmin = (row: Lowongan) => adminLokerApi.remove(row.slug);

// Detail lowongan kerja untuk form ubah.
export const useLokerRecord = (id?: string) => useAdminRecord(LOKER_RESOURCE, id, adminLokerApi.get);

// Simpan lowongan kerja: buat baru bila belum ada id, ubah bila ada.
export const useSaveLoker = (id?: string) => useAdminSave(LOKER_RESOURCE, id, adminLokerApi);
