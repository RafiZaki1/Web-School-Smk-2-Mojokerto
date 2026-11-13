"use client";

import { ArrowRight, Cross, Ellipsis, Laptop, Building2, Store, Trees, Church, type LucideIcon } from "lucide-react";
import { roomKey } from "../constants/meta";
import type { Room } from "../types/denah.type";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { roomText } from "../utils/room-text";

const ICONS: Record<string, LucideIcon> = {
  "lab-tefa": Laptop,
  kantin: Store,
  "lapangan-olahraga": Trees,
  musholla: Church,
  uks: Cross,
};

interface QuickLocationsProps {
  rooms: Room[];
  selectedKey: string;
  onSelect: (room: Room) => void;
  onShowAll: () => void;
}

/** Deret lokasi cepat di bawah peta + tombol "Lainnya" (reset kategori ke semua). */
export default function QuickLocations({ rooms, selectedKey, onSelect, onShowAll }: QuickLocationsProps) {
  const { t } = useTranslation();
  const item = "flex min-h-[60px] shrink-0 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors";

  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-7">
      {rooms.map((room) => {
        const Icon = ICONS[room.slug] ?? Building2;
        const isActive = roomKey(room) === selectedKey;
        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelect(room)}
            aria-pressed={isActive}
            className={`${item} w-[170px] sm:w-auto ${
              isActive
                ? "border-[var(--color-tint-strong)] bg-[var(--color-tint)] text-navy-deep-ink"
                : "border-transparent bg-card text-ink hover:border-[var(--color-line)]"
            }`}
          >
            <Icon size={18} className="shrink-0 text-navy-ink" aria-hidden="true" />
            <span className="line-clamp-2">{roomText(t, room.name)}</span>
          </button>
        );
      })}
      <button type="button" onClick={onShowAll} className={`${item} w-[140px] border-transparent bg-card text-ink hover:border-[var(--color-line)] sm:w-auto`}>
        <Ellipsis size={18} className="shrink-0 text-navy-ink" aria-hidden="true" />
        {t("Lainnya")}
        <ArrowRight size={15} className="ml-auto" aria-hidden="true" />
      </button>
    </div>
  );
}
