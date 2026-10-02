"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const GAP_PX = 24;

function getVisibleCount(width) {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export default function JurusanSection({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
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
    <section id="jurusan" className="section bg-surface lg:rounded-[36px]">
      <div className="page-container">
        <SectionHeader title="JURUSAN" description="Ini adalah jurusan unggulan Skaneda." />

        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          onTouchStart={(event) => {
            setIsPaused(true);
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
            {jurusanList.map((item) => (
              <li
                key={item.id}
                className="flex w-full shrink-0 sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]"
              >
                <Link
                  href={`/jurusan/${item.id}`}
                  className="group flex w-full flex-col rounded-3xl bg-white p-4 text-center transition-shadow hover:shadow-[0_12px_28px_rgba(15,42,70,0.08)] sm:p-5 lg:rounded-[36px] lg:p-[27px]"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-surface lg:rounded-3xl">
                    <img
                      src={item.image}
                      alt={`Jurusan ${item.code} SMKN 2 Mojokerto`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-5 font-sans text-2xl font-semibold text-ink lg:text-[28px]">{item.code}</h3>
                  <p className="mt-1 text-[15px] font-semibold text-accent lg:text-[17px]">{item.fullName}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#4b5563] italic lg:text-lg">{item.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex items-center justify-center gap-11">
          <button
            type="button"
            onClick={prev}
            aria-label="Jurusan sebelumnya"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white text-ink shadow-[0_2px_6px_rgba(15,42,70,0.1)] transition-colors hover:bg-[#f1f5f9]"
          >
            <ArrowLeft size={16} strokeWidth={2.25} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Jurusan berikutnya"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-dark"
          >
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
