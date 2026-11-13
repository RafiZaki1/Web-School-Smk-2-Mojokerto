import { ArrowUpRight, BookOpenCheck, GraduationCap } from "lucide-react";
import {
  ELEARNING,
  ELEARNING_PILLARS,
  E_LEARNING_COURSES_URL,
  E_LEARNING_URL,
} from "@/features/portal-belajar/constants/portal-belajar-data";
import { getTranslator } from "@/shared/lib/i18n/server";

/** Bagian Tentang E-Learning Sekolah beserta 4 pilar pembelajaran dari smkn2mojokerto.my.id. */
export default async function ELearningCard({ className = "" }: { className?: string }) {
  const t = await getTranslator();

  return (
    <section aria-labelledby="tentang-elearning-title" className={`space-y-6 ${className}`}>
      <div className="flex flex-col gap-6 rounded-3xl border border-line bg-card p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-tint text-primary">
            <GraduationCap size={32} aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-full bg-surface px-3 py-1 text-xs font-semibold text-primary">
              {t("Tentang E-Learning Sekolah")}
            </span>
            <h2 id="tentang-elearning-title" className="mt-3 text-2xl leading-snug font-bold text-heading sm:text-[28px]">
              {t("Platform Pembelajaran & Penilaian Daring SMKN 2 Kota Mojokerto")}
            </h2>
            <p className="mt-2.5 max-w-[720px] text-base leading-relaxed text-muted">
              {t(
                "Website {domain} (elearningsmkn2) adalah Learning Management System (LMS) resmi SMK Negeri 2 Kota Mojokerto berbasis Moodle. Seluruh mata pelajaran umum (Normatif & Adaptif), Bimbingan Konseling, Kewirausahaan, hingga mata pelajaran produktif 5 konsentrasi keahlian terintegrasi di dalam portal ini untuk mendukung kegiatan belajar mengajar dan evaluasi semester.",
                { domain: ELEARNING.domain },
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:shrink-0 lg:flex-col lg:items-stretch">
          <a
            href={E_LEARNING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-semibold text-white transition-colors hover:bg-blue-deep"
          >
            {t("Buka Beranda E-Learning")}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a
            href={E_LEARNING_COURSES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-semibold text-heading transition-colors hover:border-brand/45 hover:text-primary"
          >
            <BookOpenCheck size={16} aria-hidden="true" />
            {t("Katalog Kelas & Penilaian")}
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ELEARNING_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article
              key={pillar.id}
              className="flex flex-col rounded-3xl border border-line bg-card p-6 transition-shadow hover:shadow-[0_10px_28px_rgba(8,53,75,0.08)]"
            >
              <span className={` flex h-12 w-12 items-center justify-center rounded-2xl ${pillar.tone}`}>
                <Icon size={24} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-heading">{t(pillar.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(pillar.description)}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
