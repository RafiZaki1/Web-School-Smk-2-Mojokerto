import Image from "next/image";
import { ArrowDown, ArrowUpRight, LogIn, ShieldCheck } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import {
  ELEARNING,
  ELEARNING_STATS,
  E_LEARNING_LOGIN_URL,
  E_LEARNING_URL,
} from "@/features/portal-belajar/constants/portal-belajar-data";
import { getTranslator } from "@/shared/lib/i18n/server";
import { OrnamentBook, OrnamentSparkle } from "@/shared/components/ui/Ornaments";

/** Banner /portal-belajar: informasi utama e-Learning SMKN 2 Mojokerto (smkn2mojokerto.my.id) dan ringkasan statistiknya. */
export default async function PortalHero() {
  const t = await getTranslator();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-navy-deep text-white lg:rounded-[32px]">
      <Image src="/hero-bg.webp" alt="" aria-hidden="true" fill sizes="100vw" className="object-cover" />
      <div
        className="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,53,75,0.95)_0%,rgba(8,53,75,0.85)_55%,rgba(8,53,75,0.68)_100%)]"
        aria-hidden="true"
      />

      <OrnamentBook className="absolute -bottom-10 left-[38%] hidden w-48 -rotate-12 text-white/[0.07] lg:block" />
      <OrnamentSparkle className="absolute top-6 right-6 w-6 text-sun lg:top-8 lg:right-8 lg:w-8" />
      <div className="relative grid gap-10 px-6 py-10 sm:px-12 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14 lg:px-[72px] lg:py-[72px]">
        <div>
          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm lg:px-4 lg:text-sm">
            {t("Portal Pembelajaran Resmi • elearningsmkn2")}
          </span>
          <h1 className="mt-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-[46px]">
            {t("e-Learning SMKN 2 Mojokerto")}
          </h1>
          <p className="mt-4 max-w-[620px] text-base leading-relaxed text-white/85 sm:text-lg lg:leading-[1.6]">
            {t(
              "Dengan platform e-Learning, SMKN 2 Kota Mojokerto berkomitmen memberikan pengalaman belajar yang modern dan efektif untuk menghasilkan SDM yang berkarakter, kompeten, dan siap kerja di era globalisasi.",
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={E_LEARNING_URL} variant="accent" rel="noopener noreferrer">
              {t("Buka E-Learning")}
            </Button>
            <a
              href="#data-guru"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/40 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
            >
              {t("Data Bapak & Ibu Guru")}
              <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>

          <p className="mt-7 flex items-start gap-2.5 text-sm leading-relaxed text-white/80">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-sun" aria-hidden="true" />
            <span>
              {t("Alamat resmi E-Learning:")}{" "}
              <a
                href={E_LEARNING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sun underline decoration-sun/50 underline-offset-4 hover:text-white"
              >
                {ELEARNING.domain}
              </a>
              . {t("Digunakan oleh seluruh Bapak/Ibu Guru dan siswa untuk pembelajaran serta penilaian.")}
            </span>
          </p>
        </div>

        <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md sm:p-6">
          <div className="flex items-center justify-between gap-3 px-1">
            <h2 className="text-xs font-semibold text-white/85">
              {t("Statistik e-Learning Sekolah")}
            </h2>
            <span className="rounded-full bg-sun/20 px-2.5 py-0.5 text-xs font-semibold text-sun">
              {ELEARNING.domain}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3">
            {ELEARNING_STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-card p-4 text-heading shadow-sm">
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{t(stat.label)}</dt>
                <dd className="mt-1 font-heading text-2xl font-extrabold text-primary sm:text-3xl">{stat.value}</dd>
                <p className="mt-1 text-xs leading-snug text-muted">{t(stat.detail)}</p>
              </div>
            ))}
          </dl>

          <a
            href={E_LEARNING_LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-sun px-4 py-3.5 text-sm font-bold text-sun-ink transition-transform hover:brightness-105 motion-safe:hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2.5">
              <LogIn size={18} aria-hidden="true" />
              {t("Login Akun Siswa & Guru di smkn2mojokerto.my.id")}
            </span>
            <ArrowUpRight size={18} aria-hidden="true" className="shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}
