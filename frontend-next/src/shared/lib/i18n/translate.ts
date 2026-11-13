import type { Locale } from "./config";
import { enMessages } from "./messages/en";

export type TranslateVars = Record<string, string | number>;

/**
 * Teks sumber (Bahasa Indonesia) dipakai langsung sebagai kunci kamus.
 * Teks yang belum ada di kamus tetap tampil dalam Bahasa Indonesia.
 * Variabel ditulis `{nama}` di teks sumber maupun terjemahannya.
 * Nilai kosong (field opsional dari API) menghasilkan string kosong.
 */
export type Translator = (text: string | null | undefined, vars?: TranslateVars) => string;

const interpolate = (text: string, vars?: TranslateVars) =>
  vars ? text.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match)) : text;

export function createTranslator(locale: Locale): Translator {
  if (locale === "id") return (text, vars) => interpolate(text ?? "", vars);
  return (text, vars) => (text ? interpolate(enMessages[text] ?? text, vars) : "");
}
