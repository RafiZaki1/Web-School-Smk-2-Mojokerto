"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, BriefcaseBusiness, CheckCircle2, Eye, GraduationCap, Newspaper, Pencil, PersonStanding, Plus, Trophy } from "lucide-react";
import { adminApi } from "@/lib/api/adminApi";
import { useAdminSession } from "./AdminSession";

const ICONS = { graduation: GraduationCap, trophy: Trophy, run: PersonStanding, news: Newspaper, briefcase: BriefcaseBusiness, pencil: Pencil };

const STATS = [
  { key: "majors", label: "Jurusan", icon: "graduation", tone: "bg-[#5b7cfa] text-white" },
  { key: "achievements", label: "Prestasi", icon: "trophy", tone: "bg-[#4caf50] text-white" },
  { key: "extracurriculars", label: "Ekstrakurikuler", icon: "run", tone: "bg-[#e57373] text-white" },
  { key: "articles", label: "Berita", icon: "news", tone: "bg-[#ffd54f] text-[#745c00]" },
  { key: "jobs", label: "Loker aktif", icon: "briefcase", tone: "bg-[#4fc3f7] text-[#006064]" },
];

const DRAFT_LINKS = [
  { key: "majors", label: "jurusan", href: "/admin/jurusan" },
  { key: "achievements", label: "prestasi", href: "/admin/prestasi" },
  { key: "extracurriculars", label: "ekstrakurikuler", href: "/admin/ekstrakurikuler" },
  { key: "articles", label: "berita", href: "/admin/berita" },
];

export default function AdminDashboard() {
  const { user } = useAdminSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .dashboard()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const todos = data
    ? [
        ...(data.aspirations?.new
          ? [{ href: "/admin/aspirasi", text: `${data.aspirations.new} aspirasi baru belum ditinjau` }]
          : []),
        ...DRAFT_LINKS.filter((item) => data.drafts?.[item.key]).map((item) => ({
          href: item.href,
          text: `${data.drafts[item.key]} ${item.label} masih berstatus draf, belum publish`,
        })),
      ]
    : [];

  return (
    <div className="space-y-8 lg:space-y-[54px]">
      <section className="flex flex-col gap-5 rounded-2xl bg-[linear-gradient(110deg,#5582fb_0%,#2b5bec_55%,#0a309b_100%)] px-6 py-7 text-white sm:flex-row sm:items-center sm:justify-between lg:px-9 lg:py-9">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-[48px] lg:leading-tight">
          Halo, {user?.name ?? "Admin"} <span aria-hidden="true">👋</span>
        </h1>
        <Link
          href="/"
          target="_blank"
          className="inline-flex h-12 w-fit items-center gap-2.5 rounded-xl border border-white/40 bg-white/10 px-6 text-[15px] font-semibold backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <Eye size={18} aria-hidden="true" />
          Lihat website
        </Link>
      </section>

      {error ? (
        <p role="alert" className="rounded-xl bg-[#fee2e2] px-4 py-3 text-[15px] text-[#b91c1c]">
          Gagal memuat ringkasan: {error}
        </p>
      ) : null}

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {STATS.map((stat) => {
          const Icon = ICONS[stat.icon];
          return (
            <li key={stat.key} className={`flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-6 text-center lg:min-h-[157px] ${stat.tone}`}>
              <Icon size={26} aria-hidden="true" />
              <span className="mt-1 text-3xl font-bold lg:text-[36px]">{data ? data.stats[stat.key] : "–"}</span>
              <span className="text-sm font-medium lg:text-[15px]">{stat.label}</span>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-9">
        <section className="app-card p-6 lg:p-7">
          <h2 className="text-xl font-semibold text-[#0f172a] lg:text-[22px]">Aktivitas terbaru</h2>
          <ul className="mt-5">
            {(data?.activities ?? []).map((item) => {
              const Icon = ICONS[item.icon] ?? Pencil;
              return (
                <li key={`${item.text}-${item.time}`} className="flex items-start gap-5 border-b border-[#e2e8f0] py-5 first:pt-0 last:border-b-0 last:pb-0">
                  <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-[#eff3fb] text-[#1d4ed8]">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-base font-medium text-[#1e293b] lg:text-lg">{item.text}</span>
                    <span className="mt-1 block text-[15px] text-[#475569]">
                      {item.time} · {item.module}
                    </span>
                  </span>
                </li>
              );
            })}
            {data && !data.activities?.length ? <li className="text-[15px] text-[#64748b]">Belum ada aktivitas.</li> : null}
            {!data && !error ? <li className="text-[15px] text-[#64748b]">Memuat aktivitas...</li> : null}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="app-card p-6">
            <h2 className="text-xl font-semibold text-[#0f172a]">Perlu tindakan</h2>
            <div className="mt-4 space-y-3">
              {todos.map((todo) => (
                <Link
                  key={todo.href}
                  href={todo.href}
                  className="flex items-start gap-3 rounded-xl border border-[#f4d543] bg-[#fff6dc] px-4 py-3.5 text-[15px] font-semibold text-[#6b5300] transition-colors hover:bg-[#fff0c2]"
                >
                  <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {todo.text}
                </Link>
              ))}
              {data && !todos.length ? (
                <p className="flex items-center gap-2 text-[15px] text-[#15803d]">
                  <CheckCircle2 size={18} aria-hidden="true" />
                  Semua beres, tidak ada yang perlu ditindaklanjuti.
                </p>
              ) : null}
            </div>
          </section>

          <section className="app-card p-6">
            <h2 className="text-xl font-semibold text-[#0f172a]">Akses cepat</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Tambah Prestasi", href: "/admin/prestasi/tambah" },
                { label: "Tambah Berita", href: "/admin/berita/tambah" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-[110px] flex-col items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] px-3 text-center text-base font-medium text-[#334155] transition-colors hover:border-[#2563eb] hover:text-[#2563eb]"
                >
                  <Plus size={20} aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
