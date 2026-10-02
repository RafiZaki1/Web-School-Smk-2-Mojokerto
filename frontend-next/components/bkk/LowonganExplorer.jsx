"use client";

import Pagination from "@/components/common/Pagination";
import SearchField from "@/components/common/SearchField";
import SelectField from "@/components/common/SelectField";
import TabButtons from "@/components/ui/TabButtons";
import useFilteredList from "@/lib/hooks/useFilteredList";
import LowonganCard from "./LowonganCard";

const FILTERS = {
  bidang: (job, value) => job.kategori === value,
  lokasi: (job, value) => job.location === value,
};
const SEARCH_KEYS = ["title", "company"];

export default function LowonganExplorer({ items, kategori }) {
  const list = useFilteredList(items, { filters: FILTERS, searchKeys: SEARCH_KEYS, perPage: 6 });
  const lokasi = [...new Set(items.map((job) => job.location))];

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mt-10">
        <div className="flex gap-3">
          <SelectField
            label="Bidang"
            value={list.values.bidang}
            onChange={(value) => list.setFilter("bidang", value)}
            options={[{ value: "semua", label: "Semua Bidang" }, ...kategori.map((value) => ({ value, label: value }))]}
          />
          <SelectField
            label="Lokasi"
            value={list.values.lokasi}
            onChange={(value) => list.setFilter("lokasi", value)}
            options={[{ value: "semua", label: "Semua Lokasi" }, ...lokasi.map((value) => ({ value, label: value }))]}
          />
        </div>
        <SearchField value={list.query} onChange={list.setQuery} placeholder="Cari posisi atau perusahaan..." className="sm:w-[350px]" />
      </div>

      <TabButtons
        variant="outline"
        activeColor="var(--color-blue-deep)"
        className="mt-5"
        ariaLabel="Kategori bidang"
        tabs={[{ id: "semua", label: "Semua" }, ...kategori.map((value) => ({ id: value, label: value }))]}
        activeId={list.values.bidang}
        onChange={(value) => list.setFilter("bidang", value)}
      />

      {list.pageItems.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.pageItems.map((job) => (
            <LowonganCard key={job.slug} job={job} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-dashed border-[#cbd5e1] py-12 text-center text-[#6b7280]">Belum ada lowongan di kategori ini.</p>
      )}

      <Pagination
        page={list.page}
        totalPages={list.totalPages}
        onChange={list.setPage}
        activeClassName="border-blue-deep bg-blue-deep text-white"
        className="mt-10"
      />
    </>
  );
}
