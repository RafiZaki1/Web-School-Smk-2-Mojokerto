"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PKL_STORIES, PKL_TABS } from "@/features/home/constants/pkl-stories";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { PklCard } from "./PklCard";
import { OrnamentZigzag } from "@/shared/components/ui/Ornaments";

export default function PklSection() {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [positions, setPositions] = useState(1);

  const stories = PKL_TABS.map((key) => ({ key, story: PKL_STORIES[key] }));

  const stepOf = (track: HTMLDivElement) => {
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return 300;
    return first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
  };

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * stepOf(track), behavior: "smooth" });
  }, []);

  const scrollByStep = useCallback(
    (direction: number) => {
      const track = trackRef.current;
      if (!track) return;
      const step = stepOf(track);
      const last = Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step));
      const current = Math.round(track.scrollLeft / step);
      const next = current + direction;
      scrollToIndex(next > last ? 0 : next < 0 ? last : next);
    },
    [scrollToIndex],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const step = stepOf(track);
      setPositions(Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / step) + 1));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [stories.length]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / stepOf(track)));
  };

  const navBtnClass =
    "absolute top-[55%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-[0_8px_20px_rgba(10,106,151,0.3)] transition hover:scale-105 hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  return (
    <section id="pkl" aria-labelledby="pkl-title" className="section relative overflow-x-clip bg-card">
      <div className="page-container relative">
      <OrnamentZigzag className="absolute top-20 left-[3%] hidden w-24 text-lime xl:block" />
        <SectionHeader
          id="pkl-title"
          badge="Karya & Cerita Siswa"
          title="Pengalaman PKL Siswa"
          description="Cerita singkat dan poin berharga dari siswa SMKN 2 Kota Mojokerto saat terjun langsung di dunia usaha dan dunia industri."
        />

        <div className="relative mt-6 sm:px-4">
          {positions > 1 && (
            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              aria-label={t("Sebelumnya")}
              className={`${navBtnClass} -left-2 sm:-left-3 lg:-left-4`}
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
          )}

          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-4 scrollbar-none sm:mx-0 sm:scroll-px-0 sm:px-0"
          >
            {stories.map(({ key, story }) => (
              <div
                key={key}
                className="shrink-0 basis-[82%] snap-start sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-2.5rem)/3)] xl:basis-[calc((100%-3.75rem)/4)]"
              >
                <PklCard story={story} />
              </div>
            ))}
          </div>

          {positions > 1 && (
            <button
              type="button"
              onClick={() => scrollByStep(1)}
              aria-label={t("Berikutnya")}
              className={`${navBtnClass} -right-2 sm:-right-3 lg:-right-4`}
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          )}
        </div>

        {positions > 1 && (
          <div className="mt-5 flex justify-center gap-2">
            {Array.from({ length: positions }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={t("Slide {nomor}", { nomor: i + 1 })}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-7 bg-primary" : "w-2 bg-tint-strong hover:bg-primary/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
