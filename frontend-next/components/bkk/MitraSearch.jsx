"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function MitraSearch({ items }) {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const visible = items.filter((name) => name.toLowerCase().includes(term.trim().toLowerCase()));

  return (
    <>
      <form
        role="search"
        className="mt-6 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setTerm(query);
        }}
      >
        <label className="flex-1">
          <span className="sr-only">Cari perusahaan atau sektor</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setTerm(event.target.value);
            }}
            placeholder="Cari perusahaan atau sektor..."
            className="h-[54px] w-full rounded-xl border border-[#e2e8f0] bg-white px-5 text-base text-ink outline-none placeholder:text-[#9ca3af] focus:border-blue focus:ring-2 focus:ring-blue/15"
          />
        </label>
        <button type="submit" aria-label="Cari" className="flex h-[54px] w-[54px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-blue text-white transition-colors hover:bg-blue-dark">
          <Search size={22} aria-hidden="true" />
        </button>
      </form>

      <ul className="mt-6 flex flex-wrap gap-3">
        {visible.map((name) => (
          <li key={name} className="rounded-xl border border-[#e2e8f0] bg-white px-5 py-2.5 text-[15px] text-[#374151]">
            {name}
          </li>
        ))}
        {visible.length === 0 && <li className="text-[15px] text-[#6b7280]">Perusahaan tidak ditemukan.</li>}
      </ul>
    </>
  );
}
