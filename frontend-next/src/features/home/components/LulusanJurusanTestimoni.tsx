"use client";

import { useState } from "react";
import { Quote } from "lucide-react";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import { LULUSAN_JURUSAN_TESTIMONI } from "@/features/lulusan";
import Image from "next/image";
import { useTranslation } from "@/shared/hooks/useTranslation";

type LulusanJurusanItem = (typeof LULUSAN_JURUSAN_TESTIMONI)[number];

const FILTER_ALL = "semua";
const JURUSAN_FILTER = [
  { value: "RPL", icon: "<>", label: "RPL" },
  { value: "DKV", icon: "🎨", label: "DKV" },
  { value: "APHP", icon: "🌿", label: "APHP" },
  { value: "LPS", icon: "🏦", label: "LPS" },
  { value: "TB", icon: "👩‍🍳", label: "Tata Boga" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

function Avatar({ alumni }: { alumni: LulusanJurusanItem }) {
  if (alumni.photo) {
    return <Image src={alumni.photo} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover object-top" />;
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-tint-strong)] font-heading text-sm font-bold text-navy-ink" aria-hidden="true">
      {initials(alumni.name)}
    </span>
  );
}

function JurusanTestimoniCard({ alumni }: { alumni: LulusanJurusanItem }) {
  const { t } = useTranslation();
  const meta = JURUSAN_FILTER.find((item) => item.value === alumni.jurusan);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-6 shadow-[0_10px_20px_-12px_rgba(19,35,44,0.18)] sm:p-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="rounded-full bg-[var(--color-tint)] px-3 py-1 text-xs font-bold text-navy-ink">
          {meta?.icon} {t("Jurusan {nama}", { nama: t(meta?.label ?? "") })}
        </span>
        <span className="text-sm text-muted">{t("Fokus: {fokus}", { fokus: t(alumni.fokus) })}</span>
      </div>

      <div className="mt-5 flex gap-3">
        <Quote size={28} className="shrink-0 text-navy-ink/30" fill="currentColor" strokeWidth={0} aria-hidden="true" />
        <blockquote className="text-base leading-relaxed font-medium text-body">{t(alumni.testimoni)}</blockquote>
      </div>

      <dl className="mt-6 mb-6 space-y-4 rounded-xl border border-tint-strong bg-tint p-4 sm:p-5">
        <div>
          <dt className="text-xs font-bold tracking-wide text-muted uppercase">🏢 {t("Tempat Kerja / Studi")}</dt>
          <dd className="mt-1 text-sm font-semibold text-heading">{t(alumni.tempat)}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold tracking-wide text-muted uppercase">🎯 {t("Bidang Industri")}</dt>
          <dd className="mt-1 text-sm font-semibold text-heading">{t(alumni.bidang)}</dd>
          <dd className="mt-2">
            <ul className="flex flex-wrap gap-1.5">
              {alumni.keterampilan.map((skill) => (
                <li key={skill} className="rounded-full border border-tint-strong bg-card px-2.5 py-1 text-xs font-medium text-navy-ink">
                  {t(skill)}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex items-center gap-3 border-t border-line pt-5">
        <Avatar alumni={alumni} />
        <div className="min-w-0">
          <p className="font-heading text-base font-bold text-heading">{alumni.name}</p>
          <p className="text-sm text-muted">{t("Angkatan {tahun}", { tahun: alumni.angkatan })}</p>
        </div>
      </div>
    </article>
  );
}

export default function LulusanJurusanTestimoni({ items = LULUSAN_JURUSAN_TESTIMONI }: { items?: LulusanJurusanItem[] }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(FILTER_ALL);
  const visible = filter === FILTER_ALL ? items : items.filter((alumni) => alumni.jurusan === filter);

  const pillClass = (selected: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-navy-ink focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 ${
      selected ? "border-navy bg-navy text-white" : "border-line bg-card text-heading hover:border-navy"
    }`;

  return (
    <div className="mt-20 border-t border-line pt-16 lg:mt-24 lg:pt-20">
      <SectionHeader as="h3" title="Cerita & Testimoni Alumni per Jurusan" />

      <div role="group" aria-label={t("Filter jurusan testimoni")} className="mt-8 flex flex-wrap justify-center gap-2 lg:mt-10">
        <button type="button" aria-pressed={filter === FILTER_ALL} onClick={() => setFilter(FILTER_ALL)} className={pillClass(filter === FILTER_ALL)}>
          {t("Semua Jurusan")}
        </button>
        {JURUSAN_FILTER.map(({ value, icon, label }) => {
          const count = items.filter((alumni) => alumni.jurusan === value).length;
          return (
            <button
              key={value}
              type="button"
              disabled={count === 0}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={pillClass(filter === value)}
            >
              {icon} {t(label)}
            </button>
          );
        })}
      </div>

      {/* Mobile: geser ke samping agar kartu panjang tidak menumpuk memenuhi halaman */}
      <div
        key={filter}
        className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 scrollbar-none md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:mt-10 lg:gap-8"
      >
        {visible.map((alumni) => (
          <div key={alumni.name} className="w-[86%] shrink-0 snap-start md:w-auto">
            <JurusanTestimoniCard alumni={alumni} />
          </div>
        ))}
      </div>
      {visible.length > 1 ? (
        <p className="mt-3 text-center text-xs text-muted md:hidden">{t("Geser untuk melihat {jumlah} cerita alumni", { jumlah: visible.length })}</p>
      ) : null}
    </div>
  );
}
