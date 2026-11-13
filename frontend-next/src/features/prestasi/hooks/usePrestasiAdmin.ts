"use client";

import { useAdminRecord, useAdminSave } from "@/features/admin";
import { adminPrestasiApi } from "../api/adminPrestasi.api";
import { toPrestasiCard } from "../services/prestasi.service";
import type { PrestasiCardItem } from "../types/prestasi.type";

export const PRESTASI_RESOURCE = "achievements";

// Pemuat daftar dan penghapus untuk AdminListPage prestasi (fungsi stabil di luar komponen).
export const loadPrestasiAdmin = async (): Promise<PrestasiCardItem[]> => (await adminPrestasiApi.list()).map(toPrestasiCard);
export const removePrestasiAdmin = (row: PrestasiCardItem) => adminPrestasiApi.remove(row.slug);

// Detail prestasi untuk form ubah.
export const usePrestasiRecord = (id?: string) => useAdminRecord(PRESTASI_RESOURCE, id, adminPrestasiApi.get);

// Simpan prestasi: buat baru bila belum ada id, ubah bila ada.
export const useSavePrestasi = (id?: string) => useAdminSave(PRESTASI_RESOURCE, id, adminPrestasiApi);
