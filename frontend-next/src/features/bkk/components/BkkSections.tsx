import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, Target } from "lucide-react";
import PageHeading from "@/shared/components/layout/PageHeading";
import MitraSearch from "./MitraSearch";
import type { BkkRekrutItem, Lowongan } from "../types/bkk.type";
import { getTranslator } from "@/shared/lib/i18n/server";

export async function BkkAbout() {
  const t = await getTranslator();
  return (
    <section id="tentang" className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-[511px_1fr] lg:gap-[54px]">
      <span className="relative block aspect-square w-full max-w-[511px] overflow-hidden rounded-3xl shadow-[0_16px_32px_rgba(8,53,75,0.12)]">
        <Image src="/images/bkk/bkk-logo.jpg" alt={t("Logo Bursa Kerja Khusus SMKN 2 Mojokerto")} fill sizes="(min-width: 1024px) 511px, 100vw" className="object-cover" />
      </span>
      <div>
        <PageHeading size="xl" tone="navy" eyebrow="Tentang Layanan" title="Apa itu BKK?" />
        <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--color-body)] sm:text-[17px]">
          <p>
            {t(
              "Bursa Kerja Khusus (BKK) adalah unit layanan ketenagakerjaan di SMK yang menjembatani lulusan dengan dunia usaha dan dunia industri (DUDI), pemerintah serta dunia usaha sebagai mitra informasi lowongan kerja sesuai kompetensi.",
            )}
          </p>
          <p>
            {t(
              "BKK SMKN 2 Mojokerto menampung, berbagi, dan menyalurkan siswa untuk memperoleh informasi lowongan kerja terbaru, job fair, seminar karier, hingga rekomendasi magang di sekolah.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

export async function BkkVisiMisi({ visi, misi }: { visi: string; misi: string[] }) {
  const t = await getTranslator();
  return (
    <section className="bg-navy-deep py-14 text-white lg:py-[72px]">
      <div className="page-container">
        <p className="text-xs font-bold text-[var(--color-accent)] sm:text-[13px]">{t("Visi & Misi")}</p>
        <h2 className="mt-2 text-2xl font-bold sm:text-[32px]">{t("Visi & Misi BKK")}</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-9">
          <article className="rounded-3xl bg-card p-7 text-ink lg:p-9">
            <h3 className="flex items-center gap-4 text-xl font-bold text-navy-ink sm:text-2xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-tint)]">
                <Eye size={26} aria-hidden="true" />
              </span>
              {t("Visi BKK")}
            </h3>
            <p className="mt-6 text-base leading-relaxed text-[var(--color-body)] sm:text-lg">{t(visi)}</p>
          </article>
          <article className="rounded-3xl bg-card p-7 text-ink lg:p-9">
            <h3 className="flex items-center gap-4 text-xl font-bold text-navy-ink sm:text-2xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-tint)]">
                <Target size={26} aria-hidden="true" />
              </span>
              {t("Misi BKK")}
            </h3>
            <ul className="mt-6 space-y-3 text-base leading-relaxed text-[var(--color-body)] sm:text-lg">
              {misi.map((item) => (
                <li key={item}>{t(item)}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

export async function BkkRekrut({ items }: { items: BkkRekrutItem[] }) {
  const t = await getTranslator();
  return (
    <section>
      <PageHeading size="xl" tone="navy" eyebrow="Jejak Penelusuran" title="Siswa yang direkrut sebelum lulus" />
      <ul className="mt-8 grid grid-cols-2 gap-5 sm:gap-8 lg:mt-11 lg:grid-cols-4 lg:px-[52px]">
        {items.map((item) => (
          <li key={item.nama} className="flex justify-center">
            <span className="relative block aspect-[4/5] w-full max-w-[245px] overflow-hidden rounded-2xl shadow-[0_12px_24px_rgba(8,53,75,0.15)]">
              <Image src={item.foto} alt={t("{nama}, {kelas}, direkrut {perusahaan}", { nama: item.nama, kelas: item.kelas, perusahaan: item.perusahaan })} fill sizes="(min-width: 1024px) 245px, 50vw" className="object-cover" />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BkkMitra({ items }: { items: string[] }) {
  return (
    <section id="mitra" className="scroll-mt-28">
      <PageHeading size="xl" tone="navy" eyebrow="Mitra Perusahaan" title="Perusahaan mitra" />
      <MitraSearch items={items} />
    </section>
  );
}

export async function BkkLokerTerkini({ items }: { items: Lowongan[] }) {
  const t = await getTranslator();
  return (
    <section>
      <PageHeading size="xl" tone="navy" eyebrow="Lowongan Terkini" title="Loker aktif saat ini" />
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[100px]">
        {items.map((job) => (
          <li key={job.slug}>
            <Link
              href={`/bkk/lowongan/${job.slug}`}
              className="block overflow-hidden rounded-3xl bg-card shadow-[0_8px_24px_rgba(8,53,75,0.08)] transition-shadow hover:shadow-[0_12px_32px_rgba(8,53,75,0.12)]"
            >
              <span className="relative block h-[226px] w-full">
                {job.poster ? (
                  <Image src={job.poster} alt={t("Poster lowongan {judul}", { judul: t(job.title) })} fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover object-top" />
                ) : null}
              </span>
              <div className="p-6">
                <h3 className="text-lg leading-snug font-bold text-ink">{t(job.title)}</h3>
                <p className="mt-4 text-[13px] text-[var(--color-body)]">
                  {job.company} - {t(job.location)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <Link
          href="/bkk/lowongan"
          className="inline-flex items-center gap-3 rounded-full bg-card px-6 py-3.5 text-base font-medium text-[var(--color-body)] shadow-[0_6px_18px_rgba(8,53,75,0.1)] transition-colors hover:text-blue sm:text-lg"
        >
          {t("Lihat semua lowongan")}
          <ArrowRight size={18} className="text-blue" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
