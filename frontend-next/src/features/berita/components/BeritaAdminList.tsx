"use client";

import { StatusBadge } from "@/shared/components/admin/Badge";
import { AdminListPage, RowActions, lastUpdated } from "@/features/admin";
import { BERITA_RESOURCE, loadBeritaAdmin, removeBeritaAdmin } from "../hooks/useBeritaAdmin";
import type { Berita } from "../types/berita.type";

export function BeritaAdminList() {
  return (
    <AdminListPage<Berita>
      resource={BERITA_RESOURCE}
      title="Kelola Berita & Artikel"
      subtitle="Tambah, ubah, atau hapus berita dan artikel sekolah."
      addLabel="Tambah Berita"
      addHref="/admin/berita/tambah"
      load={loadBeritaAdmin}
      remove={removeBeritaAdmin}
      metrics={(rows) => [
        { value: rows.length, label: "Total berita" },
        { value: rows.filter((row) => row.status === "Aktif").length, label: "Ditampilkan di web" },
        { value: rows.filter((row) => row.status === "Draf").length, label: "Draf belum publish" },
        { value: lastUpdated(rows), label: "Update terakhir" },
      ]}
      searchKeys={["title", "category"]}
      searchPlaceholder="Cari berita..."
      columns={(requestRemove) => [
        {
          key: "title",
          label: "Berita",
          render: (row) => <span className="line-clamp-2 block max-w-[320px] font-semibold text-[#0f172a]">{row.title}</span>,
        },
        { key: "category", label: "Kategori" },
        { key: "author", label: "Penulis" },
        { key: "date", label: "Tanggal", className: "whitespace-nowrap" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        {
          key: "aksi",
          label: "Aksi",
          render: (row) => <RowActions label={row.title} editHref={`/admin/berita/${row.slug}`} onDelete={() => requestRemove(row)} />,
        },
      ]}
    />
  );
}
