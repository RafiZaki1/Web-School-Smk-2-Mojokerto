"use client";

import { CalendarClock, FilePlus2, LayoutGrid, ReceiptText, UserCog, Wallet, type LucideIcon } from "lucide-react";
import AdminButton from "@/shared/components/admin/AdminButton";
import PageTitle from "@/shared/components/admin/PageTitle";
import { useBankMiniAkses } from "../hooks/useBankMiniAkses";
import type { BankMiniTujuan } from "../types/bank-mini.type";

const HALAMAN: { tujuan: BankMiniTujuan; judul: string; keterangan: string; icon: LucideIcon }[] = [
  { tujuan: "pembayaran", judul: "Pembayaran Masuk", keterangan: "Log semua transaksi. Setujui manual, batalkan, atau cabut pelunasan.", icon: ReceiptText },
  { tujuan: "monitoring", judul: "Monitoring Kelas", keterangan: "Status SPP per kelas dan per siswa, serta catat bayar tunai.", icon: LayoutGrid },
  { tujuan: "laporan", judul: "Laporan Kas", keterangan: "Uang masuk tunai dan online pada rentang tanggal.", icon: Wallet },
  { tujuan: "tagihan", judul: "Generate Tagihan", keterangan: "Buat tagihan Juli sampai Juni untuk siswa aktif.", icon: FilePlus2 },
  { tujuan: "wali-kelas", judul: "Akun Wali Kelas", keterangan: "Buat dan atur akun wali kelas tiap kelas.", icon: UserCog },
  { tujuan: "layanan", judul: "Buka / Tutup Layanan", keterangan: "Tutup portal siswa sementara dan tulis pengumumannya.", icon: CalendarClock },
];

/** Halaman /admin/bank-mini: pintu admin utama ke panel Bank Mini tanpa login ulang. */
export function BankMiniAkses() {
  const akses = useBankMiniAkses();

  return (
    <div className="grid gap-6">
      <PageTitle title="Bank Mini & SPP" subtitle="Sebagai admin kamu punya akses penuh ke panel Bank Mini. Pilih halaman yang ingin dibuka." />

      {akses.isError ? (
        <p role="alert" className="app-card border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Panel Bank Mini belum bisa dibuka. Coba lagi beberapa saat lagi.
        </p>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {HALAMAN.map(({ tujuan, judul, keterangan, icon: Icon }) => (
          <li key={tujuan} className="app-card flex flex-col gap-3 p-5">
            <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
            <div className="flex-1">
              <h2 className="text-base font-semibold text-slate-900">{judul}</h2>
              <p className="mt-1 text-sm text-slate-600">{keterangan}</p>
            </div>
            <AdminButton variant="ghost" loading={akses.isPending && akses.variables === tujuan} disabled={akses.isPending} onClick={() => akses.mutate(tujuan)} className="self-start">
              Buka {judul}
            </AdminButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
