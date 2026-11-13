"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

const btn =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-ink transition-colors hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-40";

interface MapZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

/** Kontrol zoom di pojok kanan bawah peta. */
export default function MapZoomControls({ scale, onZoomIn, onZoomOut, onReset }: MapZoomControlsProps) {
  const { t } = useTranslation();
  return (
    <div className="absolute right-3 bottom-3 z-30 flex flex-col rounded-xl border border-[var(--color-line)] bg-card p-1 shadow-[0_4px_12px_rgba(19,35,44,0.08)] sm:bottom-3">
      <button type="button" onClick={onZoomIn} disabled={scale >= 2.5} aria-label={t("Perbesar peta")} className={btn}>
        <Plus size={18} aria-hidden="true" />
      </button>
      <button type="button" onClick={onZoomOut} disabled={scale <= 1} aria-label={t("Perkecil peta")} className={btn}>
        <Minus size={18} aria-hidden="true" />
      </button>
      <button type="button" onClick={onReset} disabled={scale === 1} aria-label={t("Kembalikan ukuran peta")} className={btn}>
        <RotateCcw size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
