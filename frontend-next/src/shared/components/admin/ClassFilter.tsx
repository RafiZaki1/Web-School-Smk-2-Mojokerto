"use client";

import { SCHOOL_CLASSES } from "@/shared/constants/school-classes";

interface ClassFilterProps {
  value: string;
  onChange: (value: string) => void;
  // Jumlah data per kelas, mis. antrean yang belum selesai; kelas tanpa angka tidak diberi penanda
  counts?: Record<string, number>;
  allLabel?: string;
}

/**
 * Filter 12 kelas XII dalam bentuk tombol. Beberapa petugas TU bisa membagi kerja per kelas
 * dengan satu akun yang sama, cukup memilih kelas masing-masing.
 */
export default function ClassFilter({ value, onChange, counts, allLabel = "Semua kelas" }: ClassFilterProps) {
  const options = [{ value: "", label: allLabel }, ...SCHOOL_CLASSES.map((name) => ({ value: name, label: name.replace("XII ", "") }))];

  return (
    <div role="group" aria-label="Filter kelas" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const count = option.value ? (counts?.[option.value] ?? 0) : undefined;
        return (
          <button
            key={option.value || "all"}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className="svc-chip"
            title={option.value || allLabel}
          >
            {option.label}
            {count ? <span className="ml-1.5 text-[12px] font-bold tabular-nums">{count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
