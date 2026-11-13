"use client";

import { useAdminRecord, useAdminSave } from "@/features/admin";
import { adminJurusanApi } from "../api/adminJurusan.api";
import { toJurusan } from "../services/jurusan.service";
import type { Jurusan } from "../types/jurusan.type";

export const JURUSAN_RESOURCE = "majors";

// Pemuat daftar dan penghapus untuk AdminListPage jurusan (fungsi stabil di luar komponen).
export const loadJurusanAdmin = async (): Promise<Jurusan[]> => (await adminJurusanApi.list()).map(toJurusan);
export const removeJurusanAdmin = (row: Jurusan) => adminJurusanApi.remove(row.id);

// Detail jurusan untuk form ubah.
export const useJurusanRecord = (id?: string) => useAdminRecord(JURUSAN_RESOURCE, id, adminJurusanApi.get);

// Simpan jurusan: buat baru bila belum ada id, ubah bila ada.
export const useSaveJurusan = (id?: string) => useAdminSave(JURUSAN_RESOURCE, id, adminJurusanApi);
