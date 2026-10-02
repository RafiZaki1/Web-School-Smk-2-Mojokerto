"use client";

import { useId, useState } from "react";
import { Flag, HandHeart, Music, Volleyball } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import JurusanIcon from "@/components/jurusan/JurusanIcon";

const ICONS = { flag: Flag, ball: Volleyball, music: Music, "hand-heart": HandHeart };

// Ikon bawaan (flag/ball/...) atau nama ikon lucide yang dipilih admin
function EkstraIcon({ name, size }) {
  const Icon = ICONS[name];
  return Icon ? <Icon size={size} aria-hidden="true" /> : <JurusanIcon name={name} size={size} />;
}

export default function EkstrakurikulerSection({ items = [] }) {
  const baseId = useId();
  const ITEMS = items;
  const [activeId, setActiveId] = useState(ITEMS[0]?.id);
  const current = ITEMS.find((item) => item.id === activeId) ?? ITEMS[0];

  if (!current) return null;

  return (
    <section id="kesiswaan" className="section mt-16 scroll-mt-20 bg-surface lg:mt-28">
      <div id="ekstrakurikuler" className="page-container scroll-mt-24">
        <SectionHeader
          title="Ekstrakurikuler"
          description="Temukan minat, kembangkan bakat, dan raih prestasi bersama berbagai kegiatan pilihan di sekolah."
        />

        <div className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[515px_1fr] lg:rounded-[36px]">
          <div
            role="tablist"
            aria-label="Pilihan ekstrakurikuler"
            aria-orientation="vertical"
            className="grid grid-cols-2 gap-2 p-3 sm:gap-3 sm:p-5 lg:grid-cols-1 lg:content-center lg:gap-3 lg:p-[34px]"
          >
            {ITEMS.map((item) => {
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
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left transition-colors sm:gap-4 lg:rounded-[20px] lg:p-6 ${
                    isActive
                      ? "border-line bg-white shadow-[0_6px_18px_rgba(15,42,70,0.08)]"
                      : "border-transparent hover:bg-[#f6f9fb]"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-[60px] sm:w-[60px] ${
                      isActive ? "bg-primary text-white" : "bg-[#e7f2ff] text-primary"
                    }`}
                  >
                    <EkstraIcon name={item.icon} size={24} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-semibold text-ink sm:text-xl lg:text-[26px] lg:leading-tight">
                      {item.name}
                    </span>
                    <span className="mt-0.5 hidden truncate text-sm text-[#4b5563] sm:block lg:text-[17px]">
                      {item.subtitle}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${current.id}`}
            className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-navy p-6 text-white sm:min-h-[440px] sm:p-10 lg:min-h-[578px] lg:p-[45px]"
          >
            <img
              key={current.id}
              src={current.image}
              alt={current.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#02263f]/95" />

            <h3 className="relative font-heading text-3xl font-bold sm:text-4xl lg:text-[44px]">{current.name}</h3>

            <div className="relative max-w-[560px]">
              <p className="text-[15px] leading-relaxed sm:text-lg">{current.desc}</p>
              <Button href={`/ekstrakurikuler/${current.id}`} size="sm" withArrow className="mt-6">
                Selengkapnya
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
