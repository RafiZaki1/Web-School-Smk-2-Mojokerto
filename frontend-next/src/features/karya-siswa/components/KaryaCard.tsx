"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { KARYA_JURUSAN, type KaryaSiswa } from "../constants/karya-data";
import { KaryaAvatar } from "./KaryaAvatar";
import { KaryaImage } from "./KaryaImage";

/** Kartu ringkas karya: foto, jurusan, nama karya, dan pembuatnya. */
export function KaryaCard({ karya }: { karya: KaryaSiswa }) {
  const { t } = useTranslation();
  const isApp = karya.media.tipe === "aplikasi";
  const cover = karya.media.tipe === "aplikasi" ? karya.media.desktop : karya.media.src;

  return (
    <Link
      href={`/karya-siswa/${karya.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-[0_2px_10px_rgba(8,53,75,0.06)] transition duration-300 hover:-translate-y-1 hover:border-brand/45 hover:shadow-[0_18px_36px_-10px_rgba(10,106,151,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-deep">
        <KaryaImage
          src={cover}
          alt={karya.media.alt}
          jurusan={karya.jurusan}
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
          className={`transition-transform duration-500 group-hover:scale-105 ${isApp ? "object-top" : ""}`}
        />
        <span className="absolute top-4 left-4 rounded-full bg-card/95 px-3 py-1 text-xs font-bold tracking-wide text-primary uppercase shadow-sm">
          {t(KARYA_JURUSAN[karya.jurusan])}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-bold tracking-[0.06em] text-blue uppercase">{t(karya.kategori)}</p>
        <h3 className="mt-2 font-heading text-xl leading-snug font-bold text-heading sm:text-[22px]">{karya.nama}</h3>
        <p className="mt-1.5 mb-5 text-[15px] leading-relaxed text-muted">{t(karya.tagline)}</p>

        <div className="mt-auto flex items-center gap-3 border-t border-line pt-5">
          <KaryaAvatar pembuat={karya.pembuat} />
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-[15px] leading-tight font-bold text-heading">{karya.pembuat.nama}</strong>
            <span className="block text-sm text-muted">{karya.pembuat.kelas}</span>
          </span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
