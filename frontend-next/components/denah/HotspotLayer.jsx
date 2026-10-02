"use client";

import { roomKey } from "@/lib/denah/meta";

/**
 * Area klik tiap ruangan di atas gambar denah. Ruangan pada kategori aktif
 * diberi warna tipis; ruangan terpilih disorot biru, ruangan asal rute hijau.
 */
export default function HotspotLayer({ rooms, highlightKeys, selectedKey, originKey, onSelect }) {
  return (
    <div className="absolute inset-0 z-20">
      {rooms.map((room) => {
        const spot = room.hotspot;
        if (!spot || spot.x == null) return null;
        const key = roomKey(room);
        const isSelected = key === selectedKey;
        const isOrigin = !isSelected && key === originKey;
        const isHighlighted = highlightKeys?.has(key);

        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelect(room)}
            aria-label={room.name}
            aria-pressed={isSelected}
            title={room.name}
            style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.width}%`, height: `${spot.height}%` }}
            className={`group absolute cursor-pointer rounded-[3px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue ${
              isSelected
                ? "z-10 border-2 border-[#1d4ed8] bg-[#2563eb]/30"
                : isOrigin
                  ? "border-2 border-dashed border-[#16a34a] bg-[#16a34a]/15 hover:bg-[#16a34a]/25"
                  : isHighlighted
                  ? "border border-[#2563eb]/60 bg-[#2563eb]/15 hover:bg-[#2563eb]/25"
                  : "border border-transparent hover:border-[#2563eb]/70 hover:bg-[#2563eb]/15"
            }`}
          >
            <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden -translate-x-1/2 rounded-md bg-[#0f172a] px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-white group-hover:block group-focus-visible:block">
              {room.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
