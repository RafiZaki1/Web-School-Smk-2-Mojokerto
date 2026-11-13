import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, CalendarDays, Gavel, MapPin, Star, Trophy, UserRound, type LucideIcon } from "lucide-react";
import ShareButton from "./ShareButton";
import type { PrestasiDetail as PrestasiDetailData } from "../types/prestasi.type";
import { localizeDate } from "@/shared/lib/i18n/date";
import { getLocale, getTranslator } from "@/shared/lib/i18n/server";
import { OrnamentSparkle, OrnamentTrophy } from "@/shared/components/ui/Ornaments";

function GlassCard({ icon: Icon, label, value, className = "" }: { icon: LucideIcon; label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/25 bg-white/15 px-6 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-md lg:px-8 lg:py-6 ${className}`}>
      <p className="flex items-center gap-2 text-xs font-medium text-white/75 sm:text-[13px]">
        <Icon size={15} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1.5 text-xl leading-snug font-bold text-white sm:text-2xl lg:text-[28px] lg:leading-[1.4]">{value}</p>
    </div>
  );
}

export async function PrestasiHero({ data }: { data: PrestasiDetailData }) {
  const [t, locale] = await Promise.all([getTranslator(), getLocale()]);
  return (
    <section className="relative overflow-hidden bg-navy-deep text-white lg:min-h-[785px]">
      <span className="absolute inset-0 block scale-105 blur-[2px]" aria-hidden="true">
        <Image src={data.hero ?? "/prestasi-utama.webp"} alt="" fill priority sizes="100vw" className="object-cover" />
      </span>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,16,32,0.88)_0%,rgba(9,16,32,0.6)_55%,rgba(9,16,32,0.4)_100%)]" />

      <OrnamentTrophy className="absolute -bottom-12 -left-10 hidden w-72 -rotate-12 text-white/[0.06] lg:block" />
      <OrnamentSparkle className="absolute top-28 right-[6%] w-8 text-sun lg:top-36 lg:w-10" />
      <OrnamentSparkle className="absolute top-40 right-[11%] w-4 text-white/70 lg:top-52" />
      <div className="page-container relative grid gap-10 pt-32 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,450px)] lg:pt-[176px] lg:pb-[60px]">
        <div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-sun)] px-4 py-2 text-xs font-semibold text-[#3b2f00] uppercase sm:text-sm">
              <Trophy size={14} aria-hidden="true" />
              {t(data.predikat)}
            </span>
            <span className="rounded-full bg-[#cfe3ff] px-4 py-2 text-xs font-semibold text-navy uppercase sm:text-sm">{t(data.tingkat)}</span>
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase backdrop-blur-sm sm:text-sm">{localizeDate(data.bulan, locale)}</span>
          </div>

          <h1 className="mt-6 max-w-[720px] font-ui text-5xl leading-[0.95] font-extrabold tracking-[-0.045em] sm:text-7xl lg:text-[100px]">{t(data.title)}</h1>

          <div className="mt-8 flex items-center gap-4 lg:mt-10">
            {data.siswa.foto ? (
              <Image
                src={data.siswa.foto}
                alt={data.siswa.nama}
                width={89}
                height={89}
                className="h-20 w-20 shrink-0 rounded-2xl border-[3px] border-white object-cover shadow-lg sm:h-[89px] sm:w-[89px]"
              />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-[3px] border-white bg-white/15">
                <UserRound size={32} aria-hidden="true" />
              </span>
            )}
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">
              <p className="text-lg font-semibold sm:text-[28px] sm:leading-tight">{data.siswa.nama}</p>
              <p className="mt-0.5 text-sm text-white/80 sm:text-[15px]">{t(data.siswa.kelas)}</p>
            </div>
          </div>

          <Link
            href="/prestasi"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-card/90 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-card"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t("Kembali")}
          </Link>
        </div>

        <div className="flex flex-col gap-4 lg:pt-2">
          <GlassCard icon={CalendarDays} label={t("Tanggal")} value={localizeDate(data.tanggal, locale)} className="lg:ml-9" />
          <GlassCard icon={MapPin} label={t("Lokasi")} value={t(data.lokasi)} />
          <GlassCard icon={Gavel} label={t("Penyelenggara")} value={t(data.penyelenggara)} className="lg:ml-[54px]" />
        </div>
      </div>
    </section>
  );
}

export async function PrestasiArticle({ data }: { data: PrestasiDetailData }) {
  const t = await getTranslator();
  return (
    <article className="rounded-3xl bg-card p-6 shadow-[0_12px_32px_rgba(19,35,44,0.08)] sm:p-10 lg:rounded-[36px] lg:p-[54px]">
      <p className="text-xl leading-snug font-bold text-primary sm:text-2xl lg:text-[34px] lg:leading-[1.4]">{t(data.ringkasan)}</p>
      <div className="mt-8 space-y-6 text-base leading-[1.7] text-[var(--color-body)] sm:text-lg lg:text-xl">
        {data.deskripsi.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 24)}`}>{t(paragraph)}</p>
        ))}
      </div>
    </article>
  );
}

