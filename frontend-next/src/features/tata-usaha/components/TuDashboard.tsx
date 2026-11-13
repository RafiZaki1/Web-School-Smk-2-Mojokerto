"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MetricGrid } from "@/shared/components/admin/MetricCard";
import PageTitle from "@/shared/components/admin/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import { useTuDashboard } from "../hooks/useTataUsaha";
import type { TuDashboardSummary } from "../types/tata-usaha.type";

const MODE_LABEL: Record<TuDashboardSummary["graduation"]["mode"], string> = {
  draft: "Draft (disembunyikan)",
  timer: "Timer",
  open: "Buka langsung",
};

const RELEASE_FORMAT = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

/** Halaman /admin/tu: angka penting hari ini dan pintasan ke tiap meja kerja TU. */
export function TuDashboard() {
  const summary = useTuDashboard();

  return (
    <div className="grid gap-6">
      <PageTitle title="Ringkasan Tata Usaha" subtitle="Diperbarui otomatis setiap 15 detik." />
      {summary.isPending ? <LoadingState label="Memuat ringkasan..." /> : null}
      {summary.isError ? <ErrorState title="Ringkasan gagal dimuat" /> : null}
      {summary.data ? <DashboardBody data={summary.data} /> : null}
    </div>
  );
}

function DashboardBody({ data }: { data: TuDashboardSummary }) {
  const { graduation, alumni_services: services } = data;
  const releaseInfo =
    graduation.mode === "timer" && graduation.release_at && !graduation.is_open ? `Rilis ${RELEASE_FORMAT.format(new Date(graduation.release_at))} WIB` : graduation.is_open ? "Form cek kelulusan terbuka" : "Form cek kelulusan tertutup";

  return (
    <>
      <MetricGrid
        items={[
          { label: "Layanan alumni menunggu", value: services.pending },
          { label: "Pesan tamu baru", value: data.guest_messages_new },
          { label: "Kunjungan mendatang", value: data.guest_visits_upcoming },
          { label: "Mitra DU/DI aktif", value: data.industry_partners },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <DeskCard href="/admin/tu/kelulusan" title={`Kelulusan angkatan ${graduation.active_year}`} rows={[
          ["Mode pengumuman", MODE_LABEL[graduation.mode]],
          ["Status", releaseInfo],
          ["Siswa terdata", `${graduation.total} (${graduation.passed} lulus, ${graduation.deferred} ditunda)`],
          ["Administrasi belum beres", String(graduation.administration_pending)],
        ]} />
        <DeskCard href="/admin/tu/layanan-alumni" title="Layanan berkas alumni" rows={[
          ["Menunggu", String(services.pending)],
          ["Diproses", String(services.processing)],
          ["Disetujui, belum diambil", String(services.approved)],
          ["Selesai", String(services.completed)],
        ]} />
      </div>
    </>
  );
}

function DeskCard({ href, title, rows }: { href: string; title: string; rows: [string, string][] }) {
  return (
    <section className="app-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold text-[#0f172a]">{title}</h2>
        <Link href={href} className="adm-btn adm-btn--text">
          <span>Buka</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
      <dl className="mt-3 divide-y divide-[#e5e7eb]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-2.5 text-[14px]">
            <dt className="text-[#475569]">{label}</dt>
            <dd className="text-right font-semibold text-[#0f172a]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
