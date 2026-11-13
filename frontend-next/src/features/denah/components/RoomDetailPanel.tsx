"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Box, CircleDot, Clock3, MapPin, MousePointerClick, type LucideIcon } from "lucide-react";
import { ROOM_FALLBACK_IMAGE, categoryMeta } from "../constants/meta";
import type { Room } from "../types/denah.type";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { roomText } from "../utils/room-text";

function MetaRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[130px_1fr] items-start gap-3 py-1.5 text-sm">
      <dt className="flex items-center gap-2 text-[var(--color-muted)]">
        <Icon size={14} className="shrink-0 text-[var(--color-muted)]" aria-hidden="true" />
        {t(label)}
      </dt>
      <dd className="font-medium text-ink">{t(value)}</dd>
    </div>
  );
}

interface RoomDetailPanelProps {
  room: Room | null;
  isOrigin: boolean;
  onSetOrigin: (room: Room) => void;
}

/** Panel kanan "Tujuan Anda": detail ruangan terpilih (sesuai Figma), bisa dijadikan titik awal rute. */
export default function RoomDetailPanel({ room, isOrigin, onSetOrigin }: RoomDetailPanelProps) {
  const { t } = useTranslation();
  const [showFacilities, setShowFacilities] = useState(false);
  const [imageFailedFor, setImageFailedFor] = useState<string | null>(null);

  if (!room) {
    return (
      <aside className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl bg-card p-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-tint)] text-blue">
          <MousePointerClick size={22} aria-hidden="true" />
        </span>
        <p className="mt-3 font-semibold text-ink">{t("Pilih ruangan")}</p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{t("Ketuk ruangan pada denah atau gunakan pencarian.")}</p>
      </aside>
    );
  }

  const facilities = room.facilities ?? [];
  const image = imageFailedFor === room.slug || !room.image ? ROOM_FALLBACK_IMAGE : room.image;

  return (
    <aside className="flex flex-col rounded-2xl bg-card p-5 sm:p-6" aria-live="polite">
      <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold text-white ${isOrigin ? "bg-[#16a34a]" : "bg-[var(--color-navy-deep)]"}`}>
        {t(isOrigin ? "Titik Awal Anda" : "Tujuan Anda")}
      </span>
      <h3 className="mt-3 text-2xl leading-tight font-bold text-ink">{roomText(t, room.name)}</h3>
      <p className="mt-1 text-base font-semibold text-blue">{t(room.building_name)}</p>

      <span className="relative mt-4 block aspect-[16/9] w-full overflow-hidden rounded-xl bg-tint">
        <Image
          key={room.slug}
          src={image}
          alt={roomText(t, room.name)}
          fill
          sizes="(min-width: 1024px) 340px, 100vw"
          onError={() => setImageFailedFor(room.slug)}
          className="object-cover"
        />
      </span>

      {room.description ? <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{t(room.description)}</p> : null}

      <dl className="mt-4 rounded-xl bg-[var(--color-surface-alt)] px-4 py-2.5">
        <MetaRow icon={MapPin} label="Lokasi" value={room.building_name || "-"} />
        <MetaRow icon={Box} label="Fungsi" value={room.category?.name || categoryMeta(room.category?.slug).label} />
        <MetaRow icon={Clock3} label="Jam Operasional" value={room.open_hours || "07.00 - 16.00 WIB"} />
      </dl>

      {!isOrigin ? (
        <button
          type="button"
          onClick={() => onSetOrigin(room)}
          className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] bg-card text-sm font-semibold text-navy-ink transition-colors hover:bg-[var(--color-tint)]"
        >
          <CircleDot size={16} className="text-[#16a34a]" aria-hidden="true" />
          {t("Jadikan Titik Awal")}
        </button>
      ) : null}

      {showFacilities && facilities.length > 0 ? (
        <ul className="mt-4 space-y-1.5 text-sm text-ink">
          {facilities.map((facility) => (
            <li key={facility.id} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-line)] px-3 py-2">
              <span>{t(facility.name)}</span>
              {facility.quantity ? <span className="shrink-0 text-xs text-[var(--color-muted)]">{t("{jumlah} unit", { jumlah: facility.quantity })}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}

      {facilities.length > 0 ? (
        <button
          type="button"
          onClick={() => setShowFacilities((value) => !value)}
          aria-expanded={showFacilities}
          className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-navy)] text-sm font-semibold text-white transition-colors hover:bg-[var(--color-navy)]"
        >
          {t(showFacilities ? "Sembunyikan Fasilitas" : "Lihat Fasilitas Lengkap")}
          <ArrowRight size={16} className={`transition-transform ${showFacilities ? "-rotate-90" : ""}`} aria-hidden="true" />
        </button>
      ) : null}
    </aside>
  );
}
