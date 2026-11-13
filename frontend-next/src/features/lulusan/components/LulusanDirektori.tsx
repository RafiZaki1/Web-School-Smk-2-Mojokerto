"use client";

import { Star } from "lucide-react";
import Pagination from "@/shared/components/ui/Pagination";
import SearchField from "@/shared/components/ui/SearchField";
import SelectField from "@/shared/components/ui/SelectField";
import useFilteredList from "@/shared/hooks/useFilteredList";
import type { SelectOption } from "@/shared/components/ui/Select";
import { JURUSAN_TONES } from "../constants/lulusan-data";
import type { Lulusan } from "../types/lulusan.type";
import { useTranslation } from "@/shared/hooks/useTranslation";

const FILTERS = {
  jurusan: (item: Lulusan, value: string) => item.jurusan === value,
  angkatan: (item: Lulusan, value: string) => String(item.angkatan) === value,
};
const SEARCH_KEYS: (keyof Lulusan & string)[] = ["name", "karier"];

function AlumniGradientCard({ alumni }: { alumni: Lulusan }) {
  const { t } = useTranslation();
  return (
    <article
      className={`relative flex h-[370px] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-b p-6 text-white shadow-[0_10px_20px_-6px_rgba(19,35,44,0.25)] ${JURUSAN_TONES[alumni.jurusan] ?? JURUSAN_TONES.RPL}`}
    >
      <span className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/25 backdrop-blur-sm">
        <Star size={16} fill="#facc15" strokeWidth={0} aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold">{alumni.name}</h2>
      <p className="mt-1 text-[13px] text-white/80">
        {alumni.jurusan} • {t("Angkatan {tahun}", { tahun: alumni.angkatan })}
      </p>
      <p className="mt-4 rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-[13px] leading-5 font-medium backdrop-blur-sm">{t(alumni.karier)}</p>
    </article>
  );
}

export function LulusanDirektori({ items }: { items: Lulusan[] }) {
  const { t } = useTranslation();
  const list = useFilteredList(items, { filters: FILTERS, searchKeys: SEARCH_KEYS, perPage: 8 });
  const jurusan = [...new Set(items.map((item) => item.jurusan))];
  const angkatan = [...new Set(items.map((item) => String(item.angkatan)))].sort().reverse();

  const jurusanOptions: SelectOption[] = [{ value: "semua", label: "Semua Jurusan" }, ...jurusan.map((value) => ({ value, label: value }))];
  const angkatanOptions: SelectOption[] = [
    { value: "semua", label: "Semua Angkatan" },
    ...angkatan.map((value) => ({ value, label: t("Angkatan {tahun}", { tahun: value }) })),
  ];

  return (
    <>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <SelectField label="Jurusan" value={list.values.jurusan ?? "semua"} onChange={(value) => list.setFilter("jurusan", value)} options={jurusanOptions} />
          <SelectField label="Angkatan" value={list.values.angkatan ?? "semua"} onChange={(value) => list.setFilter("angkatan", value)} options={angkatanOptions} />
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
        <p className="mt-12 rounded-xl border border-dashed border-[var(--color-line)] py-12 text-center text-[var(--color-muted)]">{t("Alumni tidak ditemukan.")}</p>
      )}

      <Pagination page={list.page} totalPages={list.totalPages} onChange={list.setPage} className="mt-12" />
    </>
  );
}
