"use client";

import { Award, Calculator, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { SPMB_RENTANG_SEBARAN, SPMB_SIMULASI_GABUNGAN } from "../constants/spmb-data";

const th = "px-4 py-4 text-left text-xs font-bold tracking-[0.06em] text-muted uppercase sm:px-6";
const td = "px-4 py-4 text-sm text-ink sm:px-6 sm:text-[15px]";
const num = `${td} whitespace-nowrap font-mono tabular-nums`;

const PROPORSI_TONE: Record<string, string> = {
  dominan: "bg-primary text-white",
  jarang: "bg-sun/35 text-sun-ink",
  default: "bg-surface text-body",
};

export function SpmbHighlightCards() {
  const { t } = useTranslation();

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/25 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary">{t("Rata-Rata Pendaftar Diterima")}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tint text-primary">
              <TrendingUp size={20} aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 font-heading text-2xl font-extrabold text-heading sm:text-3xl">70,00 – 80,00</p>
          <p className="mt-1.5 text-xs leading-relaxed text-body">
            {t("Kisaran umum nilai gabungan pendaftar SMK Negeri di wilayah Mojokerto (termasuk SMKN 2 Mojokerto).")}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border-2 border-sun/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sun-ink">{t("Komposisi Penilaian")}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sun/25 text-sun-ink">
              <Calculator size={20} aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 font-heading text-2xl font-extrabold text-heading sm:text-3xl">60% : 40%</p>
          <p className="mt-1.5 text-xs leading-relaxed text-body">
            {t("Gabungan 60% nilai rata-rata rapor (semester 1–5) dan 40% nilai Tes Kemampuan Akademik (TKA).")}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border-2 border-line bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted">{t("Pendaftar Nilai > 90,00")}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-navy-ink">
              <Award size={20} aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 font-heading text-2xl font-extrabold text-heading sm:text-3xl">{t("Sangat Sedikit")}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-body">
            {t("Hanya sekitar 1,2% pendaftar yang menembus nilai gabungan di atas 90,00 pada seleksi prestasi akademik.")}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-tint/40 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-heading">
              <Sparkles size={18} className="text-primary" aria-hidden="true" />
              {t("Rumus & Bobot Komposisi Penilaian Jalur Prestasi Akademik")}
            </h3>
            <p className="mt-1 text-xs text-body sm:text-sm">
              {t("Seleksi jalur prestasi akademik menggabungkan nilai rapor sekolah asal dan hasil Tes Kemampuan Akademik (TKA).")}
            </p>
          </div>
          <code className="inline-flex items-center rounded-xl border border-primary/25 bg-card px-4 py-2.5 font-mono text-xs font-bold text-primary shadow-2xs sm:text-sm">
            {t("Nilai Gabungan = (60% × Nilai Rapor) + (40% × Nilai TKA)")}
          </code>
        </div>

        <div className="mt-4">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-card p-0.5 shadow-inner">
            <div className="flex w-[60%] items-center justify-center rounded-l-full bg-primary text-[10px] font-bold text-white">
              60% Rapor
            </div>
            <div className="flex w-[40%] items-center justify-center rounded-r-full bg-sun text-[10px] font-bold text-sun-ink">
              40% TKA
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs font-medium text-body">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              {t("60% Rata-rata Nilai Rapor (Semester 1–5)")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sun" />
              {t("40% Nilai Tes Kemampuan Akademik (TKA)")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function SpmbSupportingTables() {
  const { t } = useTranslation();

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-xs">
        <div className="border-b border-line bg-surface-alt px-5 py-4">
          <h4 className="text-sm font-bold text-heading sm:text-base">
            {t("Distribusi Rentang Nilai Pendaftar SMK Negeri Wilayah Mojokerto")}
          </h4>
        </div>
        <ul className="divide-y divide-line md:hidden">
          {SPMB_RENTANG_SEBARAN.map((item) => (
            <li key={item.rentang} className={`px-5 py-4 ${item.status === "dominan" ? "bg-tint/50" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm font-bold whitespace-nowrap text-heading tabular-nums">{item.rentang}</span>
                <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${PROPORSI_TONE[item.status] ?? PROPORSI_TONE.default}`}>
                  {item.persentase}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-heading">{t(item.kategori)}</p>
              <p className="mt-0.5 text-xs text-muted">{t(item.keterangan)}</p>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[420px] border-collapse">
            <thead className="border-b border-line bg-surface-alt/50">
              <tr>
                <th scope="col" className={th}>{t("Rentang Nilai")}</th>
                <th scope="col" className={th}>{t("Kategori Sebaran")}</th>
                <th scope="col" className={th}>{t("Proporsi")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SPMB_RENTANG_SEBARAN.map((item) => (
                <tr key={item.rentang} className={item.status === "dominan" ? "bg-tint/50" : "hover:bg-tint/25"}>
                  <td className={`${num} font-bold text-heading`}>{item.rentang}</td>
                  <td className={td}>
                    <p className="font-semibold text-heading">{t(item.kategori)}</p>
                    <p className="mt-0.5 text-xs text-muted">{t(item.keterangan)}</p>
                  </td>
                  <td className={num}>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${PROPORSI_TONE[item.status] ?? PROPORSI_TONE.default}`}>
                      {item.persentase}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-xs">
        <div className="border-b border-line bg-surface-alt px-5 py-4">
          <h4 className="text-sm font-bold text-heading sm:text-base">
            {t("Simulasi Perhitungan Nilai Gabungan (60% Rapor + 40% TKA)")}
          </h4>
        </div>
        <ul className="divide-y divide-line md:hidden">
          {SPMB_SIMULASI_GABUNGAN.map((sim) => (
            <li key={sim.gabungan} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted tabular-nums">
                  {t("Rapor (60%)")} <span className="font-semibold text-heading">{sim.rapor}</span> · {t("TKA (40%)")}{" "}
                  <span className="font-semibold text-heading">{sim.tka}</span>
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-body">
                  <CheckCircle2 size={13} className="shrink-0 text-primary" aria-hidden="true" />
                  {t(sim.posisi)}
                </p>
              </div>
              <span className="shrink-0 font-mono text-lg font-bold text-primary tabular-nums">{sim.gabungan}</span>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[420px] border-collapse">
            <thead className="border-b border-line bg-surface-alt/50">
              <tr>
                <th scope="col" className={th}>{t("Rapor (60%)")}</th>
                <th scope="col" className={th}>{t("TKA (40%)")}</th>
                <th scope="col" className={th}>{t("Nilai Gabungan")}</th>
                <th scope="col" className={th}>{t("Posisi Nilai")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SPMB_SIMULASI_GABUNGAN.map((sim) => (
                <tr key={sim.gabungan} className="hover:bg-tint/25">
                  <td className={num}>
                    <span className="font-semibold text-heading">{sim.rapor}</span>
                    <span className="ml-1 text-xs text-muted">({sim.hasilRapor})</span>
                  </td>
                  <td className={num}>
                    <span className="font-semibold text-heading">{sim.tka}</span>
                    <span className="ml-1 text-xs text-muted">({sim.hasilTka})</span>
                  </td>
                  <td className={`${num} font-bold text-primary`}>{sim.gabungan}</td>
                  <td className={td}>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-body">
                      <CheckCircle2 size={13} className="shrink-0 text-primary" aria-hidden="true" />
                      {t(sim.posisi)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
