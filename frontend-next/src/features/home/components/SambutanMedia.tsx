"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

/** ID video dari URL YouTube (watch, youtu.be, shorts, embed); null bila bukan YouTube. */
function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match?.[1] ?? null;
}

/**
 * Foto kepala sekolah yang berubah menjadi pemutar video saat diklik.
 * Sebelum diklik hanya foto yang dimuat: iframe YouTube / file video
 * (ratusan KB–MB) baru diunduh setelah pengunjung menekan tombol putar.
 */
export default function SambutanMedia({ foto, nama, video = "" }: { foto: string; nama: string; video?: string }) {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const ytId = video ? youtubeId(video) : null;

  if (playing && video) {
    return (
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-black lg:rounded-[32px]">
        {ytId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
            title={t("Video sambutan {nama}", { nama })}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <video src={video} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-contain">
            {t("Browser Anda tidak mendukung pemutar video.")}
          </video>
        )}
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-tint lg:rounded-[32px]">
      <Image src={foto} alt={nama} width={900} height={1023} sizes="(min-width: 1024px) 420px, (min-width: 440px) 380px, 94vw" className="absolute inset-x-0 bottom-0 mx-auto h-auto w-[94%]" />
      {/* Menyamarkan tepi bawah foto potongan (cutout) yang kasar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-t from-tint from-30% to-transparent" aria-hidden="true" />

      {video && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-card/90 p-3 pr-5 text-left shadow-[0_10px_30px_rgba(12,74,104,0.25)] backdrop-blur-sm transition hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-ink sm:inset-x-6 sm:bottom-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-white transition group-hover:scale-105">
            <Play size={20} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          </span>
          <span>
            <span className="block font-heading text-[15px] font-semibold text-heading">{t("Tonton video sambutan")}</span>
            <span className="block text-[13px] text-muted">{t("Pesan langsung dari kepala sekolah")}</span>
          </span>
        </button>
      )}
    </div>
  );
}
