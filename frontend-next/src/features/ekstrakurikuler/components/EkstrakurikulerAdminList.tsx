"use client";

import { StatusBadge } from "@/shared/components/admin/Badge";
import { AdminListPage, RowActions, lastUpdated } from "@/features/admin";
import { EKSTRAKURIKULER_RESOURCE, loadEkstrakurikulerAdmin, removeEkstrakurikulerAdmin } from "../hooks/useEkstrakurikulerAdmin";
import type { Ekstrakurikuler } from "../types/ekstrakurikuler.type";

export function EkstrakurikulerAdminList() {
  return (
    <AdminListPage<Ekstrakurikuler>
      resource={EKSTRAKURIKULER_RESOURCE}
      title="Kelola Ekstrakurikuler"
      subtitle="Tambah, ubah, atau hapus data program ekstra."
      addLabel="Ekstrakurikuler"
      addHref="/admin/ekstrakurikuler/tambah"
      load={loadEkstrakurikulerAdmin}
      remove={removeEkstrakurikulerAdmin}
      metrics={(rows) => [
        { value: rows.length, label: "Total ekstra" },
        { value: rows.filter((row) => row.status === "Aktif").length, label: "Ditampilkan di web" },
        { value: rows.filter((row) => row.status === "Draf").length, label: "Draf belum publish" },
        { value: lastUpdated(rows), label: "Update terakhir" },
      ]}
      searchKeys={["name", "subtitle"]}
      searchPlaceholder="Cari ekstrakurikuler..."
      columns={(requestRemove) => [
        { key: "name", label: "Nama", render: (row) => <span className="font-semibold text-[#0f172a]">{row.name}</span> },
        { key: "subtitle", label: "Fokus" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status ?? "Draf"} /> },
        {
          key: "aksi",
          label: "Aksi",
          render: (row) => <RowActions label={row.name} editHref={`/admin/ekstrakurikuler/${row.id}`} onDelete={() => requestRemove(row)} />,
        },
      ]}
    />
  );
}
