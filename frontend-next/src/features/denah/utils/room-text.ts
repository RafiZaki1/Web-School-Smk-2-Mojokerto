import type { Translator } from "@/shared/lib/i18n/translate";

/**
 * Teks ruangan dari API. Nama kelas ("Kelas XI RPL 1") cukup diterjemahkan awalannya,
 * nama ruang & gedung lain dicocokkan ke kamus.
 */
export function roomText(t: Translator, text: string | null | undefined): string {
  const kelas = text?.match(/^Kelas (.+)$/);
  return kelas ? t("Kelas {nama}", { nama: kelas[1] }) : t(text);
}
