"use client";

import Pagination from "@/shared/components/ui/Pagination";
import SearchField from "@/shared/components/ui/SearchField";
import SelectField from "@/shared/components/ui/SelectField";
import useFilteredList from "@/shared/hooks/useFilteredList";
import type { SelectOption } from "@/shared/components/ui/Select";
import PrestasiCard from "./PrestasiCard";
import type { PrestasiCardItem } from "../types/prestasi.type";
import { useTranslation } from "@/shared/hooks/useTranslation";

const FILTERS = {
  kategori: (item: PrestasiCardItem, value: string) => item.kategori === value,
  tahun: (item: PrestasiCardItem, value: string) => item.year === value,
};
const SEARCH_KEYS: (keyof PrestasiCardItem & string)[] = ["title", "subtitle", "level"];

const toOptions = (all: string, values: string[]): SelectOption[] => [{ value: "semua", label: all }, ...values.map((value) => ({ value, label: value }))];

export function PrestasiExplorer({ items }: { items: PrestasiCardItem[] }) {
  const { t } = useTranslation();
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
        <p className="mt-12 rounded-xl border border-dashed border-[var(--color-line)] py-12 text-center text-[var(--color-muted)]">{t("Prestasi yang kamu cari belum ada.")}</p>
      )}

      <Pagination page={list.page} totalPages={list.totalPages} onChange={list.setPage} className="mt-10 lg:mt-12" />
    </>
  );
}
