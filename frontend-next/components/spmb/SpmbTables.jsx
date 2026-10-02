"use client";

import { useState } from "react";
import TabButtons from "@/components/ui/TabButtons";

const th = "px-6 py-5 text-left text-xs font-semibold tracking-[0.06em] text-[#4b5563] uppercase sm:text-[13px] lg:px-8 lg:py-7 lg:text-base";
const td = "px-6 py-5 text-[15px] text-ink sm:text-base lg:px-8 lg:py-[22px] lg:text-lg";

/** Tabel data; di mobile tiap baris tampil sebagai kartu. */
export function DataTable({ columns, rows, renderCell }) {
  const cell = (key, value) => (renderCell ? renderCell(key, value) : value);
  const [first, ...rest] = columns;

  return (
    <>
      <ul className="space-y-3 md:hidden">
        {rows.map((row, index) => (
          <li key={index} className="rounded-2xl border border-[#e5e7eb] bg-white p-4">
            <p className="text-[15px] font-semibold text-ink">{cell(first.key, row[first.key])}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
              {rest.map((column) => (
                <div key={column.key}>
                  <dt className="text-[11px] font-semibold tracking-[0.06em] text-[#6b7280] uppercase">{column.label}</dt>
                  <dd className="mt-0.5 text-[14px] text-ink">{cell(column.key, row[column.key])}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border border-[#e5e7eb] bg-white md:block">
        <table className="w-full min-w-[720px] border-collapse">
          <thead className="bg-[#f9fafb]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={`${th} ${column.className ?? ""}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-[#e5e7eb]">
                {columns.map((column) => (
                  <td key={column.key} className={`${td} ${column.className ?? ""}`}>
                    {cell(column.key, row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const JADWAL_COLUMNS = [
  { key: "kegiatan", label: "Kegiatan", className: "w-[45%]" },
  { key: "tanggal", label: "Tanggal" },
  { key: "jam", label: "Jam" },
  { key: "tempat", label: "Tempat/Ket." },
];

export function JadwalTabs({ jalur }) {
  const [activeId, setActiveId] = useState(jalur[0].id);
  const current = jalur.find((item) => item.id === activeId) ?? jalur[0];

  return (
    <>
      <TabButtons
        variant="outline"
        className="mt-8"
        ariaLabel="Jalur pendaftaran"
        tabs={jalur.map(({ id, label }) => ({ id, label }))}
        activeId={activeId}
        onChange={setActiveId}
      />
      <div className="mt-6" role="tabpanel" aria-label={current.label}>
        <DataTable
          columns={JADWAL_COLUMNS}
          rows={current.jadwal}
          renderCell={(key, value) =>
            key === "tempat" && value === "Online" ? (
              <span className="rounded-full bg-[#dbeafe] px-3 py-1 text-[13px] font-medium text-[#1e40af] lg:text-base">Online</span>
            ) : (
              value
            )
          }
        />
      </div>
    </>
  );
}
