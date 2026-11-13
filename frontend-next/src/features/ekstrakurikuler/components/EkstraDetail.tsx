import { ViewTransition, type CSSProperties } from "react";
import Image from "next/image";
import { CalendarDays, MapPin, Medal, Quote, Trophy, UsersRound, type LucideIcon } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import PageHeading from "@/shared/components/layout/PageHeading";
import Reveal from "@/shared/components/ui/Reveal";
import type { Ekstrakurikuler, EkstraTestimoni } from "../types/ekstrakurikuler.type";
import { getTranslator } from "@/shared/lib/i18n/server";
import { OrnamentSparkle, OrnamentZigzag } from "@/shared/components/ui/Ornaments";

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = { trophy: Trophy, medal: Medal };
const vars = (value: number): CSSProperties => ({ "--i": value }) as CSSProperties;

export async function EkstraHero({ ekstra }: { ekstra: Ekstrakurikuler }) {
  const t = await getTranslator();
  // Pasangan morph dengan panel ekstrakurikuler di beranda
  return (
    <ViewTransition name={`ekstra-${ekstra.id}`} share="ekstra-morph" default="none">
      <section className="relative overflow-hidden rounded-3xl bg-navy-deep text-white lg:rounded-[32px]">
        <span className="enter-ken-burns absolute inset-0 block" aria-hidden="true">
          <Image src={ekstra.image} alt="" fill sizes="100vw" className="object-cover" />
        </span>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,53,75,0.92)_0%,rgba(8,53,75,0.72)_50%,rgba(8,53,75,0.35)_100%)]" />
        <div className="relative flex min-h-[340px] flex-col justify-center px-6 py-10 sm:px-12 lg:min-h-[450px] lg:px-[72px]">
        <OrnamentSparkle className="absolute top-8 right-8 w-7 text-sun sm:top-10 sm:right-12 lg:w-9" />
        <OrnamentSparkle className="absolute top-20 right-20 w-4 text-white/70 sm:top-24 sm:right-24" />
        <OrnamentZigzag className="absolute right-[8%] bottom-10 hidden w-24 text-lime md:block" />
          <span className="enter-up w-fit rounded-full bg-accent px-4 py-1.5 text-sm font-medium tracking-wide uppercase sm:text-base">{t("Ekstrakurikuler")}</span>
          <h1 className="enter-up mt-5 text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl" style={vars(1)}>
            {t(ekstra.name)}
          </h1>
          <p className="enter-up mt-5 max-w-[562px] text-base leading-relaxed text-white/90 sm:text-lg lg:text-[19px] lg:leading-8" style={vars(2)}>
            {t(ekstra.desc)}
          </p>
        </div>
      </section>
    </ViewTransition>
  );
}

