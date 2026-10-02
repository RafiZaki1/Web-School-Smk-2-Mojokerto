"use client";

import Pagination from "@/components/common/Pagination";
import SearchField from "@/components/common/SearchField";
import SelectField from "@/components/common/SelectField";
import useFilteredList from "@/lib/hooks/useFilteredList";
import PrestasiCard from "./PrestasiCard";

const FILTERS = {
  kategori: (item, value) => item.kategori === value,
  tahun: (item, value) => item.year === value,
};
const SEARCH_KEYS = ["title", "subtitle", "level"];

const toOptions = (all, values) => [{ value: "semua", label: all }, ...values.map((value) => ({ value, label: value }))];

export default function PrestasiExplorer({ items }) {
  const list = useFilteredList(items, { filters: FILTERS, searchKeys: SEARCH_KEYS, perPage: 6 });
  const kategori = [...new Set(items.map((item) => item.kategori))];
  const tahun = [...new Set(items.map((item) => item.year))];

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mt-10">
        <div className="flex gap-3">
          <SelectField label="Kategori" value={list.values.kategori} onChange={(value) => list.setFilter("kategori", value)} options={toOptions("Semua Kategori", kategori)} />
          <SelectField label="Tahun" value={list.values.tahun} onChange={(value) => list.setFilter("tahun", value)} options={toOptions("Semua Tahun", tahun)} />
        </div>
        <SearchField value={list.query} onChange={list.setQuery} placeholder="Cari prestasi..." className="sm:w-[324px]" />
      </div>

      {list.pageItems.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-9">
          {list.pageItems.map((item) => (
            <PrestasiCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-xl border border-dashed border-[#cbd5e1] py-12 text-center text-[#6b7280]">
          Prestasi yang kamu cari belum ada.
        </p>
      )}

      <Pagination page={list.page} totalPages={list.totalPages} onChange={list.setPage} className="mt-10 lg:mt-12" />
    </>
  );
}
