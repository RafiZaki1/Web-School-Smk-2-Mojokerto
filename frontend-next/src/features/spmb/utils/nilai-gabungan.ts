// Jalur prestasi akademik: nilai gabungan = (60% × rata-rata rapor) + (40% × nilai TKA)
const BOBOT_RAPOR = 0.6;
const BOBOT_TKA = 0.4;

/** "84,5" atau "84.5" → 84.5; kosong atau di luar 0–100 → null */
export function bacaNilai(teks: string): number | null {
  const bersih = teks.trim().replace(",", ".");
  if (!bersih) return null;
  const angka = Number(bersih);
  return Number.isFinite(angka) && angka >= 0 && angka <= 100 ? angka : null;
}

/** Selalu dua angka di belakang koma, sama dengan penulisan di tabel nilai */
export const formatNilai = (angka: number): string => angka.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const hitungGabungan = (rapor: number, tka: number): number => rapor * BOBOT_RAPOR + tka * BOBOT_TKA;

export type PosisiNilai = "jarang" | "tinggi" | "dominan" | "bawah";

/** Kelompok sebaran yang sama dengan tabel distribusi rentang nilai */
export function posisiNilai(gabungan: number): PosisiNilai {
  if (gabungan > 90) return "jarang";
  if (gabungan > 80) return "tinggi";
  if (gabungan >= 70) return "dominan";
  return "bawah";
}