export async function PrestasiAside({ data }: { data: PrestasiDetailData }) {
  const t = await getTranslator();
  return (
    <aside className="space-y-8">
      <ShareButton title={t(data.title)} />

      <section className="overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-[var(--color-surface-alt)] shadow-[0_12px_32px_rgba(19,35,44,0.08)]">
        <h2 className="flex items-center gap-2 border-b border-[var(--color-line)] px-6 py-5 text-lg font-semibold text-ink">
          <Award size={20} className="text-[#8a6d00] dark:text-sun" aria-hidden="true" />
          {t("Dokumen Resmi")}
        </h2>
        <div className="flex justify-center px-6 py-8">
          <div className="w-full max-w-[327px] rounded-xl bg-card p-8 shadow-[0_12px_28px_rgba(19,35,44,0.1)]">
            <span className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-xl border-4 border-[var(--color-sun)] bg-[#fff7d6] text-[#e3b400]">
              <Star size={36} aria-hidden="true" />
            </span>
            <div className="mt-8 space-y-4" aria-hidden="true">
              <span className="mx-auto block h-3 w-4/5 rounded-full bg-[var(--color-line)]" />
              <span className="mx-auto block h-3 w-3/5 rounded-full bg-[var(--color-line)]" />
              <span className="mx-auto block h-3 w-1/2 rounded-full bg-[var(--color-line)]" />
            </div>
          </div>
        </div>
      </section>

      {data.testimoni && (
        <figure className="rounded-[28px] border border-[var(--color-line)] bg-[var(--color-surface-alt)] p-6 shadow-[0_12px_32px_rgba(19,35,44,0.06)] lg:p-8">
          <blockquote className="text-xl leading-snug font-bold text-ink lg:text-[22px] lg:leading-[1.45]">{t(data.testimoni.quote)}</blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a74c0] text-white">
              <UserRound size={20} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-lg font-medium text-ink">{data.testimoni.nama}</span>
              <span className="block text-xs text-[var(--color-muted)]">{t(data.testimoni.jabatan)}</span>
            </span>
          </figcaption>
        </figure>
      )}
    </aside>
  );
}

export async function PrestasiGallery({ galeri }: { galeri: NonNullable<PrestasiDetailData["galeri"]> }) {
  const t = await getTranslator();
  const [main, ...rest] = galeri.foto;
  return (
    <section>
      <h2 className="font-ui text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-6xl lg:text-[72px]">{t(galeri.judul)}</h2>
      <p className="mt-4 max-w-[641px] text-base leading-relaxed text-[var(--color-body)] sm:text-lg">{t(galeri.deskripsi)}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[432px_1fr] lg:gap-[81px]">
        {main ? (
          <span className="relative block h-80 w-full overflow-hidden rounded-3xl sm:h-[480px] lg:h-[675px] lg:rounded-[32px]">
            <Image src={main} alt={t("Dokumentasi prestasi")} fill sizes="(min-width: 1024px) 432px, 100vw" className="object-cover" />
          </span>
        ) : null}
        <div className="grid gap-6">
          {rest.map((src, index) => (
            <span
              key={`${src}-${index}`}
              className="relative block h-56 w-full overflow-hidden rounded-3xl border-4 border-card shadow-[0_16px_32px_rgba(19,35,44,0.12)] sm:h-[320px] lg:h-full lg:rounded-[28px]"
            >
              <Image src={src} alt={t("Dokumentasi malam penganugerahan")} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function PrestasiMiniFooter() {
  const t = await getTranslator();
  const links = ["Tentang Kami", "Hubungi Kami", "Kebijakan Privasi", "Syarat & Ketentuan"];
  return (
    <div className="border-t border-[var(--color-line)] bg-[var(--color-surface-alt)]">
      <div className="page-container flex flex-col items-center gap-6 py-8 text-center lg:flex-row lg:justify-between lg:text-left">
        <Image src="/images/brand/logo-smkn2-full.png" alt="SMK Negeri 2 Kota Mojokerto" width={177} height={63} className="h-12 w-auto" />
        <ul className="flex max-w-[560px] flex-wrap justify-center gap-x-6 gap-y-3 text-base font-medium text-[var(--color-body)] sm:text-xl">
          {links.map((label) => (
            <li key={label}>{t(label)}</li>
          ))}
        </ul>
        <p className="max-w-[235px] text-sm text-[var(--color-muted)] lg:text-right">© 2026 SMKN 2 Kota Mojokerto. {t("Semua Hak Dilindungi.")}</p>
      </div>
    </div>
  );
}
