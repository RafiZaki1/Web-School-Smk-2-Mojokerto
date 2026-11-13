"use client";

import { useAdminRecord, useAdminSave } from "@/features/admin";
import { adminBeritaApi } from "../api/adminBerita.api";
import { toBerita } from "../services/berita.service";
import type { Berita } from "../types/berita.type";

export const BERITA_RESOURCE = "articles";

// Pemuat daftar dan penghapus untuk AdminListPage berita (fungsi stabil di luar komponen).
export const loadBeritaAdmin = async (): Promise<Berita[]> => (await adminBeritaApi.list()).map(toBerita);
export const removeBeritaAdmin = (row: Berita) => adminBeritaApi.remove(row.slug);

// Detail berita untuk form ubah.
export const useBeritaRecord = (id?: string) => useAdminRecord(BERITA_RESOURCE, id, adminBeritaApi.get);

// Simpan berita: buat baru bila belum ada id, ubah bila ada.
export const useSaveBerita = (id?: string) => useAdminSave(BERITA_RESOURCE, id, adminBeritaApi);
