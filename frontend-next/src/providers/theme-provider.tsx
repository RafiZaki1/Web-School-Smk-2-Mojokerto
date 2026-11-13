"use client";

import { useCallback, useLayoutEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ThemeContext } from "@/shared/lib/theme/theme-context";
import {
  COLOR_THEME_COOKIE,
  THEME_COOKIE,
  applyTheme,
  isColorTheme,
  isThemePreference,
  resolveColorTheme,
  resolveTheme,
  type ColorTheme,
  type ThemePreference,
} from "@/shared/lib/theme/theme";

const ONE_YEAR = 60 * 60 * 24 * 365;

// Halaman di-cache sama untuk semua pengunjung, jadi pilihan tema dibaca dari cookie di browser,
// bukan di server. Warnanya sendiri sudah dipasang skrip inline di <head> sebelum layar dilukis.
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

const writeCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  listeners.forEach((listener) => listener());
};

const readPreference = (): ThemePreference => {
  const value = readCookie(THEME_COOKIE);
  return isThemePreference(value) ? value : "system";
};

const readColorTheme = (): ColorTheme => {
  const value = readCookie(COLOR_THEME_COOKIE);
  return isColorTheme(value) ? value : "ocean";
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const);
  const colorTheme = useSyncExternalStore(subscribe, readColorTheme, () => "ocean" as const);
  // Saat hidrasi nilai di atas masih nilai bawaan server; jangan menimpa tema dari skrip <head>
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

  // Efek ini menyusulkan perubahan pilihan, pindah halaman ke/dari admin, dan remount Strict Mode saat dev.
  useLayoutEffect(() => {
    if (!hydrated) return undefined;
    const resolvedMode = resolveTheme(preference, pathname);
    const resolvedColor = resolveColorTheme(colorTheme, pathname);
    applyTheme(resolvedMode, resolvedColor);
    if (preference !== "system") return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(resolveTheme("system", pathname), resolvedColor);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [hydrated, preference, colorTheme, pathname]);

  const setPreference = useCallback((next: ThemePreference) => writeCookie(THEME_COOKIE, next), []);
  const setColorTheme = useCallback((next: ColorTheme) => writeCookie(COLOR_THEME_COOKIE, next), []);

  const value = useMemo(
    () => ({ preference, setPreference, colorTheme, setColorTheme }),
    [preference, setPreference, colorTheme, setColorTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
