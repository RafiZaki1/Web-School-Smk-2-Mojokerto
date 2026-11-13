"use client";

import { useAdminRecord, useAdminSave } from "@/features/admin";
import { adminEkstrakurikulerApi } from "../api/adminEkstrakurikuler.api";
import { toEkstra } from "../services/ekstrakurikuler.service";
import type { Ekstrakurikuler } from "../types/ekstrakurikuler.type";

export const EKSTRAKURIKULER_RESOURCE = "extracurriculars";

// Pemuat daftar dan penghapus untuk AdminListPage ekstrakurikuler (fungsi stabil di luar komponen).
export const loadEkstrakurikulerAdmin = async (): Promise<Ekstrakurikuler[]> => (await adminEkstrakurikulerApi.list()).map(toEkstra);
export const removeEkstrakurikulerAdmin = (row: Ekstrakurikuler) => adminEkstrakurikulerApi.remove(row.id);

// Detail ekstrakurikuler untuk form ubah.
export const useEkstrakurikulerRecord = (id?: string) => useAdminRecord(EKSTRAKURIKULER_RESOURCE, id, adminEkstrakurikulerApi.get);

// Simpan ekstrakurikuler: buat baru bila belum ada id, ubah bila ada.
export const useSaveEkstrakurikuler = (id?: string) => useAdminSave(EKSTRAKURIKULER_RESOURCE, id, adminEkstrakurikulerApi);
