import { ArrowUpRight, GraduationCap, Users } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import {
  ELEARNING,
  ELEARNING_PILLARS,
  ELEARNING_STATS,
  E_LEARNING_URL,
} from "@/features/portal-belajar";
import { getTranslator } from "@/shared/lib/i18n/server";
import { OrnamentRing, OrnamentSparkle } from "@/shared/components/ui/Ornaments";

/** Bagian e-Learning SMKN 2 Mojokerto & Data Bapak/Ibu Guru di beranda. */
export default async function PortalBelajarSection() {
  const t = await getTranslator();

  return (
    <section id="portal-belajar" className="section">
      <div className="page-container">
        <div className="relative overflow-hidden rounded-[32px] bg-tint p-6 sm:p-10 lg:p-14">
          {/* Ornamen di pojok kartu dan ditaruh lebih dulu, jadi konten (relative) selalu di atasnya. */}
          <OrnamentSparkle className="absolute top-6 right-6 hidden w-8 text-sun lg:block" />
          <OrnamentRing className="absolute -bottom-24 -left-24 w-56 text-card/70" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-[660px]">
              <p className="flex items-center gap-2 text-xs font-bold text-blue sm:text-[13px]">
                <GraduationCap size={18} aria-hidden="true" />
                {t("Portal Pembelajaran Resmi • {domain}", { domain: ELEARNING.domain })}
              </p>
              <h2 className="mt-3 text-3xl leading-tight font-bold text-heading sm:text-4xl">
                {t("e-Learning Sekolah & Data Bapak Ibu Guru")}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
                {t(
                  "Melalui platform e-Learning resmi (smkn2mojokerto.my.id), Bapak dan Ibu Guru SMKN 2 Kota Mojokerto menghadirkan materi pembelajaran, modul praktik, serta penilaian daring yang modern dan terstruktur.",
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href={E_LEARNING_URL} variant="accent">
                {t("Buka E-Learning")}
              </Button>
              <Button href="/portal-belajar#data-guru" variant="outline" withArrow>
                {t("Data Bapak & Ibu Guru")}
              </Button>
            </div>
          </div>

          <dl className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            {ELEARNING_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line/60 bg-card p-4 shadow-[0_2px_10px_rgba(8,53,75,0.05)]"
              >
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{t(stat.label)}</dt>
                <dd className="mt-1 font-heading text-2xl font-extrabold text-primary sm:text-3xl">{stat.value}</dd>
                <p className="mt-1 text-xs leading-snug text-muted">{t(stat.detail)}</p>
              </div>
            ))}
          </dl>

          <ul className="relative mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {ELEARNING_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <li
                  key={pillar.id}
                  className="flex flex-col rounded-2xl border border-transparent bg-card p-5 shadow-[0_2px_10px_rgba(8,53,75,0.06)]"
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${pillar.tone}`}>
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <strong className="text-base font-bold text-heading">{t(pillar.title)}</strong>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{t(pillar.description)}</p>
                </li>
              );
            })}
          </ul>

          <div className="relative mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-card/85 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 text-sm text-body">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tint text-primary">
                <Users size={18} aria-hidden="true" />
              </span>
              <span>
                <strong className="font-bold text-heading">{t("Cari kelas Bapak/Ibu Guru pengampu?")}</strong>{" "}
                {t("Lihat daftar lengkap 50 Bapak & Ibu Guru beserta mata pelajaran dan tautan kelasnya.")}
              </span>
            </div>
            <a
              href="/portal-belajar#data-guru"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              {t("Lihat Direktori Guru")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
