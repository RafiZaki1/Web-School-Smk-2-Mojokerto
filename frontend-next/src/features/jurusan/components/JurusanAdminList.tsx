"use client";

import Image from "next/image";
import { StatusBadge } from "@/shared/components/admin/Badge";
import { AdminListPage, RowActions, lastUpdated } from "@/features/admin";
import { JURUSAN_RESOURCE, loadJurusanAdmin, removeJurusanAdmin } from "../hooks/useJurusanAdmin";
import type { Jurusan } from "../types/jurusan.type";

export function JurusanAdminList() {
  return (
    <AdminListPage<Jurusan>
      resource={JURUSAN_RESOURCE}
      title="Kelola Jurusan"
      subtitle="Tambah, ubah, atau hapus data program keahlian."
      addLabel="Tambah Jurusan"
      addHref="/admin/jurusan/tambah"
      load={loadJurusanAdmin}
      remove={removeJurusanAdmin}
      metrics={(rows) => [
        { value: rows.length, label: "Total jurusan" },
        { value: rows.filter((row) => row.status === "Aktif").length, label: "Ditampilkan di web" },
        { value: rows.filter((row) => row.status === "Draf").length, label: "Draf belum publish" },
        { value: lastUpdated(rows), label: "Update terakhir" },
      ]}
      searchKeys={["code", "fullName"]}
      searchPlaceholder="Cari jurusan..."
      columns={(requestRemove) => [
        {
          key: "code",
          label: "Kode",
          render: (row) => (
            <span className="flex items-center gap-4">
              <span className="relative block h-[45px] w-[45px] shrink-0 overflow-hidden rounded-lg">
                <Image src={row.image} alt="" fill sizes="45px" className="object-cover object-top" />
              </span>
              <span className="text-base font-semibold text-[#0f172a]">{row.code}</span>
            </span>
          ),
        },
        { key: "fullName", label: "Nama Jurusan", render: (row) => <span className="font-medium">{row.fullName}</span> },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status ?? "Draf"} /> },
        {
          key: "aksi",
          label: "Aksi",
          render: (row) => <RowActions label={row.code} editHref={`/admin/jurusan/${row.id}`} onDelete={() => requestRemove(row)} />,
        },
      ]}
    />
  );
}
