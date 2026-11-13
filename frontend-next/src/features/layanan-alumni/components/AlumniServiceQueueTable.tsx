"use client";

import { Trash2 } from "lucide-react";
import { AutoSaveSelect, AutoSaveText } from "@/shared/components/admin/AutoSaveField";
import type { AlumniServiceStatus } from "@/shared/types/device-inbox.type";
import { formatServiceTime } from "@/shared/utils/service-status";
import { SERVICE_STATUS_OPTIONS } from "../constants/layanan-alumni-keys";
import { useAutoSaveAlumniService, useDeleteAlumniService } from "../hooks/useAlumniServiceAdmin";
import type { AlumniServiceRequest } from "../types/layanan-alumni.type";

/**
 * Tabel antrean. Mengubah status ke "Disetujui" langsung mengirim notifikasi ke lonceng dan HP
 * pengaju (diproses server); catatan tersimpan sendiri setelah berhenti mengetik.
 */
export function AlumniServiceQueueTable({ rows }: { rows: AlumniServiceRequest[] }) {
  const autoSave = useAutoSaveAlumniService();
  const remove = useDeleteAlumniService();

  const confirmRemove = (row: AlumniServiceRequest) => {
    if (window.confirm(`Hapus pengajuan ${row.ticket_code} atas nama ${row.full_name}?`)) remove.mutate(row.id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="svc-table min-w-[1080px]">
        <thead>
          <tr>
            <th scope="col">Tiket</th>
            <th scope="col">Alumni</th>
            <th scope="col">Layanan</th>
            <th scope="col" className="w-[150px]">
              Status
            </th>
            <th scope="col">Catatan untuk alumni</th>
            <th scope="col" className="w-[56px]">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="whitespace-nowrap">
                <span className="svc-code block font-semibold text-[#0f172a]">{row.ticket_code}</span>
                <span className="block text-[13px] text-[#64748b]">{formatServiceTime(row.created_at)}</span>
              </td>
              <td>
                <span className="block font-semibold text-[#0f172a]">{row.full_name}</span>
                <span className="block text-[13px] text-[#64748b]">
                  {row.class_name} · Lulus {row.graduation_year}
                </span>
                <span className="svc-code block text-[13px] text-[#64748b]">NISN {row.nisn}</span>
                {row.phone ? <span className="block text-[13px] text-[#64748b]">HP {row.phone}</span> : null}
              </td>
              <td className="max-w-[260px]">
                <span className="block font-medium text-[#0f172a]">{row.service_type_label}</span>
                <span className="block text-[13px] leading-snug text-[#475569]">{row.purpose}</span>
              </td>
              <td>
                <AutoSaveSelect
                  label={`Status pengajuan ${row.ticket_code}`}
                  value={row.status}
                  options={SERVICE_STATUS_OPTIONS}
                  onSave={(status) => autoSave.mutateAsync({ id: row.id, payload: { status: status as AlumniServiceStatus } })}
                />
              </td>
              <td className="min-w-[240px]">
                <AutoSaveText
                  label={`Catatan ${row.ticket_code}`}
                  value={row.admin_note}
                  multiline
                  placeholder="Mis. bawa fotokopi KTP"
                  onSave={(note) => autoSave.mutateAsync({ id: row.id, payload: { admin_note: note.trim() || null } })}
                />
              </td>
              <td>
                <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => confirmRemove(row)} aria-label={`Hapus pengajuan ${row.ticket_code}`} disabled={remove.isPending}>
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
