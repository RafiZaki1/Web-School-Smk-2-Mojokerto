"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AdminButton from "@/shared/components/admin/AdminButton";
import AutoSaveIndicator from "@/shared/components/admin/AutoSaveIndicator";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import Pagination from "@/shared/components/ui/Pagination";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { GRADUATE_SCOPE, useGraduates, useGraduateYears } from "../hooks/useGraduationAdmin";
import type { Graduate, GraduateFilters } from "../types/kelulusan.type";
import { GraduateFilterBar } from "./GraduateFilterBar";
import { GraduateFormModal } from "./GraduateFormModal";
import { GraduateTable } from "./GraduateTable";

const INITIAL: GraduateFilters = { year: "", class: "", status: "", administration: "", search: "", archived: false, page: 1 };

// undefined = modal tertutup, null = tambah siswa, Graduate = ubah siswa
type Editing = Graduate | null | undefined;

/** Tabel kerja siswa kelas XII dengan filter 12 kelas, sinkron otomatis tiap 5 detik. */
export function GraduateWorkTable({ activeYear }: { activeYear: number | undefined }) {
  const [filters, setFilters] = useState<GraduateFilters>(INITIAL);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Editing>(undefined);
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const query = { ...filters, search: debouncedSearch };
  const graduates = useGraduates(query);
  const years = useGraduateYears();

  const patch = (next: Partial<GraduateFilters>) => setFilters((current) => ({ ...current, ...next, page: next.page ?? 1 }));

  return (
    <section className="app-card p-5 sm:p-6" aria-labelledby="judul-tabel-kelulusan">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="judul-tabel-kelulusan" className="text-[18px] font-semibold text-[#0f172a]">
            Data siswa
          </h2>
          <AutoSaveIndicator scope={GRADUATE_SCOPE} syncedAt={graduates.dataUpdatedAt || undefined} />
        </div>
        <AdminButton icon={Plus} onClick={() => setEditing(null)}>
          Tambah siswa
        </AdminButton>
      </div>

      <div className="mt-4">
        <GraduateFilterBar
          filters={filters}
          search={search}
          years={years.data ?? []}
          activeYear={activeYear}
          onSearch={(value) => {
            setSearch(value);
            patch({});
          }}
          onChange={patch}
        />
      </div>

      <div className="mt-4">
        <TableBody graduates={graduates} filtered={Boolean(filters.class || filters.status || filters.administration || debouncedSearch)} onEdit={setEditing} />
      </div>

      {graduates.data ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-[#64748b]">{graduates.data.paginate.total} siswa</p>
          <Pagination page={filters.page} totalPages={graduates.data.paginate.last_page} onChange={(page) => patch({ page })} />
        </div>
      ) : null}

      {editing !== undefined ? <GraduateFormModal graduate={editing} defaultYear={activeYear ?? new Date().getFullYear()} onClose={() => setEditing(undefined)} /> : null}
    </section>
  );
}

function TableBody({ graduates, filtered, onEdit }: { graduates: ReturnType<typeof useGraduates>; filtered: boolean; onEdit: (row: Graduate) => void }) {
  if (graduates.isPending) return <LoadingState label="Memuat data siswa..." />;
  if (graduates.isError) {
    return (
      <ErrorState
        action={
          <AdminButton variant="ghost" onClick={() => void graduates.refetch()}>
            Coba lagi
          </AdminButton>
        }
      />
    );
  }
  if (graduates.data.data.length === 0) {
    return <EmptyState title={filtered ? "Tidak ada siswa yang cocok dengan filter" : "Belum ada data siswa"} description={filtered ? undefined : "Unggah file Excel/CSV atau tambah siswa satu per satu."} />;
  }
  return <GraduateTable rows={graduates.data.data} onEdit={onEdit} />;
}
