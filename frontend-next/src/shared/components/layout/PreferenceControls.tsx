"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Languages, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { LOCALE_COOKIE, type Locale } from "@/shared/lib/i18n/config";
import type { ColorTheme, ThemePreference } from "@/shared/lib/theme/theme";

const ONE_YEAR = 60 * 60 * 24 * 365;

export const THEME_OPTIONS: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Ikuti sistem", icon: Monitor },
];

export const COLOR_THEME_OPTIONS: {
  value: ColorTheme;
  label: string;
  desc: string;
  primaryHex: string;
  accentHex: string;
}[] = [
  {
    value: "ocean",
    label: "Biru SKANEDA",
    desc: "Biru cerulean emblem (bawaan)",
    primaryHex: "#0a6a97",
    accentHex: "#1a8fc4",
  },
  {
    value: "emerald",
    label: "Hijau Daun",
    desc: "Hijau daun pada emblem",
    primaryHex: "#456312",
    accentHex: "#9cc030",
  },
  {
    value: "amber",
    label: "Kuning Roda Gigi",
    desc: "Kuning roda gigi pada emblem",
    primaryHex: "#735700",
    accentHex: "#f7d51d",
  },
];

const LOCALE_OPTIONS: { value: Locale; short: string; label: string }[] = [
  { value: "id", short: "ID", label: "Bahasa Indonesia" },
  { value: "en", short: "EN", label: "English" },
];

/** Simpan bahasa di cookie lalu render ulang Server Component dengan bahasa baru. */
function useChangeLocale() {
  const router = useRouter();
  const { locale } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
    startTransition(() => router.refresh());
  };

  return { locale, changeLocale, isPending };
}

function LanguageButton() {
  const { t } = useTranslation();
  const { locale, changeLocale, isPending } = useChangeLocale();
  const next = locale === "id" ? "en" : "id";
  const nextOption = LOCALE_OPTIONS.find((option) => option.value === next);

  return (
    <button
      type="button"
      className="site-header__pref-button site-header__pref-button--lang"
      aria-label={t("Ganti bahasa ke {bahasa}", { bahasa: nextOption?.label ?? next })}
      aria-busy={isPending}
      disabled={isPending}
      onClick={() => changeLocale(next)}
    >
      <Languages size={16} aria-hidden="true" />
      <span>{locale.toUpperCase()}</span>
    </button>
  );
}

/** Tombol bahasa di header desktop (Theme Color dipisahkan ke widget mengambang). */
export function HeaderPreferences() {
  return (
    <div className="site-header__prefs">
      <LanguageButton />
    </div>
  );
}

/** Pilihan tema, warna aksen, dan bahasa di drawer mobile. */
export function DrawerPreferences() {
  const { t } = useTranslation();
  const { preference, setPreference, colorTheme, setColorTheme } = useTheme();
  const { locale, changeLocale, isPending } = useChangeLocale();

  return (
    <div className="site-header__drawer-prefs">
      <div role="radiogroup" aria-label={t("Tema tampilan")} className="site-header__segment">
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={preference === value}
            onClick={() => setPreference(value)}
          >
            <Icon size={15} aria-hidden="true" />
            <span>{t(label === "Ikuti sistem" ? "Sistem" : label)}</span>
          </button>
        ))}
      </div>

      <div
        role="radiogroup"
        aria-label={t("Warna tema")}
        className="grid grid-cols-4 gap-2 rounded-xl bg-surface p-2"
      >
        {COLOR_THEME_OPTIONS.map((item) => {
          const active = colorTheme === item.value;
          return (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setColorTheme(item.value)}
              className={`flex flex-col items-center gap-1 rounded-lg px-1.5 py-2 text-[11px] font-semibold transition ${
                active ? "bg-card text-primary shadow-2xs" : "text-muted hover:text-ink"
              }`}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-white shadow-2xs"
                style={{
                  background: `linear-gradient(135deg, ${item.primaryHex} 0%, ${item.accentHex} 100%)`,
                }}
              >
                {active && <Check size={12} strokeWidth={3} aria-hidden="true" />}
              </span>
              <span className="truncate">{t(item.label.replace("Biru ", ""))}</span>
            </button>
          );
        })}
      </div>

      <div role="radiogroup" aria-label={t("Bahasa")} className="site-header__segment" aria-busy={isPending}>
        {LOCALE_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={locale === value}
            disabled={isPending}
            onClick={() => changeLocale(value)}
          >
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
