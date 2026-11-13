"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminButton from "@/shared/components/admin/AdminButton";
import PageTitle from "@/shared/components/admin/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import { getAssetUrl } from "@/shared/lib/http/client";
import { useDeleteDocumentation, useDocumentationsAdmin } from "../hooks/useKemitraanAdmin";
import { formatActivityDate } from "../utils/format-date";
import type { InternshipDocumentation } from "../types/kemitraan.type";
import { DocumentationFormModal } from "./DocumentationFormModal";

type Editing = InternshipDocumentation | null | undefined;

/** Halaman /admin/tu/dokumentasi-pkl: galeri foto kegiatan PKL untuk halaman depan. */
export function DocumentationAdmin() {
  const docs = useDocumentationsAdmin();
  const remove = useDeleteDocumentation();
  const [editing, setEditing] = useState<Editing>(undefined);

  const confirmRemove = (row: InternshipDocumentation) => {
    if (window.confirm(`Hapus dokumentasi "${row.title}"?`)) remove.mutate(row);
  };

  return (
    <div className="grid gap-6">
      <PageTitle
        title="Dokumentasi PKL"
        subtitle="Foto kegiatan PKL siswa yang tampil di beranda dan halaman Kemitraan & PKL."
        action={
          <AdminButton icon={Plus} onClick={() => setEditing(null)}>
            Tambah foto
          </AdminButton>
        }
      />

      <section className="app-card p-5 sm:p-6">
        {docs.isPending ? <LoadingState label="Memuat dokumentasi..." /> : null}
        {docs.isError ? <ErrorState /> : null}
        {docs.data && docs.data.length === 0 ? <EmptyState title="Belum ada dokumentasi PKL" description="Tambah foto kegiatan pertama." /> : null}
        {docs.data && docs.data.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {docs.data.map((row) => (
              <DocumentationTile key={row.id} row={row} onEdit={() => setEditing(row)} onDelete={() => confirmRemove(row)} />
            ))}
          </ul>
        ) : null}
      </section>

      {editing !== undefined ? <DocumentationFormModal documentation={editing} onClose={() => setEditing(undefined)} /> : null}
    </div>
  );
}

function DocumentationTile({ row, onEdit, onDelete }: { row: InternshipDocumentation; onEdit: () => void; onDelete: () => void }) {
  const image = getAssetUrl(row.image);
  return (
    <li className="overflow-hidden rounded-md border border-[#e5e7eb] bg-white">
      <div className="relative aspect-[4/3] bg-[#f1f5f9]">{image ? <Image src={image} alt={row.title} fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover" /> : null}</div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-[#0f172a]">{row.title}</p>
          <span className={`svc-tag shrink-0 ${row.is_published ? "svc-tag--ok" : "svc-tag--neutral"}`}>{row.is_published ? "Tampil" : "Draft"}</span>
        </div>
        <p className="mt-1 text-[13px] text-[#64748b]">{[row.major_label, row.industry_partner, formatActivityDate(row.activity_date)].filter(Boolean).join(" · ") || "Tanpa keterangan"}</p>
        <div className="mt-3 flex justify-end gap-1">
          <button type="button" className="adm-icon-btn" onClick={onEdit} aria-label={`Ubah ${row.title}`}>
            <Pencil size={18} aria-hidden="true" />
          </button>
          <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={onDelete} aria-label={`Hapus ${row.title}`}>
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}
