"use client";

import { useState, type ReactNode } from "react";
import TabButtons from "@/shared/components/ui/TabButtons";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { localizeDate } from "@/shared/lib/i18n/date";
import type { SpmbJalur, SpmbNilaiBaris } from "../constants/spmb-video-script";

const th = "px-6 py-5 text-left text-xs font-semibold tracking-[0.06em] text-[var(--color-body)] uppercase sm:text-[13px] lg:px-8 lg:py-7 lg:text-base";
const td = "px-6 py-5 text-[15px] text-ink sm:text-base lg:px-8 lg:py-[22px] lg:text-lg";

/** Tabel data; di mobile tiap baris tampil sebagai kartu. */
export interface TableColumn<T> {
  key: string;
  label: string;
  className?: string;
}

interface DataTableProps<T extends object> {
  columns: TableColumn<T>[];
  rows: T[];
  renderCell?: (key: string, value: unknown) => ReactNode;
}

export function DataTable<T extends object>({ columns, rows, renderCell }: DataTableProps<T>) {
  const { t, locale } = useTranslation();
  const cell = (key: string, value: unknown): ReactNode => (renderCell ? renderCell(key, value) : localizeDate(t(String(value ?? "")), locale));
  const [first, ...rest] = columns;

  return (
    <>
      <ul className="space-y-3 md:hidden">
        {rows.map((row, index) => (
          <li key={index} className="rounded-2xl border border-[var(--color-line)] bg-card p-4">
            <p className="text-[15px] font-semibold text-ink">{cell(first.key, (row as Record<string, unknown>)[first.key])}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
              {rest.map((column) => (
                <div key={column.key}>
                  <dt className="text-[11px] font-semibold tracking-[0.06em] text-[var(--color-muted)] uppercase">{t(column.label)}</dt>
                  <dd className="mt-0.5 text-[14px] text-ink">{cell(column.key, (row as Record<string, unknown>)[column.key])}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-card md:block">
        <table className="w-full min-w-[720px] border-collapse">
          <thead className="bg-[var(--color-surface-alt)]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={`${th} ${column.className ?? ""}`}>
                  {t(column.label)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-[var(--color-line)]">
                {columns.map((column) => (
                  <td key={column.key} className={`${td} ${column.className ?? ""}`}>
                    {cell(column.key, (row as Record<string, unknown>)[column.key])}
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

export function JadwalTabs({ jalur }: { jalur: SpmbJalur[] }) {
  const { t, locale } = useTranslation();
  const [activeId, setActiveId] = useState<string | undefined>(jalur[0]?.id);
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
      <div className="mt-6" role="tabpanel" aria-label={t(current.label)}>
        <DataTable
          columns={JADWAL_COLUMNS}
          rows={current.jadwal}
          renderCell={(key, value) =>
            key === "tempat" && value === "Online" ? (
              <span className="rounded-full bg-[var(--color-tint)] px-3 py-1 text-[13px] font-medium text-[var(--color-primary-dark)] lg:text-base">{t("Online")}</span>
            ) : (
              localizeDate(t(String(value ?? "")), locale)
            )
          }
        />
      </div>
    </>
  );
}
