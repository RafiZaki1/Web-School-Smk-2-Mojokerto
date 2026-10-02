"use client";

import { useState } from "react";
import { ArrowRight, Box, Clock3, MapPin, MousePointerClick } from "lucide-react";
import { ROOM_FALLBACK_IMAGE, categoryMeta } from "@/lib/denah/meta";

function MetaRow({ icon: Icon, label, value }) {
  return (
    <div className="grid grid-cols-[130px_1fr] items-start gap-3 py-1.5 text-sm">
      <dt className="flex items-center gap-2 text-[#475569]">
        <Icon size={14} className="shrink-0 text-[#94a3b8]" aria-hidden="true" />
        {label}
      </dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

/** Panel kanan "Tujuan Anda": detail ruangan terpilih (sesuai Figma). */
export default function RoomDetailPanel({ room }) {
  const [showFacilities, setShowFacilities] = useState(false);
  const [imageFailed, setImageFailed] = useState(null);

  if (!room) {
    return (
      <aside className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eff6ff] text-blue">
          <MousePointerClick size={22} aria-hidden="true" />
        </span>
        <p className="mt-3 font-semibold text-ink">Pilih ruangan</p>
        <p className="mt-1 text-sm text-[#64748b]">Ketuk ruangan pada denah atau gunakan pencarian.</p>
      </aside>
    );
  }

  const facilities = room.facilities ?? [];
  const image = imageFailed === room.slug || !room.image ? ROOM_FALLBACK_IMAGE : room.image;

  return (
    <aside className="flex flex-col rounded-2xl bg-white p-5 sm:p-6" aria-live="polite">
      <span className="w-fit rounded-full bg-[#0b2a5b] px-3 py-1 text-xs font-semibold text-white">Tujuan Anda</span>
      <h3 className="mt-3 text-2xl leading-tight font-bold text-ink">{room.name}</h3>
      <p className="mt-1 text-base font-semibold text-blue">{room.building_name}</p>

      <img
        key={room.slug}
        src={image}
        alt={room.name}
        onError={() => setImageFailed(room.slug)}
        className="mt-4 aspect-[16/9] w-full rounded-xl bg-[#eef4fb] object-cover"
      />

      {room.description ? <p className="mt-4 text-sm leading-relaxed text-[#475569]">{room.description}</p> : null}

      <dl className="mt-4 rounded-xl bg-[#f8fafc] px-4 py-2.5">
        <MetaRow icon={MapPin} label="Lokasi" value={room.building_name || "-"} />
        <MetaRow icon={Box} label="Fungsi" value={room.category?.name || categoryMeta(room.category?.slug).label} />
        <MetaRow icon={Clock3} label="Jam Operasional" value={room.open_hours || "07.00 - 16.00 WIB"} />
      </dl>

      {showFacilities && facilities.length > 0 ? (
        <ul className="mt-4 space-y-1.5 text-sm text-ink">
          {facilities.map((facility) => (
            <li key={facility.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#e2e8f0] px-3 py-2">
              <span>{facility.name}</span>
              {facility.quantity ? <span className="shrink-0 text-xs text-[#64748b]">{facility.quantity} unit</span> : null}
            </li>
          ))}
        </ul>
      ) : null}

      {facilities.length > 0 ? (
        <button
          type="button"
          onClick={() => setShowFacilities((value) => !value)}
          aria-expanded={showFacilities}
          className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0b3b8c] text-sm font-semibold text-white transition-colors hover:bg-[#0a3278]"
        >
          {showFacilities ? "Sembunyikan Fasilitas" : "Lihat Fasilitas Lengkap"}
          <ArrowRight size={16} className={`transition-transform ${showFacilities ? "-rotate-90" : ""}`} aria-hidden="true" />
        </button>
      ) : null}
    </aside>
  );
}
