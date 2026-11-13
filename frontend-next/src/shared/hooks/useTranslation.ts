"use client";

import { useContext } from "react";
import { I18nContext } from "@/shared/lib/i18n/i18n-context";

/** `t("Teks Indonesia")` untuk Client Component. Server Component memakai getTranslator(). */
export const useTranslation = () => useContext(I18nContext);
