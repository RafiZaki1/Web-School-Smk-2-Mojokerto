"use client";

import { Star } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import SearchField from "@/components/common/SearchField";
import SelectField from "@/components/common/SelectField";
import useFilteredList from "@/lib/hooks/useFilteredList";
import { JURUSAN_TONES } from "@/lib/data/lulusanData";

const FILTERS = {
  jurusan: (item, value) => item.jurusan === value,
  angkatan: (item, value) => String(item.angkatan) === value,
};
const SEARCH_KEYS = ["name", "karier"];

function AlumniGradientCard({ alumni }) {
  return (
    <article
      className={`relative flex h-[370px] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-b p-6 text-white shadow-[0_10px_20px_-6px_rgba(15,23,42,0.25)] ${JURUSAN_TONES[alumni.jurusan] ?? JURUSAN_TONES.RPL}`}
    >
      <span className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/25 backdrop-blur-sm">
        <Star size={16} fill="#facc15" strokeWidth={0} aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold">{alumni.name}</h2>
      <p className="mt-1 text-[13px] text-white/80">
        {alumni.jurusan} • Angkatan {alumni.angkatan}
      </p>
      <p className="mt-4 rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-[13px] leading-5 font-medium backdrop-blur-sm">
        {alumni.karier}
      </p>
    </article>
  );
}

export default function LulusanDirektori({ items }) {
  const list = useFilteredList(items, { filters: FILTERS, searchKeys: SEARCH_KEYS, perPage: 8 });
  const jurusan = [...new Set(items.map((item) => item.jurusan))];
  const angkatan = [...new Set(items.map((item) => String(item.angkatan)))].sort().reverse();

  return (
    <>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <SelectField
            label="Jurusan"
            value={list.values.jurusan}
            onChange={(value) => list.setFilter("jurusan", value)}
            options={[{ value: "semua", label: "Semua Jurusan" }, ...jurusan.map((value) => ({ value, label: value }))]}
          />
          <SelectField
            label="Angkatan"
            value={list.values.angkatan}
            onChange={(value) => list.setFilter("angkatan", value)}
            options={[{ value: "semua", label: "Semua Angkatan" }, ...angkatan.map((value) => ({ value, label: `Angkatan ${value}` }))]}
          />
        </div>
        <SearchField value={list.query} onChange={list.setQuery} placeholder="Cari nama alumni..." className="sm:w-[324px]" />
      </div>

      {list.pageItems.length > 0 ? (
        <div className="mx-auto mt-12 grid max-w-[1220px] gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[33px]">
          {list.pageItems.map((alumni) => (
            <AlumniGradientCard key={`${alumni.name}-${alumni.angkatan}`} alumni={alumni} />
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-xl border border-dashed border-[#cbd5e1] py-12 text-center text-[#6b7280]">Alumni tidak ditemukan.</p>
      )}

      <Pagination page={list.page} totalPages={list.totalPages} onChange={list.setPage} className="mt-12" />
    </>
  );
}
