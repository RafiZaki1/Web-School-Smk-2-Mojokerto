"use client";

import { useState } from "react";
import { Quote, Star, X } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import Image from "next/image";
import type { Lulusan } from "@/features/lulusan";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { OrnamentCap, OrnamentSparkle } from "@/shared/components/ui/Ornaments";

const FILTER_ALL = "semua";
const JURUSAN_FILTER = [
  { value: "RPL", label: "RPL" },
  { value: "DKV", label: "DKV" },
  { value: "APHP", label: "APHP" },
  { value: "LPS", label: "LPS" },
  { value: "TB", label: "Tata Boga" },
];

function AlumniCard({ alumni }: { alumni: Lulusan }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const hasStory = Boolean(alumni.testimoni || alumni.jalur || alumni.skill?.length);

  return (
    <article
      onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
      className="group relative h-[394px] w-[78vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl bg-[var(--color-navy)] shadow-[0_10px_16px_-4px_rgba(0,0,0,0.1)] sm:w-auto sm:max-w-none"
    >
      <Image
        src={alumni.photo || "/images/sejarah/gedung.jpg"}
        alt={alumni.name}
        fill
        sizes="(min-width: 640px) 300px, 78vw"
        className="object-cover [object-position:center_15%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(72,75,80,0.2)] from-[54%] to-[var(--color-navy)]" />

      <span className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/20 backdrop-blur-sm">
        <Star size={20} fill="#f7d51d" strokeWidth={0} aria-hidden="true" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-heading text-xl font-bold text-white">{alumni.name}</h3>
        <p className="mt-1 text-sm font-bold text-white/85">
          {alumni.jurusan} • {t("Angkatan {tahun}", { tahun: alumni.angkatan })}
        </p>
        <p className="mt-3 rounded-xl border border-white/20 bg-white/10 p-4 text-sm leading-5 font-medium text-white backdrop-blur-sm">
          {t(alumni.karier)}
        </p>
        {hasStory && (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-gold transition group-hover:text-white">
            <Quote size={13} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            {t("Baca Cerita Alumni")}
          </p>
        )}
      </div>

      {hasStory && (
        <>
          {/* Area klik untuk tap di mobile; di atasnya ada panel cerita saat terbuka */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={t("Baca cerita {nama}", { nama: alumni.name })}
            className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
          />

          <div
            aria-hidden={!open}
            className={`absolute inset-0 z-20 flex flex-col overflow-y-auto bg-[var(--color-navy)]/90 p-6 text-white backdrop-blur-md transition duration-500 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 ${
              open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <Quote size={30} className="text-gold" fill="currentColor" strokeWidth={0} aria-hidden="true" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("Tutup cerita")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {alumni.testimoni && <blockquote className="mt-4 text-sm leading-6 font-medium">&ldquo;{t(alumni.testimoni)}&rdquo;</blockquote>}

            <div className="mt-auto space-y-4 pt-5">
              {alumni.jalur && (
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-white/60 uppercase">{t("Jalur karier")}</p>
                  <span className="mt-1.5 inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-ink">{t(alumni.jalur)}</span>
                </div>
              )}

              {alumni.skill?.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-white/60 uppercase">{t("Skill SMK yang terpakai")}</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {alumni.skill.map((skill) => (
                      <li key={skill} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-medium">
                        {t(skill)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </article>
  );
}

export default function LulusanSection({ items = [] }: { items?: Lulusan[] }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(FILTER_ALL);
  const visible = filter === FILTER_ALL ? items : items.filter((alumni) => alumni.jurusan === filter);

  const pillClass = (selected: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-navy-ink focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 ${
      selected ? "border-navy bg-navy text-white" : "border-line bg-card text-heading hover:border-navy"
    }`;

  return (
    <section id="lulusan" className="section relative mt-16 overflow-x-clip bg-surface-alt lg:mt-28">
      <OrnamentCap className="absolute top-20 left-[5%] hidden w-24 -rotate-12 text-tint-strong lg:block xl:w-28" />
      <OrnamentSparkle className="absolute top-20 right-[7%] hidden w-10 text-sun lg:block" />
      <OrnamentSparkle className="absolute top-36 right-[4%] hidden w-5 text-brand lg:block" />
      <OrnamentSparkle className="absolute top-44 right-[9%] hidden w-4 text-lime lg:block" />
      <div className="page-container relative">
        <SectionHeader
          badge="Kebanggaan Kami"
          title="Lulusan terbaik"
          description="Mereka yang membuktikan pendidikan vokasi di SMKN 2 Mojokerto benar-benar membuka jalan karier."
        />

        <div role="group" aria-label={t("Filter jurusan")} className="mt-8 flex flex-wrap justify-center gap-2 lg:mt-10">
          <button type="button" aria-pressed={filter === FILTER_ALL} onClick={() => setFilter(FILTER_ALL)} className={pillClass(filter === FILTER_ALL)}>
            {t("Semua")}
          </button>
          {JURUSAN_FILTER.map(({ value, label }) => {
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
                {t(label)}
              </button>
            );
          })}
        </div>

        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:mt-10 lg:grid-cols-4 lg:gap-9">
          {visible.map((alumni) => (
            <AlumniCard key={alumni.name} alumni={alumni} />
          ))}
        </div>

        <div className="mt-10 flex justify-center lg:mt-12">
          <Button href="/lulusan" withArrow>
            {t("Lihat semua lulusan terbaik")}
          </Button>
        </div>
      </div>
    </section>
  );
}
