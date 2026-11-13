"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminButton from "@/shared/components/admin/AdminButton";
import PageTitle from "@/shared/components/admin/PageTitle";
import SearchInput from "@/shared/components/admin/SearchInput";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import { MAJORS } from "@/shared/constants/school-classes";
import { getAssetUrl } from "@/shared/lib/http/client";
import { useDeleteIndustryPartner, useIndustryPartnersAdmin } from "../hooks/useKemitraanAdmin";
import type { IndustryPartner } from "../types/kemitraan.type";
import { PartnerFormModal } from "./PartnerFormModal";

type Editing = IndustryPartner | null | undefined;

/** Halaman /admin/tu/kemitraan: daftar perusahaan mitra per jurusan. */
export function PartnerAdmin() {
  const partners = useIndustryPartnersAdmin();
  const remove = useDeleteIndustryPartner();
  const [editing, setEditing] = useState<Editing>(undefined);
  const [major, setMajor] = useState("");
  const [search, setSearch] = useState("");

  const keyword = search.trim().toLowerCase();
  const rows = (partners.data ?? []).filter((row) => (!major || row.major_codes.includes(major)) && (!keyword || `${row.name} ${row.city ?? ""}`.toLowerCase().includes(keyword)));

  const confirmRemove = (row: IndustryPartner) => {
    if (window.confirm(`Hapus mitra ${row.name}? Dokumentasi PKL yang terkait tetap tersimpan tanpa nama mitra.`)) remove.mutate(row);
  };

  return (
    <div className="grid gap-6">
      <PageTitle
        title="Mitra DU/DI"
        subtitle="Perusahaan mitra PKL dan rekrutmen, dikelompokkan per jurusan."
        action={
          <AdminButton icon={Plus} onClick={() => setEditing(null)}>
            Tambah mitra
          </AdminButton>
        }
      />

      <section className="app-card p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari nama perusahaan atau kota..." />
          <div role="group" aria-label="Filter jurusan" className="flex flex-wrap gap-2">
            {[{ code: "", label: "Semua" }, ...MAJORS].map((item) => (
              <button key={item.code || "all"} type="button" className="svc-chip" aria-pressed={major === item.code} onClick={() => setMajor(item.code)}>
                {item.code === "" ? "Semua" : item.code === "KULINER" ? "Kuliner" : item.code}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          {partners.isPending ? <LoadingState label="Memuat mitra..." /> : null}
          {partners.isError ? <ErrorState /> : null}
          {partners.data && rows.length === 0 ? <EmptyState title={partners.data.length ? "Tidak ada mitra yang cocok" : "Belum ada mitra"} /> : null}
          {rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="svc-table min-w-[760px]">
                <thead>
                  <tr>
                    <th scope="col">Perusahaan</th>
                    <th scope="col">Jurusan</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="w-[96px] text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <PartnerRow key={row.id} row={row} onEdit={() => setEditing(row)} onDelete={() => confirmRemove(row)} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>

      {editing !== undefined ? <PartnerFormModal partner={editing} onClose={() => setEditing(undefined)} /> : null}
    </div>
  );
}

function PartnerRow({ row, onEdit, onDelete }: { row: IndustryPartner; onEdit: () => void; onDelete: () => void }) {
  const logo = getAssetUrl(row.logo);
  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-16 shrink-0 items-center justify-center rounded-md border border-[#e5e7eb] bg-white">
            {logo ? <Image src={logo} alt="" width={64} height={44} unoptimized className="max-h-9 w-auto object-contain" /> : <span className="text-[11px] text-[#94a3b8]">Tanpa logo</span>}
          </span>
          <span>
            <span className="block font-semibold text-[#0f172a]">{row.name}</span>
            {row.city ? <span className="block text-[13px] text-[#64748b]">{row.city}</span> : null}
          </span>
        </div>
      </td>
      <td className="text-[14px]">{row.major_labels.length ? row.major_labels.join(", ") : <span className="text-[#64748b]">Semua jurusan</span>}</td>
      <td>
        <span className={`svc-tag ${row.is_active ? "svc-tag--ok" : "svc-tag--neutral"}`}>{row.is_active ? "Tampil" : "Disembunyikan"}</span>
      </td>
      <td>
        <div className="flex justify-end gap-1">
          <button type="button" className="adm-icon-btn" onClick={onEdit} aria-label={`Ubah ${row.name}`}>
            <Pencil size={18} aria-hidden="true" />
          </button>
          <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={onDelete} aria-label={`Hapus ${row.name}`}>
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
}
