"use client";

import Link from "next/link";
import { AlertCircle, BriefcaseBusiness, CheckCircle2, Eye, GraduationCap, Newspaper, Pencil, PersonStanding, Plus, Trophy, type LucideIcon } from "lucide-react";
import { useAdminSession } from "@/features/auth";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import { useAdminSummary } from "../hooks/useAdminSummary";
import type { AdminDashboardSummary, DashboardModule } from "../types/dashboard.type";

const ICONS: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  trophy: Trophy,
  run: PersonStanding,
  news: Newspaper,
  briefcase: BriefcaseBusiness,
  pencil: Pencil,
};

const STATS: { key: DashboardModule; label: string; icon: string; tone: string }[] = [
  { key: "majors", label: "Jurusan", icon: "graduation", tone: "bg-[#5b7cfa] text-white" },
  { key: "achievements", label: "Prestasi", icon: "trophy", tone: "bg-[#4caf50] text-white" },
  { key: "extracurriculars", label: "Ekstrakurikuler", icon: "run", tone: "bg-[#e57373] text-white" },
  { key: "articles", label: "Berita", icon: "news", tone: "bg-[#ffd54f] text-[#745c00]" },
  { key: "jobs", label: "Loker aktif", icon: "briefcase", tone: "bg-[#4fc3f7] text-[#006064]" },
];

const DRAFT_LINKS: { key: DashboardModule; label: string; href: string }[] = [
  { key: "majors", label: "jurusan", href: "/admin/jurusan" },
  { key: "achievements", label: "prestasi", href: "/admin/prestasi" },
  { key: "extracurriculars", label: "ekstrakurikuler", href: "/admin/ekstrakurikuler" },
  { key: "articles", label: "berita", href: "/admin/berita" },
];

function buildTodos(data: AdminDashboardSummary): { href: string; text: string }[] {
  return [
    ...DRAFT_LINKS.filter((item) => data.drafts[item.key]).map((item) => ({
      href: item.href,
      text: `${data.drafts[item.key]} ${item.label} masih berstatus draf, belum publish`,
    })),
  ];
}

export default function AdminDashboard() {
  const { user } = useAdminSession();
  const summary = useAdminSummary();
  const data = summary.data;
  const todos = data ? buildTodos(data) : [];

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-11">
      <section className="flex flex-col gap-4 rounded-2xl bg-[linear-gradient(110deg,#5582fb_0%,#2b5bec_55%,#0a309b_100%)] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7 lg:px-9 lg:py-9">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wider text-white/80 uppercase sm:text-sm">Dashboard Pengelola</p>
          <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl lg:text-[42px] lg:leading-tight">
            Halo, {user?.name ?? "Admin"} <span aria-hidden="true">👋</span>
          </h1>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2.5 rounded-xl border border-white/40 bg-white/10 px-5 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/20 sm:h-12 sm:w-fit sm:px-6 sm:text-[15px]"
        >
          <Eye size={18} aria-hidden="true" />
          Lihat website
        </Link>
      </section>

      {summary.isPending ? <LoadingState label="Memuat ringkasan..." /> : null}
      {summary.isError ? (
        <ErrorState title="Gagal memuat ringkasan" description={summary.error instanceof Error ? summary.error.message : undefined} />
      ) : null}

      {data ? (
        <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-6">
          {STATS.map((stat, idx) => {
            const Icon = ICONS[stat.icon] ?? Pencil;
            const isLastOdd = idx === STATS.length - 1;
            return (
              <li
                key={stat.key}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-5 text-center sm:py-6 lg:min-h-[152px] ${
                  isLastOdd ? "col-span-2 sm:col-span-1" : ""
                } ${stat.tone}`}
              >
                <Icon size={24} aria-hidden="true" />
                <span className="mt-1 text-2xl font-bold sm:text-3xl lg:text-[36px]">{data.stats[stat.key] ?? 0}</span>
                <span className="text-xs font-medium sm:text-sm lg:text-[15px]">{stat.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
        <section className="app-card p-5 sm:p-6 lg:p-7">
          <h2 className="text-lg font-semibold text-[#0f172a] sm:text-xl lg:text-[22px]">Aktivitas terbaru</h2>
          {data && data.activities.length === 0 ? <EmptyState title="Belum ada aktivitas." /> : null}
          <ul className="mt-4 sm:mt-5">
            {(data?.activities ?? []).map((item) => {
              const Icon = ICONS[item.icon] ?? Pencil;
              return (
                <li key={`${item.text}-${item.time}`} className="flex items-start gap-3.5 border-b border-[#e2e8f0] py-4 first:pt-0 last:border-b-0 last:pb-0 sm:gap-5 sm:py-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eff3fb] text-[#1d4ed8] sm:h-[52px] sm:w-[52px]">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-sm font-medium text-[#1e293b] sm:text-base lg:text-lg">{item.text}</span>
                    <span className="mt-1 block text-xs text-[#475569] sm:text-[14px]">
                      {item.time} · {item.module}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
          <section className="app-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[#0f172a] sm:text-xl">Perlu tindakan</h2>
            <div className="mt-4 space-y-3">
              {todos.map((todo) => (
                <Link
                  key={todo.href + todo.text}
                  href={todo.href}
                  className="flex items-start gap-3 rounded-xl border border-[#f4d543] bg-[#fff6dc] px-4 py-3.5 text-sm font-semibold text-[#6b5300] transition-colors hover:bg-[#fff0c2] sm:text-[15px]"
                >
                  <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{todo.text}</span>
                </Link>
              ))}
              {data && !todos.length ? (
                <p className="flex items-center gap-2 text-sm text-[#15803d] sm:text-[15px]">
                  <CheckCircle2 size={18} className="shrink-0" aria-hidden="true" />
                  <span>Semua beres, tidak ada yang perlu ditindaklanjuti.</span>
                </p>
              ) : null}
            </div>
          </section>

          <section className="app-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[#0f172a] sm:text-xl">Akses cepat</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Tambah Prestasi", href: "/admin/prestasi/tambah" },
                { label: "Tambah Berita", href: "/admin/berita/tambah" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] px-3 py-3 text-center text-sm font-medium text-[#334155] transition-colors hover:border-[#2563eb] hover:text-[#2563eb] sm:min-h-[110px] sm:text-base"
                >
                  <Plus size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
