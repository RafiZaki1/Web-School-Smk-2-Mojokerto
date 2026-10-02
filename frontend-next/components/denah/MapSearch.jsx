"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { categoryMeta } from "@/lib/denah/meta";

/** Pencarian ruangan dengan saran otomatis (debounce 250ms, navigasi keyboard). */
export default function MapSearch({ onSearch, onSelect }) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) return undefined;
    const timer = setTimeout(async () => {
      const found = await onSearch(query);
      setResults(found.slice(0, 8));
      setHighlight(0);
      setOpen(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const choose = (room) => {
    onSelect(room);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const onKeyDown = (event) => {
    if (!open || !results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(results[highlight]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full sm:max-w-[320px]">
      <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#94a3b8]" aria-hidden="true" />
      <input
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (!event.target.value.trim()) {
            setResults([]);
            setOpen(false);
          }
        }}
        onFocus={() => results.length && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Cari ruangan atau fasilitas..."
        aria-label="Cari ruangan atau fasilitas"
        className="h-11 w-full rounded-xl border border-[#e2e8f0] bg-white pr-10 pl-10 text-sm text-ink outline-none placeholder:text-[#94a3b8] focus:border-blue focus:ring-2 focus:ring-blue/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {query ? (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setResults([]);
            setOpen(false);
          }}
          aria-label="Hapus pencarian"
          className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-ink"
        >
          <X size={15} aria-hidden="true" />
        </button>
      ) : null}

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-40 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[#e2e8f0] bg-white p-1.5 shadow-[0_16px_32px_rgba(15,23,42,0.12)]"
        >
          {results.length ? (
            results.map((room, index) => (
              <li
                key={room.id}
                role="option"
                aria-selected={index === highlight}
                onPointerDown={(event) => {
                  event.preventDefault();
                  choose(room);
                }}
                onMouseEnter={() => setHighlight(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${index === highlight ? "bg-[#eff6ff]" : ""}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{room.name}</span>
                  <span className="block truncate text-xs text-[#64748b]">{room.building_name}</span>
                </span>
                <span className="shrink-0 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-blue">
                  {categoryMeta(room.category?.slug).label}
                </span>
              </li>
            ))
          ) : (
            <li className="px-3 py-3 text-sm text-[#64748b]">Ruangan tidak ditemukan.</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
