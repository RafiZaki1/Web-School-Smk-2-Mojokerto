"use client";

import Link from "next/link";
import { StatusBadge } from "@/shared/components/admin/Badge";
import { AdminListPage } from "@/features/admin";
import { KUIS_RESOURCE, loadKuisAdmin, removeKuisAdmin } from "../hooks/useKuisAdmin";
import type { AdminKuis } from "../services/kuis.service";

const Muted = ({ children }: { children: React.ReactNode }) => <span className="mt-0.5 block text-[13px] text-[#64748b]">{children}</span>;

const count = (rows: AdminKuis[], status: string) => rows.filter((row) => row.status === status).length;

/** Kode jurusan yang paling sering menjadi hasil akhir kuis. */
function topMajor(rows: AdminKuis[]): string {
  const totals = rows.reduce<Record<string, number>>((acc, row) => {
    if (row.hasilLabel) acc[row.hasilLabel] = (acc[row.hasilLabel] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
}

export function KuisJurusanAdminList() {
  return (
    <AdminListPage<AdminKuis>
      resource={KUIS_RESOURCE}
      title="Log Kuis Jurusan"
      subtitle="Lihat jawaban calon siswa, hasil pencocokan sistem, dan koreksi rekomendasinya."
      load={loadKuisAdmin}
      remove={removeKuisAdmin}
      metrics={(rows) => [
        { value: rows.length, label: "Total pengisi" },
        { value: count(rows, "Baru"), label: "Belum ditinjau" },
        { value: count(rows, "Ditinjau"), label: "Sudah ditinjau" },
        { value: topMajor(rows), label: "Jurusan terbanyak" },
      ]}
      searchKeys={["nama", "email", "kode", "hasilLabel"]}
      searchPlaceholder="Cari nama, email, kode, atau jurusan..."
      columns={(requestRemove) => [
        {
          key: "nama",
          label: "Pengisi",
          render: (row) => (
            <span className="flex items-start gap-3">
              {row.status === "Baru" ? <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#dc2626]" aria-label="Baru" /> : <span className="w-2 shrink-0" />}
              <span>
                <span className={row.adaNama ? "font-semibold text-[#0f172a]" : "font-medium text-[#64748b] italic"}>{row.nama}</span>
                <Muted>{row.email || "Tanpa email"}</Muted>
              </span>
            </span>
          ),
        },
        {
          key: "rekomendasi",
          label: "Rekomendasi Sistem",
          render: (row) => (
            <span>
              <span className="font-semibold text-[#0f172a]">{row.rekomendasiLabel}</span>
              <Muted>
                {row.rekomendasiPersen}% cocok · {row.metode}
              </Muted>
            </span>
          ),
        },
        {
          key: "hasil",
          label: "Hasil Akhir",
          render: (row) =>
            row.koreksi ? (
              <span>
                <span className="font-semibold text-[#0f172a]">{row.hasilLabel}</span>
                <Muted>Dikoreksi admin</Muted>
              </span>
            ) : (
              <span className="text-[#64748b]">Sesuai sistem</span>
            ),
        },
        { key: "tanggal", label: "Tanggal", className: "whitespace-nowrap" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        {
          key: "aksi",
          label: "Aksi",
          render: (row) => (
            <span className="flex items-center gap-3">
              <Link href={`/admin/kuis-jurusan/${row.id}`} className="font-semibold text-[#2563eb] hover:underline">
                Tinjau
              </Link>
              <button type="button" onClick={() => requestRemove(row)} className="text-[14px] font-medium text-[#dc2626] hover:underline">
                Hapus
              </button>
            </span>
          ),
        },
      ]}
    />
  );
}
