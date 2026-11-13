"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Quote, Star } from "lucide-react";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import Image from "next/image";
import type { Lulusan } from "@/features/lulusan";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { OrnamentBubble, OrnamentFlower, OrnamentWave } from "@/shared/components/ui/Ornaments";

const AUTOPLAY_MS = 6000;

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

function Stars({ value }: { value: number }) {
  const { t } = useTranslation();
  return (
    <span className="flex justify-center gap-0.5" role="img" aria-label={t("Rating {nilai} dari 5", { nilai: value })}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          strokeWidth={0}
          fill={i < value ? "var(--color-gold)" : "var(--color-line)"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function Avatar({ alumni }: { alumni: Lulusan }) {
  return (
    <div className="absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2" aria-hidden="true">
      {/* Bentuk dekoratif di belakang foto */}
      <span className="absolute -right-2 -bottom-1 h-20 w-20 rounded-[40%_60%_55%_45%] bg-gold transition-transform duration-500 group-hover:rotate-12" />
      <span className="absolute -top-1 -left-2 h-14 w-14 rounded-[55%_45%_40%_60%] bg-[var(--color-tint-strong)]" />
      <span className="relative block h-full w-full overflow-hidden rounded-full bg-navy ring-4 ring-card">
        {alumni.photo ? (
          <Image src={alumni.photo} alt="" width={256} height={256} className="h-full w-full object-cover object-top" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-heading text-3xl font-bold text-white">
            {initials(alumni.name)}
          </span>
        )}
      </span>
    </div>
  );
}

function KartuUlasan({ alumni }: { alumni: Lulusan }) {
  const { t } = useTranslation();
  return (
    <article className="group relative mt-16 flex h-[calc(100%-4rem)] flex-col rounded-[28px] border-2 border-[var(--color-tint-strong)] border-b-[6px] border-b-gold bg-card px-6 pt-20 pb-7 text-center transition duration-300 hover:-translate-y-1 hover:border-navy hover:border-b-gold hover:shadow-[0_18px_36px_rgba(12,74,104,0.14)]">
      <Avatar alumni={alumni} />

      <h3 className="font-heading text-lg leading-snug font-bold text-heading">{alumni.name}</h3>
      {alumni.karier && <p className="mt-1 text-sm leading-snug font-semibold text-primary">{t(alumni.karier)}</p>}

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="rounded-full bg-tint px-3 py-1 font-semibold text-navy-ink">
          {alumni.jurusan} • {alumni.angkatan}
        </span>
        {alumni.lokasi && (
          <span className="inline-flex items-center gap-1 text-muted italic">
            <MapPin size={12} aria-hidden="true" />
            {alumni.lokasi}
          </span>
        )}
      </div>

      {alumni.rating && (
        <div className="mt-3">
          <Stars value={alumni.rating} />
        </div>
      )}

      <blockquote className="mt-5 flex flex-1 gap-3 border-t border-dashed border-line pt-5 text-left text-sm leading-relaxed text-body">
        <Quote size={22} className="shrink-0 text-gold" fill="currentColor" strokeWidth={0} aria-hidden="true" />
        <p>{alumni.testimoni && t(alumni.testimoni)}</p>
      </blockquote>
    </article>
  );
}

/** Ulasan alumni dari database; tidak dirender sama sekali bila belum ada testimoni. */
export default function TestimoniAlumniSection({ items = [] }: { items?: Lulusan[] }) {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [positions, setPositions] = useState(1);

  // Lulusan terbaik (berfoto) tampil paling depan
  const ulasan = [...items].sort((a, b) => Number(b.featured) - Number(a.featured));
  const total = ulasan.length;

  // Lebar satu langkah geser = lebar kartu + jarak antar kartu
  const stepOf = (track: HTMLDivElement) => {
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return 1;
    return first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
  };

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * stepOf(track), behavior: "smooth" });
  }, []);

  const go = useCallback(
    (direction: number) => {
      const track = trackRef.current;
      if (!track) return;
      const step = stepOf(track);
      const last = Math.round((track.scrollWidth - track.clientWidth) / step);
      const current = Math.round(track.scrollLeft / step);
      const next = current + direction;
      scrollToIndex(next > last ? 0 : next < 0 ? last : next);
    },
    [scrollToIndex],
  );

  // Jumlah posisi geser berubah mengikuti jumlah kartu yang muat di layar
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setPositions(Math.round((track.scrollWidth - track.clientWidth) / stepOf(track)) + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [total]);

  useEffect(() => {
    if (paused || positions < 2) return;
    const timer = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [active, paused, positions, go]);

  if (!total) return null;

  const onScroll = () => {
    const track = trackRef.current;
    if (track) setActive(Math.round(track.scrollLeft / stepOf(track)));
  };

  const navButton =
    "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-white shadow-[0_8px_20px_rgba(12,74,104,0.3)] transition hover:bg-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-ink focus-visible:ring-offset-2 sm:flex";

  return (
    <section id="testimoni-alumni" className="section relative overflow-x-clip">
      <OrnamentBubble className="absolute top-20 left-[5%] hidden w-24 -rotate-6 text-tint-strong lg:block" />
      <OrnamentFlower className="absolute top-20 right-[6%] hidden w-14 text-sun lg:block" />
      <OrnamentWave className="absolute top-40 right-[3%] hidden w-24 text-lime lg:block" />
      <div className="page-container relative">
        <SectionHeader
          badge="Kata Alumni"
          title="Cerita mereka setelah lulus"
          description="Pengalaman langsung alumni SMKN 2 Mojokerto yang kini berkarier dan berkuliah di dalam maupun luar negeri."
        />

        <div
          className="relative"
        >
          {positions > 1 && (
            <button type="button" onClick={() => go(-1)} aria-label={t("Ulasan sebelumnya")} className={`${navButton} -left-3 lg:-left-6`}>
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
          )}

          <div
            ref={trackRef}
            onScroll={onScroll}
            className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
            aria-label={t("Ulasan alumni")}
          >
            {ulasan.map((alumni) => (
              <div
                key={alumni.id ?? alumni.name}
                className="shrink-0 basis-[85%] snap-start sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)] xl:basis-[calc((100%-4.5rem)/4)]"
              >
                <KartuUlasan alumni={alumni} />
              </div>
            ))}
          </div>

          {positions > 1 && (
            <button type="button" onClick={() => go(1)} aria-label={t("Ulasan berikutnya")} className={`${navButton} -right-3 lg:-right-6`}>
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          )}

          {positions > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: positions }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={t("Tampilkan ulasan ke-{nomor}", { nomor: i + 1 })}
                  aria-current={i === active}
                  className={`h-2.5 rounded-full transition-all ${i === active ? "w-8 bg-navy" : "w-2.5 bg-[var(--color-tint-strong)] hover:bg-primary"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
