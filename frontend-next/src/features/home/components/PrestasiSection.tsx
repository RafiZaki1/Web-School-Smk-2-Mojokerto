import Image from "next/image";
import Link from "next/link";
import { Trophy } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import type { PrestasiCardItem } from "@/features/prestasi";
import { localizeDate } from "@/shared/lib/i18n/date";
import { getLocale, getTranslator } from "@/shared/lib/i18n/server";
import { OrnamentBurst, OrnamentRing, OrnamentSparkle } from "@/shared/components/ui/Ornaments";

export default async function PrestasiSection({ items = [] }: { items?: PrestasiCardItem[] }) {
  const [t, locale] = await Promise.all([getTranslator(), getLocale()]);
  // Prestasi bergambar terbaru jadi kartu utama, sisanya linimasa
  const featured = items.find((item) => item.image) ?? items[0];
  const timeline = items.filter((item) => item !== featured).slice(0, 4);

  if (!featured) return null;

  return (
    <section id="prestasi" className="section relative overflow-x-clip">
      <div className="page-container relative">
      <OrnamentSparkle className="absolute top-20 left-[6%] hidden w-12 text-sun lg:block" />
      <OrnamentSparkle className="absolute top-40 left-[10%] hidden w-6 text-brand lg:block" />
      <OrnamentRing className="absolute top-16 right-[4%] hidden w-28 text-tint-strong lg:block" />
      <OrnamentBurst className="absolute top-12 right-[11%] hidden w-12 -rotate-[20deg] text-sun lg:block" />
        <SectionHeader
          title="Prestasi yang terus tumbuh"
          description="Deretan penghargaan siswa SMKN 2 Kota Mojokerto di ajang lokal, nasional, hingga internasional."
        />

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,673px)_1fr] lg:gap-[72px]">
          <article className="relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-3xl p-6 text-white sm:min-h-[460px] sm:p-10 lg:min-h-[558px] lg:rounded-[36px] lg:p-[54px]">
            <Image src={featured.image || "/prestasi-utama.webp"} alt={t(featured.title)} fill sizes="(min-width: 1024px) 673px, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,53,75,0.9)] via-[rgba(8,53,75,0.71)] via-25% to-transparent to-60%" />

            <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-gold px-[18px] py-3 text-[15px] font-bold tracking-wide text-gold-ink">
              <Trophy size={16} strokeWidth={2.25} aria-hidden="true" />
              {t(featured.badge)}
            </span>

            <div className="relative">
              <h3 className="font-heading text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl lg:leading-[1.3]">
                <Link href={`/prestasi/${featured.slug}`} className="hover:underline">
                  {t(featured.title)}
                </Link>
              </h3>
              <p className="mt-2 text-[15px] text-[#fff8f8] sm:text-lg">{t(featured.subtitle)}</p>
            </div>
          </article>

          <ol className="relative space-y-8 pl-12 before:absolute before:top-2.5 before:bottom-2 before:left-3 before:w-0.5 before:bg-accent/30 lg:space-y-11 lg:pl-[45px]">
            {timeline.map((item) => (
              <li key={item.title} className="relative">
                <span
                  className="absolute top-px -left-12 flex h-[27px] w-[27px] items-center justify-center rounded-full border-[4.5px] border-accent bg-[#283044] lg:-left-[45px]"
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                <p className="text-[13px] font-bold text-heading uppercase">{localizeDate(item.date, locale)}</p>
                <h3 className="mt-1 font-heading text-xl leading-snug font-bold text-accent sm:text-2xl lg:text-[27px] lg:leading-[1.4]">
                  <Link href={`/prestasi/${item.slug}`} className="hover:underline">
                    {t(item.cardTitle)}
                  </Link>
                </h3>
                <p className="mt-1 text-[15px] text-heading sm:text-lg">{t(item.subtitle)}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/prestasi" variant="link" withArrow>
            {t("Lihat semua prestasi")}
          </Button>
        </div>
      </div>
    </section>
  );
}
