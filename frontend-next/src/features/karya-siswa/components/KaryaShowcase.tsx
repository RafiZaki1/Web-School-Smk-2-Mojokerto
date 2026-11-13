import Image from "next/image";
import { Lock, Quote } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import type { Translator } from "@/shared/lib/i18n/translate";
import { KARYA_JURUSAN, type KaryaSiswa } from "../constants/karya-data";
import { KaryaAvatar } from "./KaryaAvatar";
import { KaryaImage } from "./KaryaImage";
import { OrnamentRing, OrnamentSparkle } from "@/shared/components/ui/Ornaments";
import { getJurusanIcons } from "@/shared/components/ui/PageOrnaments";

const hostOf = (url: string) => new URL(url).host.replace(/^www\./, "");

/** Laptop + ponsel berisi tangkapan layar, untuk karya aplikasi. */
function AppMockup({ karya, t }: { karya: KaryaSiswa; t: Translator }) {
  if (karya.media.tipe !== "aplikasi" || !karya.url) return null;

  return (
    <div className="relative mr-[14%] sm:mr-[18%] lg:mt-6">
      <div className="overflow-hidden rounded-xl bg-card shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
        <div className="flex items-center gap-3 border-b border-line bg-surface px-3 py-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md bg-card px-2 py-1 text-[11px] text-muted sm:text-xs">
            <Lock size={11} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{hostOf(karya.url)}</span>
          </span>
          <span className="hidden w-[42px] sm:block" aria-hidden="true" />
        </div>
        <Image
          src={karya.media.desktop}
          alt={t(karya.media.alt)}
          width={1440}
          height={900}
          sizes="(min-width: 1024px) 560px, 90vw"
          className="block h-auto w-full"
        />
      </div>

      <div className="absolute -right-[16%] -bottom-6 w-[30%] rotate-[4deg] rounded-[18px] bg-[#0b0f12] p-[5px] shadow-[0_24px_40px_-10px_rgba(0,0,0,0.6)] ring-1 ring-white/15 transition-transform duration-500 group-hover:rotate-0 sm:-right-[20%] sm:rounded-[22px] sm:p-1.5">
        <Image
          src={karya.media.ponsel}
          alt=""
          width={390}
          height={844}
          sizes="(min-width: 1024px) 170px, 28vw"
          className="block h-auto w-full rounded-[13px] sm:rounded-[16px]"
        />
      </div>
    </div>
  );
}

/** Foto karya berbingkai putih yang sedikit miring, untuk karya non-aplikasi. */
function FotoFrame({ karya }: { karya: KaryaSiswa }) {
  if (karya.media.tipe !== "foto") return null;

  return (
    <div className="relative mx-auto w-full max-w-[560px] -rotate-2 rounded-2xl bg-card p-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:rotate-0 sm:p-2.5 lg:mt-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy">
        <KaryaImage src={karya.media.src} alt={karya.media.alt} jurusan={karya.jurusan} sizes="(min-width: 1024px) 560px, 90vw" />
      </div>
    </div>
  );
}

function MediaPanel({ karya, t }: { karya: KaryaSiswa; t: Translator }) {

  const [, , JurusanOrnament] = getJurusanIcons(karya.jurusan);
  return (
    <div className="relative overflow-hidden rounded-[26px] bg-navy-deep px-5 pt-14 pb-10 sm:px-8 sm:pt-16 sm:pb-12 lg:flex lg:h-full lg:flex-col lg:justify-center lg:px-10">
      <OrnamentRing className="absolute -top-16 -left-16 w-48 text-white/[0.06]" />
      <OrnamentRing className="absolute -right-10 -bottom-24 w-64 text-white/[0.05]" />
      <JurusanOrnament className="absolute bottom-6 left-6 w-14 -rotate-12 text-white/[0.08] sm:w-16" />
      <OrnamentSparkle className="absolute top-6 right-8 w-7 text-sun sm:w-8" />
      <OrnamentSparkle className="absolute top-14 right-16 w-3.5 text-tint-strong sm:top-16 sm:right-20" />
      <span className="absolute top-5 left-5 z-10 inline-flex -rotate-3 items-center rounded-full bg-sun px-3.5 py-1 text-xs font-bold tracking-wide text-sun-ink uppercase shadow-[0_6px_16px_rgba(0,0,0,0.25)] sm:left-8">
        {t(karya.pembuat.asal)}
      </span>

      {karya.media.tipe === "aplikasi" ? <AppMockup karya={karya} t={t} /> : <FotoFrame karya={karya} />}
    </div>
  );
}

