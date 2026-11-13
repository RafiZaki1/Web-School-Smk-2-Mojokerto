"use client";

import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import SearchInput from "@/shared/components/admin/SearchInput";

export interface TableColumn<T> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface TableListProps<T extends object> {
  columns: TableColumn<T>[];
  rows: T[];
  searchKeys?: (keyof T & string)[];
  searchPlaceholder?: string;
  rowKey?: keyof T & string;
  emptyText?: string;
}

const cellValue = <T extends object>(row: T, key: string): string => String((row as Record<string, unknown>)[key] ?? "");

/**
 * Tabel data dari dealtech-ui (TableListV1): toolbar cari + jumlah data,
 * kolom dengan render kustom, dan pesan kosong.
 * Memakai useDeferredValue + useMemo agar pencarian tetap instan tanpa lag ketikan.
 */
export default function TableList<T extends object>({
  columns,
  rows,
  searchKeys = [],
  searchPlaceholder = "Cari...",
  rowKey = "id" as keyof T & string,
  emptyText = "Data tidak ditemukan.",
}: TableListProps<T>) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const term = deferredQuery.trim().toLowerCase();

  const visible = useMemo(
    () => (term ? rows.filter((row) => searchKeys.some((key) => cellValue(row, key).toLowerCase().includes(term))) : rows),
    [rows, searchKeys, term],
  );

  const [first, ...rest] = columns;

  return (
    <section className="app-card tablelist">
      <div className="tablelist__toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder={searchPlaceholder} className="w-full sm:max-w-[324px]" />
        <span className="tablelist__count">{visible.length} data</span>
      </div>
      {/* Mobile: tiap baris jadi kartu */}
      <ul className="divide-y divide-[#e2e8f0] md:hidden">
        {visible.map((row) => (
          <li key={String(row[rowKey])} className="space-y-3.5 px-4 py-4">
            {first ? <div className="min-w-0 break-words">{first.render ? first.render(row) : cellValue(row, first.key)}</div> : null}
            <dl className="grid grid-cols-[minmax(84px,112px)_1fr] items-baseline gap-x-3 gap-y-2.5 text-[14px]">
              {rest.map((column) => (
                <div key={column.key} className="contents">
                  <dt className="text-[11px] font-semibold tracking-[0.06em] text-[#64748b] uppercase">{column.label}</dt>
                  <dd className="min-w-0 break-words">{column.render ? column.render(row) : cellValue(row, column.key)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
        {visible.length === 0 && <li className="tablelist__empty">{emptyText}</li>}
      </ul>

      <div className="tablelist__scroll hidden md:block">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={column.className}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={String(row[rowKey])}>
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render ? column.render(row) : cellValue(row, column.key)}
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="tablelist__empty">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
