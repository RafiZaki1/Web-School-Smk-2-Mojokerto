import Image from "next/image";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import Reveal from "@/shared/components/ui/Reveal";
import LogoGrid, { type Partner } from "@/shared/components/ui/LogoGrid";
import JurusanIcon from "@/shared/components/ui/JurusanIcon";
import type { CSSProperties } from "react";
import type { Jurusan, JurusanFasilitas, JurusanKarier, JurusanKompetensi } from "../types/jurusan.type";
import { getTranslator } from "@/shared/lib/i18n/server";

const vars = (value: number): CSSProperties => ({ "--i": value }) as CSSProperties;

export async function TentangJurusan({ jurusan }: { jurusan: Jurusan }) {
  const t = await getTranslator();
  return (
    <Reveal as="section">
      <SectionHeader align="start" flush eyebrow="Tentang Jurusan" title={t("Apa yang dipelajari di {kode}?", { kode: t(jurusan.code) })} className="reveal-item" />
      <p className="reveal-item mt-5 max-w-[860px] text-base leading-relaxed text-body sm:text-lg lg:text-xl lg:leading-8" style={vars(1)}>
        {t(jurusan.tentang)}
      </p>
    </Reveal>
  );
}

export async function KompetensiUtama({ items = [] }: { items?: JurusanKompetensi[] }) {
  const t = await getTranslator();
  return (
    <Reveal as="section" stagger={70}>
      <SectionHeader align="start" eyebrow="Kompetensi Utama" title="Yang akan kamu kuasai" className="reveal-item mb-7" />
      <ul className="flex flex-wrap gap-3 sm:gap-4">
        {items.map((item, index) => (
          <li
            key={item.title}
            className="reveal-item reveal-pop inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-card px-5 py-2 text-[15px] text-ink sm:text-[17px]"
            style={vars(index + 1)}
          >
            <JurusanIcon name={item.icon} size={18} className="shrink-0 text-primary" />
            {t(item.title)}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export async function ProspekKarier({ items = [] }: { items?: JurusanKarier[] }) {
  const t = await getTranslator();
  return (
    <Reveal as="section">
      <SectionHeader align="start" eyebrow="Prospek Karier" title="Mau jadi apa setelah lulus?" className="reveal-item mb-7" />
      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-[18px]">
        {items.map((item, index) => (
          <li
            key={item.title}
            className="reveal-item flex min-h-[96px] items-center gap-5 rounded-[20px] border border-[var(--color-line)] bg-card px-6 py-5 lg:min-h-[116px] lg:px-[27px]"
            style={vars(index + 1)}
          >
            <span className="reveal-item reveal-pop flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-soft text-green" style={vars(index + 3)}>
              <JurusanIcon name={item.icon} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold text-ink sm:text-lg">{t(item.title)}</span>
              {item.desc && <span className="mt-1 block text-sm leading-relaxed text-[var(--color-body)] sm:text-base">{t(item.desc)}</span>}
            </span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function MitraJurusan({ partners }: { partners: Partner[] | null }) {
  return (
    <Reveal as="section">
      <SectionHeader align="start" title="Mitra Industri Kami" className="reveal-item mb-7" />
      <div className="reveal-item" style={vars(1)}>
        <LogoGrid partners={partners ?? []} />
      </div>
    </Reveal>
  );
}

export async function FasilitasBelajar({ items = [], title = "Praktik langsung di lab & workshop" }: { items?: JurusanFasilitas[]; title?: string | null }) {
  const t = await getTranslator();
  return (
    <Reveal as="section" stagger={120}>
      <SectionHeader align="start" eyebrow="Fasilitas Belajar" title={title ?? "Praktik langsung di lab & workshop"} className="reveal-item mb-7" />
      <ul className="grid gap-5 sm:grid-cols-3 sm:gap-[22px]">
        {items.map((item, index) => (
          <li key={item.title} className="reveal-item reveal-zoom" style={vars(index + 1)}>
            <figure className="group overflow-hidden rounded-3xl bg-surface lg:rounded-[36px]">
              <span className="relative block aspect-[396/216] w-full">
                <Image
                  src={item.image}
                  alt={t(item.title)}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                />
              </span>
              <figcaption className="sr-only">{t(item.title)}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
