"use client";

import { useState } from "react";
import { CalendarDays, Trophy } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import TabButtons from "@/shared/components/ui/TabButtons";
import Image from "next/image";
import Link from "next/link";
import type { Berita } from "@/features/berita";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { localizeDate } from "@/shared/lib/i18n/date";
import { OrnamentFlower, OrnamentSparkle, OrnamentWave } from "@/shared/components/ui/Ornaments";

function CategoryLabel({ category }: { category: string }) {
  const { t } = useTranslation();
  const isPrestasi = category === "Prestasi";
  return (
    <p
      className={`flex items-center gap-1.5 text-[11px] font-bold ${
        isPrestasi ? "text-sun-ink" : "text-primary"
      }`}
    >
      {isPrestasi && <Trophy size={13} strokeWidth={2.5} aria-hidden="true" />}
      {t(category)}
    </p>
  );
}

function ArticleDate({ date, tone = "text-white/85" }: { date: string; tone?: string }) {
  const { locale } = useTranslation();
  return (
    <p className={`flex items-center gap-2 text-[13px] font-medium ${tone}`}>
      <CalendarDays size={15} aria-hidden="true" />
      {localizeDate(date, locale)}
    </p>
  );
}

function ArticleCover({
  article,
  className,
  sizes = "(min-width: 1024px) 360px, 50vw",
}: {
  article: Berita;
  className: string;
  sizes?: string;
}) {
  const positionClass = className.includes("absolute") ? "block overflow-hidden" : "relative block overflow-hidden";
  if (article.thumb) {
    return (
      <span className={`${positionClass} ${className}`}>
        <Image src={article.thumb} alt="" fill sizes={sizes} className="object-cover object-center" />
      </span>
    );
  }
  return <div aria-hidden="true" className={`bg-gradient-to-br ${article.gradient} ${className}`} />;
}

export default function BeritaSection({ items = [], categories = [] }: { items?: Berita[]; categories?: string[] }) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const ARTICLES = items.slice(0, 6);
  const CATEGORIES = ["Semua", ...categories];

  const filtered =
    activeCategory === "Semua" ? ARTICLES : ARTICLES.filter((article) => article.category === activeCategory);
  const [featured, ...rest] = filtered;
  const sideArticles = rest.slice(0, 3);

  return (
    <section id="informasi" className="section relative overflow-x-clip pt-0 lg:pt-0">
      <div className="page-container relative">
      <OrnamentSparkle className="absolute top-24 left-[11%] hidden w-6 text-sun lg:block" />
      <OrnamentWave className="absolute top-4 right-[5%] hidden w-28 text-sun lg:block" />
      <OrnamentFlower className="absolute top-20 right-[9%] hidden w-8 text-brand lg:block" />
        <SectionHeader
          title="Berita & Artikel"
          description="Ikuti terus informasi dan berita-berita terbaru tentang SMK Negeri 2 Kota Mojokerto."
        />

        <TabButtons
          tabs={CATEGORIES.map((category) => ({ id: category, label: category }))}
          activeId={activeCategory}
          onChange={setActiveCategory}
          ariaLabel="Kategori berita"
        />

        {featured ? (
          <div
            className={`mt-8 grid gap-6 lg:mt-10 ${
              sideArticles.length ? "lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-stretch" : ""
            }`}
          >
            <article className="group relative isolate flex min-h-[360px] overflow-hidden rounded-3xl bg-navy-deep text-white shadow-[0_18px_40px_-12px_rgba(12,74,104,0.22)] lg:min-h-[500px] lg:rounded-[32px]">
              <ArticleCover
                article={featured}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="absolute inset-0 -z-20 h-full w-full transition duration-500 group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061c29]/95 via-[#061c29]/55 to-black/15"
              />

              <div className="relative z-10 flex w-full flex-col justify-between gap-6 p-6 sm:p-9 lg:p-11">
                <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-sun px-3.5 py-1.5 text-[11px] font-extrabold text-sun-ink shadow-sm">
                  {featured.category === "Prestasi" && <Trophy size={14} strokeWidth={2.5} aria-hidden="true" />}
                  {t(featured.category === "Prestasi" ? "Prestasi Siswa" : featured.category)}
                </span>

                <div className="flex flex-col gap-3.5">
                  <h3 className="max-w-2xl font-heading text-2xl leading-snug font-bold tracking-tight text-white drop-shadow-xs sm:text-3xl lg:text-[32px] lg:leading-[1.28]">
                    <Link href={`/berita/${featured.slug}`} className="after:absolute after:inset-0 hover:underline">
                      {t(featured.title)}
                    </Link>
                  </h3>
                  {featured.excerpt && (
                    <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-[15px]">
                      {t(featured.excerpt)}
                    </p>
                  )}
                  <ArticleDate date={featured.date} />
                </div>
              </div>
            </article>

            {sideArticles.length > 0 && (
              <div className="flex flex-col divide-y divide-line rounded-3xl border border-line bg-card p-2 shadow-[0_10px_30px_-10px_rgba(12,74,104,0.08)] lg:rounded-[32px] lg:p-3">
                {sideArticles.map((article) => (
                  <article
                    key={article.slug}
                    className="group relative flex flex-1 items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-tint/40 sm:gap-5 sm:p-5"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <CategoryLabel category={article.category} />
                      <h3 className="line-clamp-2 font-heading text-base leading-snug font-bold text-heading transition-colors group-hover:text-primary sm:text-lg lg:text-[18px]">
                        <Link href={`/berita/${article.slug}`} className="after:absolute after:inset-0">
                          {t(article.title)}
                        </Link>
                      </h3>
                      <ArticleDate date={article.date} tone="text-muted" />
                    </div>
                    <ArticleCover
                      article={article}
                      sizes="160px"
                      className="h-24 w-28 shrink-0 rounded-2xl border border-line/60 shadow-2xs sm:h-26 sm:w-34 lg:h-24 lg:w-32 xl:h-26 xl:w-36"
                    />
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-line bg-card py-14 text-center text-muted">
            {t("Belum ada berita di kategori ini.")}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button href="/berita" variant="link" withArrow>
            {t("Lihat semua berita")}
          </Button>
        </div>
      </div>
    </section>
  );
}
