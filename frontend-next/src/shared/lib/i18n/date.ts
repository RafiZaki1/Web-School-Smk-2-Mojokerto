import type { Locale } from "./config";

// Nama bulan & hari dari label tanggal API ("19 Juli 2026", "30 Sep 2026", "Senin, 3 Mar 2026").
const EN_DATE_WORDS: Record<string, string> = {
  Januari: "January",
  Februari: "February",
  Maret: "March",
  Mei: "May",
  Juni: "June",
  Juli: "July",
  Agustus: "August",
  Oktober: "October",
  Desember: "December",
  Agu: "Aug",
  Agt: "Aug",
  Okt: "Oct",
  Des: "Dec",
  Senin: "Monday",
  Selasa: "Tuesday",
  Rabu: "Wednesday",
  Kamis: "Thursday",
  Jumat: "Friday",
  "Jum'at": "Friday",
  Sabtu: "Saturday",
  Minggu: "Sunday",
};

const DATE_WORD_PATTERN = new RegExp(`(?<![\\p{L}'])(${Object.keys(EN_DATE_WORDS).join("|")})(?![\\p{L}'])`, "gu");

/** Label tanggal Bahasa Indonesia dari API/data statis ditampilkan sesuai bahasa pilihan. */
export function localizeDate(label: string, locale: Locale): string {
  if (locale === "id" || !label) return label;
  return label.replace(DATE_WORD_PATTERN, (word) => EN_DATE_WORDS[word] ?? word);
}
