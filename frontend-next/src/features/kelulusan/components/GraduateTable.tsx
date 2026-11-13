"use client";

import { Pencil, Trash2 } from "lucide-react";
import { AutoSaveSelect, AutoSaveText } from "@/shared/components/admin/AutoSaveField";
import { ADMINISTRATION_OPTIONS, GRADUATION_STATUS_OPTIONS } from "../constants/kelulusan-keys";
import { useAutoSaveGraduate, useDeleteGraduate } from "../hooks/useGraduationAdmin";
import { formatBirthDate } from "../utils/countdown";
import type { Graduate, GraduatePayload } from "../types/kelulusan.type";

interface GraduateTableProps {
  rows: Graduate[];
  onEdit: (graduate: Graduate) => void;
}

/**
 * Tabel kerja kelulusan. Status, administrasi, dan catatan tersimpan sendiri saat diubah;
 * data identitas diubah lewat tombol Ubah agar NISN tidak tergeser tanpa sengaja.
 */
export function GraduateTable({ rows, onEdit }: GraduateTableProps) {
  const autoSave = useAutoSaveGraduate();
  const remove = useDeleteGraduate();
  const save = (id: number, payload: GraduatePayload) => autoSave.mutateAsync({ id, payload });

  const confirmRemove = (row: Graduate) => {
    if (window.confirm(`Hapus data ${row.full_name} (${row.nisn})?`)) remove.mutate(row.id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="svc-table min-w-[1040px]">
        <thead>
          <tr>
            <th scope="col">Siswa</th>
            <th scope="col">Kelas</th>
            <th scope="col" className="w-[150px]">
              Kelulusan
            </th>
            <th scope="col" className="w-[150px]">
              Administrasi
            </th>
            <th scope="col">Catatan untuk siswa</th>
            <th scope="col" className="w-[96px] text-right">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <span className="block font-semibold text-[#0f172a]">{row.full_name}</span>
                <span className="svc-code block text-[13px] text-[#64748b]">{row.nisn}</span>
                <span className="block text-[13px] text-[#64748b]">Lahir {formatBirthDate(row.birth_date)}</span>
              </td>
              <td className="whitespace-nowrap">{row.class_name}</td>
              <td>
                <AutoSaveSelect label={`Status kelulusan ${row.full_name}`} value={row.status} options={GRADUATION_STATUS_OPTIONS} onSave={(status) => save(row.id, { status: status as Graduate["status"] })} />
              </td>
              <td>
                <AutoSaveSelect
                  label={`Status administrasi ${row.full_name}`}
                  value={row.administration_status}
                  options={ADMINISTRATION_OPTIONS}
                  onSave={(value) => save(row.id, { administration_status: value as Graduate["administration_status"] })}
                />
              </td>
              <td className="min-w-[260px]">
                <AutoSaveText label={`Catatan ${row.full_name}`} value={row.note} multiline maxLength={2000} placeholder="Tanpa catatan" onSave={(note) => save(row.id, { note: note.trim() || null })} />
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <button type="button" className="adm-icon-btn" onClick={() => onEdit(row)} aria-label={`Ubah data ${row.full_name}`}>
                    <Pencil size={18} aria-hidden="true" />
                  </button>
                  <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => confirmRemove(row)} aria-label={`Hapus ${row.full_name}`} disabled={remove.isPending}>
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
