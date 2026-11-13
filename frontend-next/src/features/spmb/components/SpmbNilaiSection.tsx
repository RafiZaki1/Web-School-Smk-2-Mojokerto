"use client";

import PageHeading from "@/shared/components/layout/PageHeading";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { KODE_JURUSAN } from "../constants/spmb-data";
import type { SpmbNilaiBaris } from "../constants/spmb-video-script";
import SpmbKalkulator from "./SpmbKalkulator";
import { SpmbHighlightCards, SpmbSupportingTables } from "./SpmbKomposisiCards";

const th = "px-4 py-4 text-left text-xs font-bold tracking-[0.06em] text-muted uppercase sm:px-6";
const td = "px-4 py-4 text-sm text-ink sm:px-6 sm:text-[15px]";
const num = `${td} whitespace-nowrap font-mono tabular-nums`;

export default function SpmbNilaiSection({ nilai }: { nilai: SpmbNilaiBaris[] }) {
  const { t } = useTranslation();

  return (
    <section id="nilai-prestasi-akademik" className="mt-14 lg:mt-[100px]">
      <PageHeading
        size="xl"
        tone="blue"
        eyebrow="Informasi Nilai & Komposisi PPDB / SPMB"
        title="Sebaran Nilai Jalur Prestasi Akademik SMK Negeri Mojokerto"
        description="Nilai rata-rata pendaftar yang masuk ke SMK Negeri di wilayah Mojokerto (termasuk SMKN 2 Kota Mojokerto) pada jalur prestasi akademik umumnya berkisar antara 70,00 sampai 80,00, dengan sangat sedikit pendaftar yang memiliki nilai di atas 90,00."
      />

      <SpmbHighlightCards />

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-card shadow-xs">
        <div className="border-b border-line bg-surface-alt px-5 py-4 sm:px-6">
          <h3 className="text-base font-bold text-heading sm:text-lg">
            {t("Tabel Rincian Nilai Pendaftar per Kompetensi Keahlian (SMKN 2 Kota Mojokerto)")}
          </h3>
          <p className="mt-0.5 text-xs text-muted sm:text-sm">
            {t("Seluruh kompetensi keahlian memiliki rata-rata nilai gabungan di rentang 70,00–80,00 dengan pendaftar > 90,00 yang sangat sedikit.")}
          </p>
        </div>

        {/* Mobile: tiap kompetensi tampil sebagai kartu agar tidak perlu geser ke samping */}
        <ul className="divide-y divide-line md:hidden">
          {nilai.map((row) => {
            const badge = KODE_JURUSAN[row.kompetensi] ?? { kode: "SMK", tone: "bg-tint text-primary" };
            return (
              <li key={row.kompetensi} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="flex min-w-0 items-start gap-2.5 text-sm font-semibold text-heading">
                    <span className={`inline-flex shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold ${badge.tone}`}>{badge.kode}</span>
                    <span>{t(row.kompetensi)}</span>
                  </p>
                  <span className="shrink-0 rounded-md bg-primary/10 px-2.5 py-1 font-mono text-sm font-bold text-primary tabular-nums">{row.rata}</span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                  <div>
                    <dt className="text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">{t("Rata-rata Rapor (60%)")}</dt>
                    <dd className="mt-0.5 font-mono text-ink tabular-nums">{row.rapor}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">{t("Rata-rata TKA (40%)")}</dt>
                    <dd className="mt-0.5 font-mono text-ink tabular-nums">{row.tka}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">{t("Rentang (Min – Maks)")}</dt>
                    <dd className="mt-0.5 font-mono whitespace-nowrap text-ink tabular-nums">
                      {row.terendah} – <span className="font-semibold text-heading">{row.tertinggi}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">{t("Nilai > 90,00")}</dt>
                    <dd className={`mt-0.5 font-semibold ${Number(row.di_atas_90) > 0 ? "text-sun-ink" : "text-muted"}`}>
                      {Number(row.di_atas_90) > 0 ? `${row.di_atas_90} ${t("pendaftar")}` : t("0 (Tidak ada)")}
                    </dd>
                  </div>
                </dl>
              </li>
            );
          })}
          <li className="bg-tint/60 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-heading">{t("Rata-Rata SMKN 2 Kota Mojokerto")}</p>
              <span className="shrink-0 rounded-md bg-primary px-2.5 py-1 font-mono text-sm font-bold text-white tabular-nums">75,24</span>
            </div>
            <p className="mt-2 font-mono text-xs text-body tabular-nums">
              {t("Rapor")} 83,98 · TKA 62,12 · 68,20 – 91,24
            </p>
            <p className="mt-1 text-xs font-semibold text-primary">{t("Sangat sedikit (3 siswa)")}</p>
          </li>
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[740px] border-collapse">
            <thead className="border-b border-line bg-surface-alt/60">
              <tr>
                <th scope="col" className={`${th} w-[28%]`}>{t("Kompetensi Keahlian")}</th>
                <th scope="col" className={th}>{t("Rata-rata Rapor (60%)")}</th>
                <th scope="col" className={th}>{t("Rata-rata TKA (40%)")}</th>
                <th scope="col" className={th}>{t("Nilai Gabungan")}</th>
                <th scope="col" className={th}>{t("Rentang (Min – Maks)")}</th>
                <th scope="col" className={th}>{t("Nilai > 90,00")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {nilai.map((row) => {
                const badge = KODE_JURUSAN[row.kompetensi] ?? { kode: "SMK", tone: "bg-tint text-primary" };
                const angkaGabungan = parseFloat(String(row.rata).replace(",", ".")) || 75;
                const persenBar = Math.min(100, Math.max(20, ((angkaGabungan - 60) / 40) * 100));

                return (
                  <tr key={row.kompetensi} className="transition-colors hover:bg-tint/35">
                    <td className={`${td} font-semibold text-heading`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`inline-flex shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${badge.tone}`}>
                          {badge.kode}
                        </span>
                        <span>{t(row.kompetensi)}</span>
                      </div>
                    </td>
                    <td className={num}>{row.rapor}</td>
                    <td className={num}>{row.tka}</td>
                    <td className={num}>
                      <div className="flex items-center gap-2.5">
                        <span className="rounded-md bg-primary/10 px-2.5 py-1 font-bold text-primary">
                          {row.rata}
                        </span>
                        <span className="hidden h-2 w-20 overflow-hidden rounded-full bg-tint-strong lg:inline-block">
                          <span className="block h-full rounded-full bg-primary" style={{ width: `${persenBar}%` }} />
                        </span>
                      </div>
                    </td>
                    <td className={num}>
                      <span className="text-muted">{row.terendah}</span>
                      <span className="mx-1.5 text-muted">–</span>
                      <span className="font-semibold text-heading">{row.tertinggi}</span>
                    </td>
                    <td className={td}>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${
                          Number(row.di_atas_90) > 0 ? "bg-sun/30 text-sun-ink" : "bg-surface text-muted"
                        }`}
                      >
                        {Number(row.di_atas_90) > 0
                          ? `${row.di_atas_90} ${t("pendaftar")}`
                          : t("0 (Tidak ada)")}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-tint/60 font-bold">
                <td className={`${td} font-bold text-heading`}>{t("Rata-Rata SMKN 2 Kota Mojokerto")}</td>
                <td className={num}>83,98</td>
                <td className={num}>62,12</td>
                <td className={num}>
                  <span className="rounded-md bg-primary px-2.5 py-1 text-white">75,24</span>
                </td>
                <td className={num}>68,20 – 91,24</td>
                <td className={td}>
                  <span className="text-xs font-semibold text-primary">
                    {t("Sangat sedikit (3 siswa)")}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <SpmbKalkulator />

      <SpmbSupportingTables />
    </section>
  );
}
