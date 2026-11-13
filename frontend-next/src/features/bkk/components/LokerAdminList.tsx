"use client";

import { StatusBadge } from "@/shared/components/admin/Badge";
import { AdminListPage, RowActions, lastUpdated } from "@/features/admin";
import { LOKER_RESOURCE, loadLokerAdmin, removeLokerAdmin } from "../hooks/useLokerAdmin";
import type { Lowongan } from "../types/bkk.type";

const count = (rows: Lowongan[], status: string) => rows.filter((row) => row.status === status).length;

export function LokerAdminList() {
  return (
    <AdminListPage<Lowongan>
      resource={LOKER_RESOURCE}
      title="Kelola Loker & BKK"
      subtitle="Tambah, ubah, atau hapus lowongan kerja yang tampil di halaman BKK."
      addLabel="Tambah Lowongan"
      addHref="/admin/bkk/tambah"
      load={loadLokerAdmin}
      remove={removeLokerAdmin}
      metrics={(rows) => [
        { value: rows.length, label: "Total lowongan" },
        { value: count(rows, "Aktif"), label: "Aktif ditampilkan" },
        { value: count(rows, "Tutup"), label: "Sudah tutup" },
        { value: lastUpdated(rows), label: "Update terakhir" },
      ]}
      searchKeys={["title", "company", "kategori"]}
      searchPlaceholder="Cari lowongan..."
      columns={(requestRemove) => [
        { key: "title", label: "Lowongan", render: (row) => <span className="font-semibold text-[#0f172a]">{row.title}</span> },
        {
          key: "company",
          label: "Perusahaan",
          render: (row) => (
            <span>
              {row.company}
              <span className="mt-0.5 block text-[13px] text-[#64748b]">{row.location}</span>
            </span>
          ),
        },
        { key: "kategori", label: "Kategori" },
        { key: "tutup", label: "Tutup", className: "whitespace-nowrap" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        {
          key: "aksi",
          label: "Aksi",
          render: (row) => <RowActions label={row.title} editHref={`/admin/bkk/${row.slug}`} onDelete={() => requestRemove(row)} />,
        },
      ]}
    />
  );
}
