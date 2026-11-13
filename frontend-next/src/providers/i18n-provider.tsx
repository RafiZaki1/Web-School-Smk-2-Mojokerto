"use client";

import { useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isIndonesianOnlyPath, type Locale } from "@/shared/lib/i18n/config";
import { I18nContext } from "@/shared/lib/i18n/i18n-context";
import { createTranslator } from "@/shared/lib/i18n/translate";

/** Bahasa dibaca dari cookie di root layout lalu diteruskan ke Client Component lewat context. */
export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const pathname = usePathname();
  const effective = isIndonesianOnlyPath(pathname) ? DEFAULT_LOCALE : locale;
  const value = useMemo(() => ({ locale: effective, t: createTranslator(effective) }), [effective]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
