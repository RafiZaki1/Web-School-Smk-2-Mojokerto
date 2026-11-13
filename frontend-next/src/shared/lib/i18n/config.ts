export const LOCALES = ["id", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "id";

export const LOCALE_COOKIE = "locale";

/** Tag BCP 47 untuk Intl dan atribut lang/og:locale. */
export const LOCALE_TAGS: Record<Locale, { lang: string; intl: string; og: string }> = {
  id: { lang: "id", intl: "id-ID", og: "id_ID" },
  en: { lang: "en", intl: "en-US", og: "en_US" },
};

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale);

/** Panel admin dan login selalu berbahasa Indonesia; pilihan bahasa hanya untuk halaman publik. */
export const INDONESIAN_ONLY_PATHS = ["/admin", "/login"];

export const isIndonesianOnlyPath = (pathname: string) =>
  INDONESIAN_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

/**
 * Path tanpa awalan bahasa. Halaman yang dicapai lewat rewrite di proxy.ts membuat usePathname()
 * mengembalikan path hasil rewrite (mis. "/id/admin/tu/kelulusan"), bukan alamat di browser.
 */
export function stripLocalePrefix(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  return isLocale(first) ? `/${rest.join("/")}` : pathname;
}
