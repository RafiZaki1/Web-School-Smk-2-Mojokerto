"use client";

import type { ReactNode } from "react";
import { StatusBadge } from "@/shared/components/admin/Badge";
import { AdminListPage, RowActions, lastUpdated } from "@/features/admin";
import { PRESTASI_RESOURCE, loadPrestasiAdmin, removePrestasiAdmin } from "../hooks/usePrestasiAdmin";
import type { PrestasiCardItem } from "../types/prestasi.type";

const Muted = ({ children }: { children: ReactNode }) => <span className="mt-0.5 block text-[13px] text-[#64748b]">{children}</span>;

export function PrestasiAdminList() {
  return (
    <AdminListPage<PrestasiCardItem>
      resource={PRESTASI_RESOURCE}
      title="Kelola Prestasi"
      subtitle="Tambah, ubah, atau hapus data prestasi siswa."
      addLabel="Tambah Prestasi"
      addHref="/admin/prestasi/tambah"
      load={loadPrestasiAdmin}
      remove={removePrestasiAdmin}
      metrics={(rows) => [
        { value: rows.length, label: "Total prestasi" },
        { value: rows.filter((row) => ["Nasional", "Internasional"].includes(row.level)).length, label: "Tingkat nasional+" },
        { value: rows.filter((row) => row.status === "Draf").length, label: "Draf belum publish" },
        { value: lastUpdated(rows), label: "Update terakhir" },
      ]}
      searchKeys={["title", "siswa"]}
      searchPlaceholder="Cari prestasi..."
      columns={(requestRemove) => [
        {
          key: "title",
          label: "Prestasi",
          render: (row) => (
            <span className="block max-w-[280px]">
              <span className="font-semibold text-[#0f172a]">{row.title}</span>
              <Muted>{row.date}</Muted>
            </span>
          ),
        },
        {
          key: "siswa",
          label: "Siswa",
          render: (row) => (
            <span>
              {row.siswa}
              <Muted>{row.kelas}</Muted>
            </span>
          ),
        },
        { key: "level", label: "Tingkat" },
        { key: "badge", label: "Predikat" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status ?? "Draf"} /> },
        {
          key: "aksi",
          label: "Aksi",
          render: (row) => <RowActions label={row.title} editHref={`/admin/prestasi/${row.slug}`} onDelete={() => requestRemove(row)} />,
        },
      ]}
    />
  );
}
