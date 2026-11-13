"use client";

import Link from "next/link";
import type { Lowongan, LowonganBanner as LowonganBannerData } from "../types/bkk.type";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { localizeDate } from "@/shared/lib/i18n/date";

export function LowonganBanner({ banner, className = "" }: { banner: LowonganBannerData; className?: string }) {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-col items-center justify-center px-6 text-center text-white uppercase ${className}`} style={{ backgroundColor: banner.bg }}>
      <p className="max-w-[240px] text-lg leading-tight font-semibold tracking-[0.08em]">{t(banner.headline)}</p>
      <p className="mt-2 text-[11px] font-medium tracking-[0.14em] text-white/85">{t(banner.sub)}</p>
    </div>
  );
}

export default function LowonganCard({ job }: { job: Lowongan }) {
  const { t, locale } = useTranslation();
  return (
    <Link
      href={`/bkk/lowongan/${job.slug}`}
      className="block overflow-hidden rounded-xl border border-[var(--color-line)] bg-card shadow-[0_1px_3px_rgba(19,35,44,0.08)] transition-shadow hover:shadow-[0_8px_20px_rgba(19,35,44,0.1)]"
    >
      <div className="relative">
        <LowonganBanner banner={job.banner} className="h-[160px] lg:h-[180px]" />
        <span
          className={`absolute top-3 right-3 rounded-full bg-card px-3 py-1 text-xs font-semibold ${job.status === "Tutup" ? "text-[var(--color-muted)]" : "text-[#15803d] dark:text-green-300"}`}
        >
          {t(job.status)}
        </span>
      </div>
      <div className="p-5 lg:px-6 lg:py-5">
        <h2 className="text-lg font-medium text-ink">{t(job.title)}</h2>
        <p className="mt-1 text-[13px] text-[var(--color-body)]">
          {job.company} · {t(job.location)}
        </p>
        <p className="mt-5 text-[13px] text-[var(--color-muted)]">{t("Tutup {tanggal}", { tanggal: localizeDate(job.tutup, locale) })}</p>
      </div>
    </Link>
  );
}
