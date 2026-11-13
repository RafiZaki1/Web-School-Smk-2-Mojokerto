import { locale as localeParam } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { createTranslator, type Translator } from "./translate";

/**
 * Bahasa halaman yang sedang dirender, dari segmen `[locale]`. Proxy mengisi segmen ini dari
 * cookie bahasa (URL di browser tetap tanpa awalan), jadi halaman bisa di-cache per bahasa
 * alih-alih dirender ulang di setiap kunjungan. Dipakai di Server Component dan generateMetadata.
 */
export async function getLocale(): Promise<Locale> {
  const value = await localeParam();
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getTranslator(): Promise<Translator> {
  return createTranslator(await getLocale());
}
