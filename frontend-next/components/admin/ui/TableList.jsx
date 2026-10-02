"use client";

import { useState } from "react";
import SearchInput from "./SearchInput";

/**
 * Tabel data dari dealtech-ui (TableListV1): toolbar cari + jumlah data,
 * kolom dengan render kustom, dan pesan kosong.
 */
export default function TableList({ columns, rows, searchKeys = [], searchPlaceholder = "Cari...", rowKey = "id", emptyText = "Data tidak ditemukan." }) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const visible = term ? rows.filter((row) => searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(term))) : rows;

  return (
    <section className="app-card tablelist">
      <div className="tablelist__toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder={searchPlaceholder} className="sm:max-w-[324px]" />
        <span className="tablelist__count">{visible.length} data</span>
      </div>
      {/* Mobile: tiap baris jadi kartu */}
      <ul className="divide-y divide-[#e2e8f0] md:hidden">
        {visible.map((row) => {
          const [first, ...rest] = columns;
          return (
            <li key={row[rowKey]} className="space-y-3 px-4 py-4">
              <div>{first.render ? first.render(row) : row[first.key]}</div>
              <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-[14px]">
                {rest.map((column) => (
                  <div key={column.key} className="contents">
                    <dt className="text-[12px] font-semibold tracking-[0.06em] text-[#64748b] uppercase">{column.label}</dt>
                    <dd className="min-w-0">{column.render ? column.render(row) : row[column.key]}</dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
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
              <tr key={row[rowKey]}>
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render ? column.render(row) : row[column.key]}
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
