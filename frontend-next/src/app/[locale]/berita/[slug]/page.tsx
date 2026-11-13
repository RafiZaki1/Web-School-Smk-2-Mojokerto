import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, UserRound } from "lucide-react";
import PublicPage from "@/shared/components/layout/PublicPage";
import { BeritaSidebar, getBeritaDetail, getBeritaKategori, getBeritaList, toBeritaTeaser } from "@/features/berita";
import { localizeDate } from "@/shared/lib/i18n/date";
import { getLocale, getTranslator } from "@/shared/lib/i18n/server";

export async function generateStaticParams() {
  return (await getBeritaList()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [berita, t] = await Promise.all([getBeritaDetail(slug), getTranslator()]);
  const title = `${berita ? t(berita.title) : t("Berita")} - SMKN 2 Kota Mojokerto`;
  const description = berita ? t(berita.paragraphs[0]) : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: berita?.hero ? [berita.hero] : undefined },
  };
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [berita, latest, categories, t, locale] = await Promise.all([
    getBeritaDetail(slug),
    getBeritaList(5),
    getBeritaKategori(),
    getTranslator(),
    getLocale(),
  ]);
  if (!berita) notFound();

  const terbaru = latest
    .filter((item) => item.slug !== slug)
    .slice(0, 4)
    .map(toBeritaTeaser);

  return (
    <PublicPage className="bg-card" ornaments="beritaDetail" contentClassName="grid gap-12 lg:grid-cols-[minmax(0,857px)_416px] lg:justify-between">
      <article>
        {berita.hero ? (
          <span className="relative block aspect-[857/432] w-full overflow-hidden rounded-3xl">
            <Image src={berita.hero} alt={t(berita.title)} fill priority sizes="(min-width: 1024px) 857px, 100vw" className="object-cover" />
          </span>
        ) : (
          <div className={`aspect-[857/432] w-full rounded-3xl bg-gradient-to-br ${berita.gradient}`} aria-hidden="true" />
        )}

        <span className="mt-7 inline-flex rounded-md bg-[#ffedd5] px-3 py-1 text-xs font-bold tracking-wide text-[#c2410c] uppercase dark:bg-orange-400/15 dark:text-orange-200">{t(berita.category)}</span>
        <h1 className="mt-4 text-2xl leading-snug font-bold text-ink sm:text-3xl lg:text-[36px] lg:leading-[1.25]">{t(berita.title)}</h1>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-[var(--color-line)] pb-5 text-sm text-[var(--color-body)]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={15} aria-hidden="true" />
            {localizeDate(berita.date, locale)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UserRound size={15} aria-hidden="true" />
            {t(berita.author)}
          </span>
        </p>

        <div className="mt-6 space-y-5 text-base leading-[1.75] text-[var(--color-body)]">
          {berita.paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 32)}`}>{t(paragraph)}</p>
          ))}
        </div>

        {berita.gallery.length > 0 && (
          <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-[17px]">
            {berita.gallery.map((src, index) => (
              <span key={src} className="relative block aspect-square w-full overflow-hidden rounded-2xl">
                <Image src={src} alt={t("Dokumentasi {nomor}", { nomor: index + 1 })} fill sizes="(min-width: 640px) 280px, 33vw" className="object-cover" />
              </span>
            ))}
          </div>
        )}
      </article>

      <BeritaSidebar terbaru={terbaru} kategori={categories} />
    </PublicPage>
  );
}
