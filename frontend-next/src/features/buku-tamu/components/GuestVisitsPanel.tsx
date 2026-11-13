"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AdminButton from "@/shared/components/admin/AdminButton";
import { AutoSaveSelect, AutoSaveText } from "@/shared/components/admin/AutoSaveField";
import AutoSaveIndicator from "@/shared/components/admin/AutoSaveIndicator";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import Select from "@/shared/components/ui/Select";
import { VISIT_SCOPE, VISIT_STATUS_OPTIONS } from "../constants/buku-tamu-keys";
import { useAutoSaveGuestVisit, useDeleteGuestEntry, useGuestVisits } from "../hooks/useGuestBookAdmin";
import { formatVisitSchedule } from "../services/buku-tamu-form.service";
import type { GuestVisit, GuestVisitFilters, GuestVisitStatus } from "../types/buku-tamu.type";
import { GuestVisitFormModal } from "./GuestVisitFormModal";

const WHEN = [
  { value: "upcoming", label: "Hari ini dan mendatang" },
  { value: "past", label: "Sudah lewat" },
  { value: "", label: "Semua tanggal" },
];
const STATUS = [{ value: "", label: "Semua status" }, ...VISIT_STATUS_OPTIONS];

/** Jadwal kunjungan tamu instansi: dari form publik maupun dicatat TU. */
export function GuestVisitsPanel() {
  const [filters, setFilters] = useState<GuestVisitFilters>({ status: "", when: "upcoming" });
  const [adding, setAdding] = useState(false);
  const visits = useGuestVisits(filters);

  return (
    <section className="app-card p-5 sm:p-6" aria-labelledby="judul-kunjungan">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="judul-kunjungan" className="text-[18px] font-semibold text-[#0f172a]">
            Jadwal kunjungan tamu
          </h2>
          <AutoSaveIndicator scope={VISIT_SCOPE} syncedAt={visits.dataUpdatedAt || undefined} />
        </div>
        <AdminButton icon={Plus} onClick={() => setAdding(true)}>
          Catat kunjungan
        </AdminButton>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[240px_200px]">
        <Select value={filters.when} onChange={(value) => setFilters((current) => ({ ...current, when: value as GuestVisitFilters["when"] }))} options={WHEN} label="Tanggal" />
        <Select value={filters.status} onChange={(value) => setFilters((current) => ({ ...current, status: value }))} options={STATUS} label="Status" />
      </div>
      <div className="mt-4">
        <VisitsBody visits={visits} />
      </div>
      {adding ? <GuestVisitFormModal onClose={() => setAdding(false)} /> : null}
    </section>
  );
}

function VisitsBody({ visits }: { visits: ReturnType<typeof useGuestVisits> }) {
  const autoSave = useAutoSaveGuestVisit();
  const remove = useDeleteGuestEntry("visit");

  if (visits.isPending) return <LoadingState label="Memuat jadwal kunjungan..." />;
  if (visits.isError) return <ErrorState />;
  if (visits.data.length === 0) return <EmptyState title="Tidak ada jadwal kunjungan" />;

  const confirmRemove = (row: GuestVisit) => {
    if (window.confirm(`Hapus jadwal kunjungan ${row.institution}?`)) remove.mutate(row.id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="svc-table min-w-[980px]">
        <thead>
          <tr>
            <th scope="col">Jadwal</th>
            <th scope="col">Tamu</th>
            <th scope="col">Tujuan</th>
            <th scope="col" className="w-[140px]">
              Status
            </th>
            <th scope="col">Catatan TU</th>
            <th scope="col" className="w-[56px]">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {visits.data.map((row) => (
            <tr key={row.id}>
              <td className="whitespace-nowrap font-medium text-[#0f172a]">{formatVisitSchedule(row.visit_date, row.visit_time)}</td>
              <td className="min-w-[200px]">
                <span className="block font-semibold text-[#0f172a]">{row.institution}</span>
                <span className="block text-[13px] text-[#64748b]">
                  {row.visitor_name} · {row.participants} orang
                </span>
                {row.phone ? <span className="block text-[13px] text-[#64748b]">{row.phone}</span> : null}
              </td>
              <td className="max-w-[300px] text-[14px] leading-relaxed text-[#334155]">
                {row.purpose}
                {row.person_to_meet ? <span className="block text-[13px] text-[#64748b]">Bertemu: {row.person_to_meet}</span> : null}
              </td>
              <td>
                <AutoSaveSelect label={`Status kunjungan ${row.institution}`} value={row.status} options={VISIT_STATUS_OPTIONS} onSave={(value) => autoSave.mutateAsync({ id: row.id, payload: { status: value as GuestVisitStatus } })} />
              </td>
              <td className="min-w-[220px]">
                <AutoSaveText label={`Catatan kunjungan ${row.institution}`} value={row.note} multiline maxLength={2000} placeholder="Mis. dikonfirmasi via telepon" onSave={(note) => autoSave.mutateAsync({ id: row.id, payload: { note: note.trim() || null } })} />
              </td>
              <td>
                <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => confirmRemove(row)} aria-label={`Hapus kunjungan ${row.institution}`} disabled={remove.isPending}>
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
