"use client";

import PageTitle from "@/shared/components/admin/PageTitle";
import { GuestMessagesPanel } from "./GuestMessagesPanel";
import { GuestVisitsPanel } from "./GuestVisitsPanel";

/** Halaman /admin/tu/buku-tamu: jadwal kunjungan instansi dan kotak pesan pengunjung. */
export function BukuTamuAdmin() {
  return (
    <div className="grid gap-6">
      <PageTitle title="Buku Tamu" subtitle="Kunjungan tamu instansi dan pesan dari pengunjung website." />
      <GuestVisitsPanel />
      <GuestMessagesPanel />
    </div>
  );
}
