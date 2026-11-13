import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, CalendarDays, Medal, Presentation, UsersRound } from "lucide-react";
import StatCounter from "./StatCounter";
import SambutanMedia from "./SambutanMedia";
import { OrnamentBurst, OrnamentFlower, OrnamentSquiggle } from "@/shared/components/ui/Ornaments";
import { SAMBUTAN } from "../constants/sambutan-data";
import type { HomeStatistics, SambutanContent } from "../types/home.type";
import { getTranslator } from "@/shared/lib/i18n/server";

export default async function SambutanSection({ statistics = {}, sambutan = SAMBUTAN }: { statistics?: HomeStatistics; sambutan?: SambutanContent }) {
  const t = await getTranslator();
  const { nama, jabatan, foto, kutipan, video } = { ...SAMBUTAN, ...sambutan };

  const stats = [
    {
      label: "Siswa Aktif",
      target: statistics?.total_students || 1850,
      suffix: "+",
      icon: <UsersRound size={15} strokeWidth={2.25} />,
    },
    {
      label: "Tenaga Pendidik",
      target: statistics?.total_teachers || 120,
      suffix: "+",
      icon: <Presentation size={15} strokeWidth={2.25} />,
    },
    {
      label: "Tahun Berdiri",
      target: statistics?.established_year || 2014,
      formatThousands: false,
      icon: <CalendarDays size={15} strokeWidth={2.25} />,
    },
    {
      label: "Program Keahlian",
      target: statistics?.total_majors || 5,
      icon: <BookOpen size={15} strokeWidth={2.25} />,
    },
    {
      label: "Alumni Kerja",
      target: statistics?.total_alumni || 1000,
      suffix: "+",
      icon: <BriefcaseBusiness size={15} strokeWidth={2.25} />,
    },
  ];

  return (
    <section id="profil" aria-labelledby="sambutan-title" className="relative isolate overflow-x-clip pt-14 sm:pt-20 lg:pt-28">
      <OrnamentSquiggle className="absolute top-[420px] -right-24 -z-10 hidden w-[260px] text-tint-strong lg:block xl:top-[400px] xl:-right-10 xl:w-[300px]" />
      <OrnamentFlower className="absolute top-24 right-10 -z-10 hidden w-9 text-brand lg:block xl:top-28 xl:right-24 xl:w-11" />

      <div className="page-container">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16">
          <div className="relative mx-auto w-full max-w-[400px] lg:max-w-none">
            <SambutanMedia foto={foto} nama={nama} video={video} />
            <OrnamentFlower className="absolute -top-5 -left-5 z-10 w-14 text-sun sm:-top-8 sm:-left-9 sm:w-20" />
            <OrnamentBurst className="absolute -right-5 -bottom-6 z-10 w-14 rotate-[135deg] text-lime sm:-right-8 sm:-bottom-8 sm:w-[72px]" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-semibold tracking-[0.12em] text-navy-ink uppercase">{t("Sambutan Kepala Sekolah")}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-1 text-[12px] font-bold text-sun-ink">
                <Medal size={13} strokeWidth={2.5} aria-hidden="true" />
                {t("Terakreditasi \"A\"")}
              </span>
            </div>

            <figure className="mt-5 lg:mt-7">
              <span aria-hidden="true" className="block font-heading text-[72px] leading-[0.6] font-bold text-[var(--color-tint-strong)] lg:text-[96px]">
                &ldquo;
              </span>
              <blockquote id="sambutan-title" className="mt-2 font-heading text-[22px] leading-snug font-semibold text-heading sm:text-[28px] lg:text-[34px] lg:leading-[1.25]">
                {t(kutipan)}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4 border-t border-line pt-6">
                <span className="h-10 w-1 rounded-full bg-gold" aria-hidden="true" />
                <span>
                  <span className="block font-heading text-lg font-semibold text-heading">{nama}</span>
                  <span className="block text-[15px] text-muted">{t(jabatan)}</span>
                </span>
              </figcaption>
            </figure>

            <Link href="/sejarah" className="mt-7 inline-flex items-center gap-2 font-semibold text-navy-ink hover:underline">
              {t("Kenali sejarah & perjalanan sekolah")}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ul
          aria-label={t("Sekolah dalam angka")}
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-8 sm:grid-cols-3 lg:mt-16 lg:grid-cols-5 lg:gap-x-0 lg:pt-10"
        >
          {stats.map((stat) => (
            <li key={stat.label} className="lg:border-l lg:border-line lg:px-8 lg:first:border-l-0 lg:first:pl-0">
              <StatCounter {...stat} label={t(stat.label)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
