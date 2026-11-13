"use client";

import { useState } from "react";
import AdminButton from "@/shared/components/admin/AdminButton";
import AutoSaveIndicator from "@/shared/components/admin/AutoSaveIndicator";
import ClassFilter from "@/shared/components/admin/ClassFilter";
import { MetricGrid } from "@/shared/components/admin/MetricCard";
import PageTitle from "@/shared/components/admin/PageTitle";
import SearchInput from "@/shared/components/admin/SearchInput";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import Pagination from "@/shared/components/ui/Pagination";
import Select from "@/shared/components/ui/Select";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { ALUMNI_QUEUE_SCOPE, SERVICE_STATUS_OPTIONS, SERVICE_TYPE_OPTIONS } from "../constants/layanan-alumni-keys";
import { useAlumniServiceQueue } from "../hooks/useAlumniServiceAdmin";
import type { AlumniServiceFilters } from "../types/layanan-alumni.type";
import { AlumniServiceQueueTable } from "./AlumniServiceQueueTable";

const INITIAL: AlumniServiceFilters = { class: "", status: "", type: "", search: "", page: 1 };
const STATUS = [{ value: "", label: "Semua status" }, ...SERVICE_STATUS_OPTIONS];
const TYPES = [{ value: "", label: "Semua layanan" }, ...SERVICE_TYPE_OPTIONS.map(({ value, label }) => ({ value, label }))];

/** Halaman /admin/tu/layanan-alumni: antrean berkas alumni yang bisa dibagi per kelas. */
export function AlumniServiceQueue() {
  const [filters, setFilters] = useState<AlumniServiceFilters>(INITIAL);
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search.trim(), 350);
  const queue = useAlumniServiceQueue({ ...filters, search: debounced });
  const patch = (next: Partial<AlumniServiceFilters>) => setFilters((current) => ({ ...current, ...next, page: next.page ?? 1 }));
  const statuses = queue.data?.summary.statuses;

  return (
    <div className="grid gap-6">
      <PageTitle title="Layanan Berkas Alumni" subtitle="Ambil ijazah, cap tiga jari, dan legalisir. Status Disetujui mengirim notifikasi ke HP pengaju." />

      <MetricGrid
        items={[
          { label: "Menunggu", value: statuses?.pending ?? "-" },
          { label: "Diproses", value: statuses?.processing ?? "-" },
          { label: "Disetujui", value: statuses?.approved ?? "-" },
          { label: "Selesai", value: statuses?.completed ?? "-" },
        ]}
      />

      <section className="app-card p-5 sm:p-6" aria-labelledby="judul-antrean">
        <h2 id="judul-antrean" className="text-[18px] font-semibold text-[#0f172a]">
          Antrean pengajuan
        </h2>
        <AutoSaveIndicator scope={ALUMNI_QUEUE_SCOPE} syncedAt={queue.dataUpdatedAt || undefined} />

        <div className="mt-4 grid gap-3">
          <ClassFilter value={filters.class} onChange={(value) => patch({ class: value })} counts={queue.data?.summary.open_by_class} />
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_200px]">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                patch({});
              }}
              placeholder="Cari tiket, nama, atau NISN..."
            />
            <Select value={filters.status} onChange={(value) => patch({ status: value })} options={STATUS} label="Status" />
            <Select value={filters.type} onChange={(value) => patch({ type: value })} options={TYPES} label="Jenis layanan" />
          </div>
          <p className="text-[13px] text-[#64748b]">Angka di tombol kelas adalah pengajuan yang belum selesai (Menunggu dan Diproses).</p>
        </div>

        <div className="mt-4">
          <QueueBody queue={queue} filtered={Boolean(filters.class || filters.status || filters.type || debounced)} />
        </div>

        {queue.data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-[#64748b]">{queue.data.paginate.total} pengajuan</p>
            <Pagination page={filters.page} totalPages={queue.data.paginate.last_page} onChange={(page) => patch({ page })} />
          </div>
        ) : null}
      </section>
    </div>
  );
}

function QueueBody({ queue, filtered }: { queue: ReturnType<typeof useAlumniServiceQueue>; filtered: boolean }) {
  if (queue.isPending) return <LoadingState label="Memuat antrean..." />;
  if (queue.isError) {
    return (
      <ErrorState
        action={
          <AdminButton variant="ghost" onClick={() => void queue.refetch()}>
            Coba lagi
          </AdminButton>
        }
      />
    );
  }
  if (queue.data.data.length === 0) return <EmptyState title={filtered ? "Tidak ada pengajuan yang cocok" : "Belum ada pengajuan"} />;
  return <AlumniServiceQueueTable rows={queue.data.data} />;
}
