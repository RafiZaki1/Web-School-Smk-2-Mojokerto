"use client";

import { useMemo, useState } from "react";

type FilterTest<T> = (item: T, value: string) => boolean;

interface FilteredListOptions<T> {
  filters?: Record<string, FilterTest<T>>;
  searchKeys?: (keyof T & string)[];
  perPage?: number;
}

/**
 * Filter + cari + paginasi untuk daftar statis di halaman publik.
 * filters: { key: (item, value) => boolean }, "semua" berarti tidak difilter.
 */
export default function useFilteredList<T extends object>(items: T[], { filters = {}, searchKeys = [], perPage = 6 }: FilteredListOptions<T> = {}) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(Object.keys(filters).map((key) => [key, "semua"])));
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const passFilters = Object.entries(filters).every(([key, test]) => values[key] === "semua" || test(item, values[key] ?? "semua"));
      const passSearch = !term || searchKeys.some((key) => String((item as Record<string, unknown>)[key] ?? "").toLowerCase().includes(term));
      return passFilters && passSearch;
    });
  }, [items, filters, searchKeys, values, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);

  return {
    values,
    setFilter: (key: string, value: string) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    query,
    setQuery: (value: string) => {
      setQuery(value);
      setPage(1);
    },
    page: currentPage,
    setPage,
    totalPages,
    total: filtered.length,
    pageItems: filtered.slice((currentPage - 1) * perPage, currentPage * perPage),
  };
}
