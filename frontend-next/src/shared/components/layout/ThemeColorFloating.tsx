"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Palette, RotateCcw, X } from "lucide-react";
import { COLOR_THEME_OPTIONS, THEME_OPTIONS } from "@/shared/components/layout/PreferenceControls";
import { useHideOnScroll } from "@/shared/hooks/useHideOnScroll";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { isLightOnlyPath } from "@/shared/lib/theme/theme";

const HIDDEN_PATHS = ["/kuis-jurusan", "/sada"];

/**
 * Widget mengambang untuk pengaturan Mode Tampilan (Terang/Gelap/Sistem) dan
 * Palet Warna Tema (Theme Color). Dipisahkan dari Navbar atas agar navigasi
 * tetap bersih dan proporsional.
 */
export default function ThemeColorFloating() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { preference, setPreference, colorTheme, setColorTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const scrollHidden = useHideOnScroll();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!pathname || isLightOnlyPath(pathname) || HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  const currentColor = COLOR_THEME_OPTIONS.find((item) => item.value === colorTheme) ?? COLOR_THEME_OPTIONS[0];
  const CurrentModeIcon = THEME_OPTIONS.find((item) => item.value === preference)?.icon ?? THEME_OPTIONS[2].icon;
  const isCustom = preference !== "system" || colorTheme !== "ocean";

  return (
    <div
      ref={rootRef}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-[80] transition-[translate,opacity] duration-300 sm:bottom-6 sm:left-6 ${
        scrollHidden && !open ? "pointer-events-none translate-y-[calc(100%+1.5rem)] opacity-0" : ""
      }`}
    >
      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-label={t("Pengaturan Tema & Warna")}
          className="mb-3 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-line bg-card p-5 shadow-[0_24px_48px_rgba(12,74,104,0.2)] transition-all"
        >
          <div className="flex items-center justify-between border-b border-line pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-tint text-primary">
                <Palette size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading text-sm font-bold text-heading">{t("Tema & Warna")}</h2>
                <p className="text-[11px] text-muted">{t("Sesuaikan tampilan nyamanmu")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isCustom && (
                <button
                  type="button"
                  onClick={() => {
                    setPreference("system");
                    setColorTheme("ocean");
                  }}
                  title={t("Reset ke bawaan")}
                  aria-label={t("Reset ke bawaan")}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
                >
                  <RotateCcw size={15} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("Tutup pengaturan tema")}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold text-muted">{t("Mode Layar")}</p>
            <div
              role="radiogroup"
              aria-label={t("Tema tampilan")}
              className="mt-2 grid grid-cols-3 gap-1.5 rounded-2xl bg-surface p-1.5"
            >
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
                const active = preference === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPreference(value)}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition ${
                      active
                        ? "bg-card text-primary shadow-xs"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <Icon size={14} aria-hidden="true" />
                    <span>{t(label === "Ikuti sistem" ? "Sistem" : label)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold text-muted">{t("Warna Aksen (Theme Color)")}</p>
            <div role="radiogroup" aria-label={t("Warna tema")} className="mt-2 grid grid-cols-2 gap-2">
              {COLOR_THEME_OPTIONS.map((item) => {
                const active = colorTheme === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setColorTheme(item.value)}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-2xl border p-2.5 text-left transition ${
                      active
                        ? "border-primary bg-tint/60 shadow-2xs"
                        : "border-line bg-surface-alt/60 hover:border-primary/40 hover:bg-tint/25"
                    }`}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-xs"
                      style={{
                        background: `linear-gradient(135deg, ${item.primaryHex} 0%, ${item.accentHex} 100%)`,
                      }}
                    >
                      {active && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-heading">{t(item.label)}</span>
                      <span className="block truncate text-[10px] text-muted">{t(item.desc)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t("Pengaturan Tema & Warna")}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex h-12 w-12 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-line bg-card text-heading shadow-[0_8px_24px_rgba(12,74,104,0.16)] transition-all hover:-translate-y-0.5 hover:border-primary sm:w-auto sm:justify-start sm:pr-4 sm:pl-2.5"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs transition-transform group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${currentColor.primaryHex} 0%, ${currentColor.accentHex} 100%)`,
          }}
        >
          <Palette size={16} aria-hidden="true" />
        </span>
        {/* Mobile cukup ikon palet agar tidak menutupi konten */}
        <span className="hidden items-center gap-1.5 text-xs font-bold tracking-wide sm:flex">
          <CurrentModeIcon size={14} className="text-primary" aria-hidden="true" />
          <span>{t("Tema")}</span>
        </span>
      </button>
    </div>
  );
}