export async function EkstraInfoCards({ ekstra }: { ekstra: Ekstrakurikuler }) {
  const t = await getTranslator();
  const items: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "Jadwal latihan", value: ekstra.jadwal, icon: CalendarDays },
    { label: "Lokasi", value: ekstra.lokasi, icon: MapPin },
    { label: "Anggota aktif", value: ekstra.anggota, icon: UsersRound },
  ];
  return (
    <ul className="grid gap-4 sm:grid-cols-3 lg:gap-[46px]">
      {items.map(({ label, value, icon: Icon }, index) => (
        <li
          key={label}
          className="enter-up flex items-center gap-4 rounded-full border border-[var(--color-line)] bg-card px-6 py-4 shadow-[0_4px_14px_rgba(19,27,46,0.05)]"
          style={vars(index + 3)}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft text-accent">
            <Icon size={20} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">{t(label)}</span>
            <span className="block truncate text-base font-semibold text-heading">{t(value)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export async function EkstraTentang({ ekstra }: { ekstra: Ekstrakurikuler }) {
  const t = await getTranslator();
  return (
    <Reveal as="section">
      <PageHeading tone="accent" size="lg" eyebrow={ekstra.tentangLabel} title={ekstra.tentangTitle ?? ""} className="reveal-item" />
      <p className="reveal-item mt-6 max-w-[1008px] text-base leading-relaxed text-[var(--color-body)] sm:text-lg lg:leading-[33px]" style={vars(1)}>
        {t(ekstra.tentang)}
      </p>
    </Reveal>
  );
}

// Foto galeri dengan zoom halus saat disorot
function GalleryPhoto({ src, alt, index, className }: { src: string; alt: string; index: number; className: string }) {
  return (
    <figure className={`reveal-item reveal-zoom group overflow-hidden rounded-3xl bg-soft lg:rounded-[32px] ${className}`} style={vars(index)}>
      <span className="relative block h-full w-full">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105" />
      </span>
    </figure>
  );
}

export async function EkstraGallery({ images = [] }: { images?: string[] }) {
  const t = await getTranslator();
  const [main, second, third, wide] = images;
  return (
    <Reveal as="section" stagger={110}>
      <PageHeading tone="accent" eyebrow="Dokumentasi" title="Momen latihan & Event" className="reveal-item" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-[54px] lg:grid-cols-3 lg:grid-rows-[263px_272px] lg:gap-[27px]">
        {main && <GalleryPhoto src={main} alt={t("Dokumentasi kegiatan")} index={1} className="h-72 sm:row-span-2 sm:h-full" />}
        {second && <GalleryPhoto src={second} alt={t("Dokumentasi latihan")} index={2} className="h-56 sm:h-full" />}
        {third && <GalleryPhoto src={third} alt={t("Dokumentasi acara")} index={3} className="h-56 sm:h-full" />}
        {wide && <GalleryPhoto src={wide} alt={t("Dokumentasi upacara")} index={4} className="h-56 sm:col-span-1 lg:col-span-2 lg:h-full" />}
      </div>
    </Reveal>
  );
}

export async function EkstraPrestasi({ ekstra }: { ekstra: Ekstrakurikuler }) {
  const t = await getTranslator();
  return (
    <Reveal as="section">
      <PageHeading tone="accent" eyebrow="Prestasi" title={ekstra.prestasiTitle} className="reveal-item" />
      <ul className="mt-8 space-y-4 lg:mt-[54px]">
        {ekstra.prestasi.map((item, index) => {
          const Icon = ACHIEVEMENT_ICONS[item.icon] ?? Trophy;
          return (
            <li
              key={item.text}
              className="reveal-item reveal-left flex items-center gap-5 rounded-full border border-[var(--color-line)] bg-card px-6 py-4 lg:px-7 lg:py-[22px]"
              style={vars(index + 1)}
            >
              <span className="reveal-item reveal-pop flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft text-accent lg:h-[54px] lg:w-[54px]" style={vars(index + 3)}>
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="text-[15px] font-semibold text-heading sm:text-base">{t(item.text)}</span>
            </li>
          );
        })}
      </ul>
      <div className="reveal-item mt-6 flex justify-center" style={vars(ekstra.prestasi.length + 1)}>
        <Button href="/prestasi" variant="link" withArrow>
          {t("Lihat semua prestasi {nama}", { nama: t(ekstra.name) })}
        </Button>
      </div>
    </Reveal>
  );
}

export async function EkstraTestimoni({ testimoni }: { testimoni: EkstraTestimoni }) {
  const t = await getTranslator();
  return (
    <Reveal as="figure" className="rounded-3xl bg-soft px-6 py-12 text-center sm:px-12 lg:rounded-[32px] lg:py-[60px]">
      <Quote size={36} className="reveal-item reveal-pop mx-auto rotate-180 fill-accent text-accent" aria-hidden="true" />
      <p className="reveal-item mt-4 text-xs font-bold tracking-[0.08em] text-accent uppercase" style={vars(1)}>
        {t("Kata Anggota")}
      </p>
      <blockquote className="reveal-item mx-auto mt-4 max-w-[880px] text-xl leading-snug font-bold text-heading italic sm:text-2xl lg:text-[26px] lg:leading-[38px]" style={vars(2)}>
        &ldquo;{t(testimoni.quote)}&rdquo;
      </blockquote>
      <figcaption className="reveal-item mt-6 text-base font-semibold text-[var(--color-body)] sm:text-lg" style={vars(3)}>
        {t(testimoni.author)}
      </figcaption>
    </Reveal>
  );
}
