"use client";

import { useId, useState, ViewTransition } from "react";
import Image from "next/image";
import type { Ekstrakurikuler } from "@/features/ekstrakurikuler";
import { Flag, HandHeart, Music, Volleyball, type LucideIcon } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import Reveal from "@/shared/components/ui/Reveal";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import JurusanIcon from "@/shared/components/ui/JurusanIcon";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { OrnamentBurst, OrnamentFlower, OrnamentSparkle, OrnamentZigzag } from "@/shared/components/ui/Ornaments";

const ICONS: Record<string, LucideIcon> = { flag: Flag, ball: Volleyball, music: Music, "hand-heart": HandHeart };

// Ikon bawaan (flag/ball/...) atau nama ikon lucide yang dipilih admin
function EkstraIcon({ name, size }: { name: string | null; size: number }) {
  const Icon = name ? ICONS[name] : undefined;
  return Icon ? <Icon size={size} aria-hidden="true" /> : <JurusanIcon name={name ?? "Sparkles"} size={size} />;
}

export default function EkstrakurikulerSection({ items = [] }: { items?: Ekstrakurikuler[] }) {
  const { t } = useTranslation();
  const baseId = useId();
  const ITEMS = items;
  const [activeId, setActiveId] = useState<string | undefined>(ITEMS[0]?.id);
  const current = ITEMS.find((item) => item.id === activeId) ?? ITEMS[0];

  if (!current) return null;

  return (
    <section id="kesiswaan" className="section relative mt-16 scroll-mt-20 overflow-x-clip bg-surface lg:mt-28">
      <Reveal id="ekstrakurikuler" className="page-container relative scroll-mt-24">
      <OrnamentFlower className="absolute top-16 left-[6%] hidden w-16 text-sun lg:block" />
      <OrnamentZigzag className="absolute top-40 left-[3%] hidden w-24 text-lime lg:block" />
      <OrnamentBurst className="absolute top-20 right-[6%] hidden w-16 rotate-[25deg] text-brand lg:block" />
      <OrnamentSparkle className="absolute top-44 right-[10%] hidden w-6 text-sun lg:block" />
        <SectionHeader
          title="Ekstrakurikuler"
          description="Temukan minat, kembangkan bakat, dan raih prestasi bersama berbagai kegiatan pilihan di sekolah."
          className="reveal-item"
        />

        <div
          className="reveal-item grid overflow-hidden rounded-3xl bg-card lg:grid-cols-[515px_1fr] lg:rounded-[36px]"
          style={{ "--i": 1 }}
        >
          <div
            role="tablist"
            aria-label={t("Pilihan ekstrakurikuler")}
            aria-orientation="vertical"
            className="grid grid-cols-2 gap-2 p-3 sm:gap-3 sm:p-5 lg:grid-cols-1 lg:content-center lg:gap-3 lg:p-[34px]"
          >
            {ITEMS.map((item, index) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls={`${baseId}-panel`}
                  onClick={() => setActiveId(item.id)}
                  className={`reveal-item reveal-left group flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left transition-[background-color,border-color,box-shadow] duration-300 sm:gap-4 lg:rounded-[20px] lg:p-6 ${
                    isActive
                      ? "border-line bg-card shadow-[0_6px_18px_rgba(19,35,44,0.08)]"
                      : "border-transparent hover:bg-surface-alt"
                  }`}
                  style={{ "--i": index + 2 }}
                >
                  <span
                    className={`ekstra-tab-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-[background-color,color,scale,rotate] duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6 sm:h-[60px] sm:w-[60px] ${
                      isActive ? "bg-primary text-white" : "bg-[var(--color-tint)] text-primary"
                    }`}
                  >
                    <EkstraIcon name={item.icon} size={24} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-semibold text-ink sm:text-xl lg:text-[26px] lg:leading-tight">
                      {t(item.name)}
                    </span>
                    <span className="mt-0.5 hidden truncate text-sm text-[var(--color-body)] sm:block lg:text-[17px]">
                      {t(item.subtitle)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pasangan morph dengan hero di halaman detail ekstrakurikuler */}
          <ViewTransition name={`ekstra-${current.id}`} share="ekstra-morph" default="none">
            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${current.id}`}
              className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-navy p-6 text-white sm:min-h-[440px] sm:p-10 lg:min-h-[578px] lg:p-[45px]"
            >
              {/* Semua foto ditumpuk lalu di-crossfade, jadi ganti tab langsung mulus tanpa menunggu unduhan */}
              {ITEMS.map((item) => {
                const isActive = item.id === current.id;
                return (
                  <span
                    key={item.id}
                    className={`absolute inset-0 transition-[opacity,scale] duration-1000 ease-out motion-reduce:transition-none ${
                      isActive ? "scale-100 opacity-100" : "scale-110 opacity-0"
                    }`}
                  >
                    <Image src={item.image} alt={isActive ? t(item.name) : ""} aria-hidden={isActive ? undefined : true} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
                  </span>
                );
              })}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[var(--color-navy-deep)]/95" />

              {/* key memicu animasi teks setiap ganti tab */}
              <h3 key={`${current.id}-judul`} className="ekstra-swap relative font-heading text-3xl font-bold sm:text-4xl lg:text-[44px]">
                {t(current.name)}
              </h3>

              <div key={`${current.id}-isi`} className="ekstra-swap relative max-w-[560px]" style={{ "--i": 1 }}>
                <p className="text-[15px] leading-relaxed sm:text-lg">{t(current.desc)}</p>
                <Button href={`/ekstrakurikuler/${current.id}`} size="sm" withArrow className="mt-6">
                  {t("Selengkapnya")}
                </Button>
              </div>
            </div>
          </ViewTransition>
        </div>
      </Reveal>
    </section>
  );
}
