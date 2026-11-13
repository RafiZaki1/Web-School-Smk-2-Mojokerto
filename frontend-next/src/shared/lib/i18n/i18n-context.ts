"use client";

import { createContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { createTranslator, type Translator } from "./translate";

export interface I18nContextValue {
  locale: Locale;
  t: Translator;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  t: createTranslator(DEFAULT_LOCALE),
});