/** Etalase lengkap satu karya: media, deskripsi, keunggulan, dan cerita pembuatnya. */
export function KaryaShowcase({ karya, t }: { karya: KaryaSiswa; t: Translator }) {
  const exclaim = karya.nama.endsWith("!");
  const baseName = exclaim ? karya.nama.slice(0, -1) : karya.nama;

  return (
    <article className="group overflow-hidden rounded-[32px] border border-line bg-card p-2 shadow-[0_18px_40px_-18px_rgba(12,74,104,0.18)] sm:p-2.5">
      <div className="grid gap-2 lg:grid-cols-[1.08fr_1fr] lg:gap-4">
        <MediaPanel karya={karya} t={t} />

        <div className="flex flex-col px-4 pt-6 pb-4 sm:px-6 lg:py-8 lg:pr-8 lg:pl-4">
          <p className="flex flex-wrap items-center gap-2 text-xs font-bold text-blue sm:text-[13px]">
            <span className="rounded-full bg-tint px-2.5 py-0.5 text-primary">{t(KARYA_JURUSAN[karya.jurusan])}</span>
            {t(karya.kategori)}
          </p>

          <h1 className="mt-3 font-heading text-4xl leading-none font-bold tracking-tight text-heading sm:text-5xl">
            {baseName}
            {exclaim && <span className="text-brand">!</span>}
          </h1>
          <p className="mt-2 text-lg font-semibold text-primary sm:text-xl">{t(karya.tagline)}</p>
          <p className="mt-3 text-base leading-relaxed text-body">{t(karya.deskripsi)}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {karya.highlights.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint text-primary">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <strong className="block text-[15px] leading-snug font-bold text-heading">{t(title)}</strong>
                  <span className="block text-sm leading-snug text-muted">{t(text)}</span>
                </span>
              </li>
            ))}
          </ul>

          {karya.url && (
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-auto lg:pt-8">
              <Button href={karya.url} variant="accent">
                {t("Coba {nama}", { nama: karya.nama })}
              </Button>
              <span className="text-sm text-muted">{hostOf(karya.url)}</span>
            </div>
          )}
        </div>
      </div>

      <figure className="mt-2 flex flex-col gap-5 rounded-[26px] bg-tint/60 p-5 sm:p-6 md:flex-row md:items-center md:gap-8 lg:px-8">
        <figcaption className="flex shrink-0 items-center gap-3.5 md:w-[230px]">
          <KaryaAvatar pembuat={karya.pembuat} size="lg" />
          <span className="min-w-0">
            <strong className="block font-heading text-lg leading-tight font-bold text-heading">{karya.pembuat.nama}</strong>
            <span className="block text-sm font-semibold text-primary">{t("Siswa {kelas}", { kelas: karya.pembuat.kelas })}</span>
          </span>
        </figcaption>

        <blockquote className="flex flex-1 items-start gap-3 border-line text-[15px] leading-relaxed text-body sm:text-base md:border-l md:pl-8">
          <Quote size={22} className="mt-0.5 shrink-0 rotate-180 text-primary" fill="currentColor" strokeWidth={0} aria-hidden="true" />
          <p>{t(karya.pembuat.cerita)}</p>
        </blockquote>
      </figure>
    </article>
  );
}
