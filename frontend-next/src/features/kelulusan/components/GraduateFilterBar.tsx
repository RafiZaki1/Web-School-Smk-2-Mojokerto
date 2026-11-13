"use client";

import ClassFilter from "@/shared/components/admin/ClassFilter";
import SearchInput from "@/shared/components/admin/SearchInput";
import Select from "@/shared/components/ui/Select";
import { ADMINISTRATION_OPTIONS, GRADUATION_STATUS_OPTIONS } from "../constants/kelulusan-keys";
import type { GraduateFilters, YearSummary } from "../types/kelulusan.type";

interface GraduateFilterBarProps {
  filters: GraduateFilters;
  search: string;
  years: YearSummary[];
  activeYear: number | undefined;
  onSearch: (value: string) => void;
  onChange: (patch: Partial<GraduateFilters>) => void;
}

const STATUS = [{ value: "", label: "Semua status" }, ...GRADUATION_STATUS_OPTIONS];
const ADMINISTRATION = [{ value: "", label: "Semua administrasi" }, ...ADMINISTRATION_OPTIONS];
const SOURCE = [
  { value: "active", label: "Data cek kelulusan" },
  { value: "archived", label: "Arsip angkatan lama" },
];

/** Filter tabel kelulusan: 12 kelas, angkatan, status, administrasi, dan pencarian nama/NISN. */
export function GraduateFilterBar({ filters, search, years, activeYear, onSearch, onChange }: GraduateFilterBarProps) {
  const yearOptions = [
    { value: "", label: activeYear ? `Angkatan aktif (${activeYear})` : "Angkatan aktif" },
    ...years.filter((row) => row.year !== activeYear).map((row) => ({ value: String(row.year), label: `Lulus ${row.year}` })),
  ];

  return (
    <div className="grid gap-3">
      <ClassFilter value={filters.class} onChange={(value) => onChange({ class: value })} />
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(0,180px))]">
        <SearchInput value={search} onChange={onSearch} placeholder="Cari nama atau NISN..." />
        <Select value={filters.year} onChange={(value) => onChange({ year: value })} options={yearOptions} label="Angkatan" />
        <Select value={filters.status} onChange={(value) => onChange({ status: value })} options={STATUS} label="Status" />
        <Select value={filters.administration} onChange={(value) => onChange({ administration: value })} options={ADMINISTRATION} label="Administrasi" />
        <Select value={filters.archived ? "archived" : "active"} onChange={(value) => onChange({ archived: value === "archived" })} options={SOURCE} label="Sumber data" />
      </div>
    </div>
  );
}
