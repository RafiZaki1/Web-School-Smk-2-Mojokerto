"use client";

import type { ReactNode } from "react";
import { AdminListPage, RowActions } from "@/features/admin";
import { LULUSAN_RESOURCE, loadLulusanAdmin, removeLulusanAdmin } from "../hooks/useLulusanAdmin";
import type { Lulusan } from "../types/lulusan.type";

const Muted = ({ children }: { children: ReactNode }) => <span className="mt-0.5 block text-[13px] text-[#64748b]">{children}</span>;

export function LulusanAdminList() {
  return (
    <AdminListPage<Lulusan>
      resource={LULUSAN_RESOURCE}
      title="Kelola Lulusan"
      subtitle="Profil lulusan dan testimoni alumni yang tampil di beranda dan halaman /lulusan."
      addLabel="Tambah Lulusan"
      addHref="/admin/lulusan/tambah"
      load={loadLulusanAdmin}
      remove={removeLulusanAdmin}
      metrics={(rows) => [
        { value: rows.length, label: "Total lulusan" },
        { value: rows.filter((row) => row.featured).length, label: "Lulusan terbaik (beranda)" },
        { value: rows.filter((row) => row.testimoni.trim()).length, label: "Punya testimoni" },
        { value: rows.filter((row) => row.lokasi).length, label: "Lokasi kerja terisi" },
      ]}
      searchKeys={["name", "jurusan", "karier", "lokasi"]}
      searchPlaceholder="Cari nama, jurusan, atau tempat kerja..."
      columns={(requestRemove) => [
        {
          key: "name",
          label: "Lulusan",
          render: (row) => (
            <span>
              <span className="font-semibold text-[#0f172a]">{row.name}</span>
              <Muted>
                {row.jurusan} • {row.angkatan}
              </Muted>
            </span>
          ),
        },
        {
          key: "karier",
          label: "Karier",
          render: (row) => (
            <span className="block max-w-[280px]">
              {row.karier || "-"}
              {row.lokasi ? <Muted>{row.lokasi}</Muted> : null}
            </span>
          ),
        },
        {
          key: "testimoni",
          label: "Testimoni",
          render: (row) => (row.testimoni.trim() ? "Ada" : <span className="text-[#94a3b8]">Belum</span>),
        },
        {
          key: "aksi",
          label: "Aksi",
          render: (row) => <RowActions label={row.name} editHref={`/admin/lulusan/${row.id}`} onDelete={() => requestRemove(row)} />,
        },
      ]}
    />
  );
}
