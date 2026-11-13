import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import PageHero from "@/shared/components/layout/PageHero";
import PageHeading from "@/shared/components/layout/PageHeading";
import { getSejarahContent } from "@/features/sejarah";
import { localizeDate } from "@/shared/lib/i18n/date";
import { getLocale, getTranslator } from "@/shared/lib/i18n/server";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = `${t("Sejarah Sekolah")} - SMKN 2 Kota Mojokerto`;
  const description = t("Sejarah SMKN 2 Mojokerto dari masa ke masa.");
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function SejarahPage() {
  const [{ intro: SEJARAH_INTRO, timeline: SEJARAH_TIMELINE, kepala_sekolah: KEPALA_SEKOLAH }, t, locale] = await Promise.all([
    getSejarahContent(),
    getTranslator(),
    getLocale(),
  ]);

  return (
    <>
      <Navbar variant="light" />
      <main className="relative isolate flex-1 bg-card pt-[100px] font-ui lg:pt-[120px]">
        <div className="page-container">
        <PageOrnaments theme="sejarah" />
          <PageHero badge="Informasi" theme="sejarah" title="Sejarah Sekolah" description="Sejarah SMKN 2 Mojokerto dari masa ke masa." />

          <section className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-[27px] lg:py-[180px]">
            <span className="relative block aspect-[662/456] w-full overflow-hidden rounded-2xl border border-[var(--color-line)] shadow-[0_8px_24px_rgba(0,17,41,0.08)]">
              <Image src={SEJARAH_INTRO.image} alt={t("Gedung SMK Negeri 2 Kota Mojokerto")} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </span>
            <div>
              <PageHeading size="xl" tone="muted" eyebrow={SEJARAH_INTRO.eyebrow} title={SEJARAH_INTRO.title} />
              <p className="mt-4 text-base leading-[1.7] text-[var(--color-body)] lg:text-lg">{localizeDate(t(SEJARAH_INTRO.text), locale)}</p>
              <dl className="mt-8 grid grid-cols-3 gap-3 lg:gap-4">
                {SEJARAH_INTRO.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse rounded-2xl bg-surface px-3 py-4 text-center lg:px-5 lg:py-6">
                    <dt className="mt-1 text-xs text-[var(--color-body)] lg:text-sm">{t(stat.label)}</dt>
                    <dd className="text-2xl font-bold text-navy-deep-ink lg:text-4xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <dl className="mt-8 divide-y divide-[var(--color-line)] rounded-2xl border border-[var(--color-line)]">
                {SEJARAH_INTRO.awal.map((item) => (
                  <div key={item.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[170px_1fr] sm:gap-4 lg:px-5">
                    <dt className="text-sm font-semibold text-navy-deep-ink">{t(item.label)}</dt>
                    <dd className="text-sm text-[var(--color-body)]">{localizeDate(t(item.value), locale)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>

        <section className="bg-surface-alt py-16 lg:py-[100px]">
          <div className="page-container">
            <PageHeading size="xl" tone="muted" align="center" eyebrow="Perjalanan kami" title="Jejak langkah dari masa ke masa" />
            <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:mt-[90px] lg:grid-cols-4 lg:gap-8 lg:px-[54px] lg:before:absolute lg:before:top-[9px] lg:before:right-[54px] lg:before:left-[54px] lg:before:h-0.5 lg:before:bg-line">
              {SEJARAH_TIMELINE.map((item) => (
                <li key={item.title} className="relative text-center">
                  <span
                    className={`relative mx-auto block h-3 w-3 rounded-full ${item.highlight ? "bg-[#e9c349]" : "bg-[#5a86ff]"}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`mt-6 inline-flex rounded-full px-3 py-0.5 text-sm font-bold ${
                      item.highlight ? "bg-[#ffdf8f] text-[#241a00]" : "bg-[#d5e3ff] text-navy-deep dark:bg-tint dark:text-navy-deep-ink"
                    }`}
                  >
                    {t(item.year)}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-navy-deep-ink sm:text-2xl lg:text-[26px]">{t(item.title)}</h3>
                  <p className="mx-auto mt-2 max-w-[290px] text-sm leading-relaxed text-[var(--color-body)] lg:text-base">{localizeDate(t(item.text), locale)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="page-container py-16 lg:py-[150px]">
          <PageHeading size="xl" tone="muted" align="center" eyebrow="Kepemimpinan" title="Kepala sekolah dari masa ke masa" />
          <ul className="mt-10 flex flex-wrap justify-center gap-12 lg:gap-16">
            {KEPALA_SEKOLAH.map((item) => (
              <li key={item.nama} className="max-w-[280px] text-center">
                {item.foto ? (
                  <Image
                    src={item.foto}
                    alt={t("Kepala sekolah {nama}", { nama: item.nama })}
                    width={144}
                    height={144}
                    className="mx-auto h-36 w-36 rounded-full border-2 border-card object-cover shadow-[0_8px_20px_rgba(0,17,41,0.15)]"
                  />
                ) : (
                  <span className="mx-auto block h-36 w-36 rounded-full bg-gradient-to-br from-[var(--color-navy-deep)] to-[var(--color-navy-deep)] shadow-[0_8px_20px_rgba(0,17,41,0.15)]" aria-hidden="true" />
                )}
                <p className="mt-4 text-sm font-bold text-navy-deep-ink lg:text-base">{item.nama}</p>
                <p className="text-sm text-[var(--color-body)]">{t(item.periode)}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">{t(item.keterangan)}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
