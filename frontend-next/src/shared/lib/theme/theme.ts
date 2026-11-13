export const THEME_PREFERENCES = ["light", "dark", "system"] as const;
export const COLOR_THEMES = ["ocean", "emerald", "royal", "amber"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = "light" | "dark";
export type ColorTheme = (typeof COLOR_THEMES)[number];

export const THEME_COOKIE = "theme";
export const COLOR_THEME_COOKIE = "theme_color";

/** Panel admin dan login tetap memakai tema terang default; kustomisasi tema hanya berlaku untuk halaman publik. */
export const LIGHT_ONLY_PATHS = ["/admin", "/login"];

export const isThemePreference = (value: unknown): value is ThemePreference =>
  THEME_PREFERENCES.includes(value as ThemePreference);

export const isColorTheme = (value: unknown): value is ColorTheme =>
  COLOR_THEMES.includes(value as ColorTheme);

export const isLightOnlyPath = (pathname: string) =>
  LIGHT_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

/**
 * Dijalankan inline di <head> sebelum halaman dilukis supaya tema gelap & warna tema tidak berkedip.
 * Logikanya sama dengan resolveTheme + applyColorTheme + isLightOnlyPath di bawah.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement,p=location.pathname,m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/),c=document.cookie.match(/(?:^|; )${COLOR_THEME_COOKIE}=([^;]*)/),t=m?decodeURIComponent(m[1]):"system",ct=c?decodeURIComponent(c[1]):"ocean";if(t!=="light"&&t!=="dark")t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(${JSON.stringify(COLOR_THEMES)}.indexOf(ct)===-1)ct="ocean";if(${JSON.stringify(LIGHT_ONLY_PATHS)}.some(function(x){return p===x||p.indexOf(x+"/")===0})){t="light";ct="ocean";}d.setAttribute("data-theme",t);d.setAttribute("data-color-theme",ct);d.style.colorScheme=t}catch(e){}})()`;

export function resolveTheme(preference: ThemePreference, pathname: string): ResolvedTheme {
  if (isLightOnlyPath(pathname)) return "light";
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveColorTheme(colorTheme: ColorTheme, pathname: string): ColorTheme {
  if (isLightOnlyPath(pathname)) return "ocean";
  return colorTheme;
}

export function applyTheme(theme: ResolvedTheme, colorTheme: ColorTheme = "ocean") {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-color-theme", colorTheme);
  root.style.colorScheme = theme;
}
