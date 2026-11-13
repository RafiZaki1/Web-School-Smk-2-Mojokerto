import type { QuizResult } from "../types/kuis.type";

/**
 * Riwayat kode hasil kuis di perangkat ini (localStorage), supaya siswa bisa
 * membuka lagi hasilnya tanpa mencatat kode. Data utamanya tetap di server.
 */
const STORAGE_KEY = "smkn2-kuis-jurusan-riwayat";
const MAX_ITEMS = 5;

export interface RiwayatItem {
  code: string;
  name: string | null;
  major: string | undefined;
  date: string;
}

export function readRiwayat(): RiwayatItem[] {
  try {
    const items: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(items) ? (items as RiwayatItem[]) : [];
  } catch {
    return [];
  }
}

export function saveRiwayat(result: QuizResult): void {
  try {
    const entry: RiwayatItem = { code: result.code, name: result.name, major: result.primary?.major.code, date: result.createdLabel };
    const items = [entry, ...readRiwayat().filter((item) => item.code !== entry.code)].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // penyimpanan diblokir; hasil tetap bisa dibuka lewat kode
  }
}
