/** Halaman panel Bank Mini yang bisa dibuka dari Panel Admin (TujuanPanelEnum di backend). */
export type BankMiniTujuan = "monitoring" | "pembayaran" | "laporan" | "tagihan" | "wali-kelas" | "layanan";

export interface BankMiniAksesResponse {
  url: string;
}
