"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import VisibleViewTransition from "@/shared/components/ui/VisibleViewTransition";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Reveal from "@/shared/components/ui/Reveal";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import type { Jurusan } from "@/features/jurusan";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { OrnamentBurst, OrnamentGear, OrnamentSparkle } from "@/shared/components/ui/Ornaments";

const GAP_PX = 24;

function getVisibleCount(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export default function JurusanSection({ items = [] }: { items?: Jurusan[] }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const jurusanList = items;
  const maxIndex = Math.max(0, jurusanList.length - visibleCount);

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount(window.innerWidth));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Jaga indeks tetap valid saat jumlah kartu per layar berubah
  const activeIndex = Math.min(currentIndex, maxIndex);

  const next = useCallback(() => {
    setCurrentIndex((index) => {
      const clamped = Math.min(index, maxIndex);
      return clamped < maxIndex ? clamped + 1 : 0;
    });
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((index) => {
      const clamped = Math.min(index, maxIndex);
      return clamped > 0 ? clamped - 1 : maxIndex;
    });
  }, [maxIndex]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isPaused || reduceMotion) return;
    const interval = setInterval(next, 4500);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) (diff > 0 ? next : prev)();
  };

  return (
    <section id="jurusan" className="section relative overflow-hidden bg-surface lg:rounded-[36px]">
      {/* Roda gigi saling bertaut seperti pada emblem sekolah */}
      <OrnamentGear className="absolute top-16 left-[4%] hidden w-20 text-tint-strong lg:block xl:w-24" />
      <OrnamentGear className="absolute top-16 left-[4%] hidden w-20 text-tint-strong motion-safe:animate-[spin_40s_linear_infinite] lg:block xl:w-24" />
      <OrnamentGear className="absolute top-36 left-[9.5%] hidden w-10 text-sun motion-safe:animate-[spin_24s_linear_infinite_reverse] lg:block xl:top-40 xl:w-12" />
      <OrnamentBurst className="absolute top-20 right-[6%] hidden w-14 rotate-[30deg] text-lime lg:block" />
      <OrnamentSparkle className="absolute top-40 right-[10%] hidden w-6 text-brand lg:block" />
      <OrnamentGear className="absolute top-36 left-[9.5%] hidden w-10 text-sun lg:block xl:top-40 xl:w-12" />

      <Reveal className="page-container relative">
        <SectionHeader title="JURUSAN" description="Ini adalah jurusan unggulan Skaneda." className="reveal-item" />

        {/* Padding vertikal agar kartu yang terangkat saat hover tidak terpotong */}
        <div
          className="-my-4 overflow-hidden py-4"
          onTouchStart={(event) => {
            touchStartX.current = event.targetTouches[0].clientX;
            touchEndX.current = event.targetTouches[0].clientX;
          }}
          onTouchMove={(event) => {
            touchEndX.current = event.targetTouches[0].clientX;
          }}
          onTouchEnd={handleTouchEnd}
        >
          <ul
            className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
            style={{
              gap: GAP_PX,
              transform: `translateX(calc(-${activeIndex} * (100% + ${GAP_PX}px) / ${visibleCount}))`,
            }}
          >
            {jurusanList.map((item, index) => {
              // Hanya kartu yang sedang tampil yang dinamai, agar morph tidak terbang ke kartu di luar layar
              const inView = index >= activeIndex && index < activeIndex + visibleCount;
              return (
                <li
                  key={item.id}
                  className="reveal-item flex w-full shrink-0 sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]"
                  style={{ "--i": Math.max(0, index - activeIndex) + 1 } as CSSProperties}
                >
                  <Link
                    href={`/jurusan/${item.id}`}
                    className="group flex w-full flex-col rounded-3xl bg-card p-4 text-center transition-[box-shadow,translate] duration-300 hover:shadow-[0_12px_28px_rgba(19,35,44,0.08)] motion-safe:hover:-translate-y-1.5 sm:p-5 lg:rounded-[36px] lg:p-[27px]"
                  >
                    {/* Pasangan morph dengan gambar hero di halaman detail jurusan */}
                    <VisibleViewTransition name={inView ? `jurusan-${item.id}` : undefined} share="jurusan-morph" default="none">
                      <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-surface lg:rounded-3xl">
                        <span className="relative block h-full w-full">
                          <Image
                            src={item.image}
                            alt={t("Jurusan {kode} SMKN 2 Mojokerto", { kode: item.code })}
                            fill
                            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                          />
                        </span>
                      </div>
                    </VisibleViewTransition>
                    <h3 className="mt-5 font-sans text-2xl font-semibold text-ink transition-colors group-hover:text-primary lg:text-[28px]">
                      {item.code}
                    </h3>
                    <p className="mt-1 text-[15px] font-semibold text-accent lg:text-[17px]">{t(item.fullName)}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-body)] italic lg:text-lg">{t(item.desc)}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 flex items-center justify-center gap-11">
          <button
            type="button"
            onClick={prev}
            aria-label={t("Jurusan sebelumnya")}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-card text-ink shadow-[0_2px_6px_rgba(19,35,44,0.1)] transition-colors hover:bg-[var(--color-surface-alt)]"
          >
            <ArrowLeft size={16} strokeWidth={2.25} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t("Jurusan berikutnya")}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-dark"
          >
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
      </Reveal>
    </section>
  );
}
