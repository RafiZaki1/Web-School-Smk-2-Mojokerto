"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { categoryMeta } from "../constants/meta";
import { useRoomSearch } from "../hooks/useRoomSearch";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import type { Room } from "../types/denah.type";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { roomText } from "../utils/room-text";

interface MapSearchProps {
  onSearch: (query: string) => Promise<Room[]>;
  onSelect: (room: Room) => void;
}

/** Pencarian ruangan dengan saran otomatis (debounce 250ms, navigasi keyboard). */
export default function MapSearch({ onSearch, onSelect }: MapSearchProps) {
  const { t } = useTranslation();
  const listId = useId();
  const [query, setQuery] = useState("");
  const term = useDebouncedValue(query.trim(), 250);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const list = useRoomSearch(term, onSearch);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const clear = () => {
    setQuery("");
    setOpen(false);
    setHighlight(0);
  };

  const choose = (room: Room) => {
    onSelect(room);
    clear();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open || !list.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((index) => (index + 1) % list.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((index) => (index - 1 + list.length) % list.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const room = list[highlight];
      if (room) choose(room);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full sm:max-w-[320px]">
      <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--color-muted)]" aria-hidden="true" />
      <input
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setHighlight(0);
          setOpen(true);
          if (!event.target.value.trim()) setOpen(false);
        }}
        onFocus={() => list.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={t("Cari ruangan atau fasilitas...")}
        aria-label={t("Cari ruangan atau fasilitas")}
        className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-card pr-10 pl-10 text-sm text-ink placeholder:text-[var(--color-muted)] focus:border-blue focus:ring-2 focus:ring-blue/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {query ? (
        <button
          type="button"
          onClick={clear}
          aria-label={t("Hapus pencarian")}
          className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-ink"
        >
          <X size={15} aria-hidden="true" />
        </button>
      ) : null}

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-40 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[var(--color-line)] bg-card p-1.5 shadow-[0_16px_32px_rgba(19,35,44,0.12)]"
        >
          {list.length ? (
            list.map((room, index) => (
              <li
                key={room.id}
                role="option"
                aria-selected={index === highlight}
                onPointerDown={(event) => {
                  event.preventDefault();
                  choose(room);
                }}
                onMouseEnter={() => setHighlight(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${index === highlight ? "bg-[var(--color-tint)]" : ""}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{roomText(t, room.name)}</span>
                  <span className="block truncate text-xs text-[var(--color-muted)]">{t(room.building_name)}</span>
                </span>
                <span className="shrink-0 rounded-full bg-[var(--color-tint)] px-2 py-0.5 text-[11px] font-semibold text-blue">
                  {t(categoryMeta(room.category?.slug).label)}
                </span>
              </li>
            ))
          ) : (
            <li className="px-3 py-3 text-sm text-[var(--color-muted)]">{t("Ruangan tidak ditemukan.")}</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
