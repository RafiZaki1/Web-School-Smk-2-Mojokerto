"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import TabButtons from "@/shared/components/ui/TabButtons";
import { KATEGORI_TONES } from "../constants/berita-data";
import type { Berita } from "../types/berita.type";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { localizeDate } from "@/shared/lib/i18n/date";

const PAGE_SIZE = 6;

function BeritaRow({ item }: { item: Berita }) {
  const { t, locale } = useTranslation();
  return (
    <article className="grid gap-5 border-b border-line py-7 first:pt-0 sm:grid-cols-[280px_1fr] sm:items-center sm:gap-8 lg:grid-cols-[320px_1fr] lg:gap-10 lg:py-9">
      <Link href={`/berita/${item.slug}`} className="block overflow-hidden rounded-2xl" tabIndex={-1} aria-hidden="true">
        {item.thumb ? (
          <span className="relative block aspect-[346/230] w-full">
            <Image src={item.thumb} alt="" fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 100vw" className="object-cover" />
          </span>
        ) : (
          <span className={`block aspect-[346/230] w-full bg-gradient-to-br ${item.gradient}`} />
        )}
      </Link>
      <div className="min-w-0">
        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium sm:text-sm ${KATEGORI_TONES[item.category] ?? KATEGORI_TONES.Prestasi}`}>
          {t(item.category)}
        </span>
        <h2 className="mt-3 line-clamp-3 text-xl leading-snug font-bold tracking-[-0.01em] text-navy-deep-ink sm:text-2xl lg:text-[28px] lg:leading-[1.3]">
          <Link href={`/berita/${item.slug}`} className="hover:text-primary">
            {t(item.title)}
          </Link>
        </h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-body)] sm:text-base">
          <CalendarDays size={16} aria-hidden="true" />
          {localizeDate(item.date, locale)}
        </p>
      </div>
    </article>
  );
}

interface BeritaExplorerProps {
  items: Berita[];
  categories?: string[];
  initialQuery?: string;
  initialCategory?: string;
}

export function BeritaExplorer({ items, categories = [], initialQuery = "", initialCategory = "" }: BeritaExplorerProps) {
  const { t } = useTranslation();
  const tabs = ["Semua", ...categories];
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : "Semua");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const term = initialQuery.trim().toLowerCase();
  const filtered = items.filter((item) => (category === "Semua" || item.category === category) && (!term || item.title.toLowerCase().includes(term) || t(item.title).toLowerCase().includes(term)));

  return (
    <>
      <TabButtons
        variant="outline-dark"
        className="mt-8 lg:mt-12"
        ariaLabel="Kategori berita"
        tabs={tabs.map((label) => ({ id: label, label }))}
        activeId={category}
        onChange={(value: string) => {
          setCategory(value);
          setLimit(PAGE_SIZE);
        }}
      />

      {term && (
        <p className="mt-8 text-[15px] text-[var(--color-body)]">
          {t("Hasil pencarian untuk")} <strong className="text-ink">&ldquo;{initialQuery}&rdquo;</strong>
        </p>
      )}

      <div className="mt-8 lg:mt-12">
        {filtered.slice(0, limit).map((item) => (
          <BeritaRow key={item.slug} item={item} />
        ))}
        {filtered.length === 0 && <p className="py-12 text-center text-[var(--color-muted)]">{t("Belum ada berita di kategori ini.")}</p>}
      </div>

      {filtered.length > limit && (
        <div className="mt-10 flex justify-center lg:mt-14">
          <button
            type="button"
            onClick={() => setLimit((value) => value + PAGE_SIZE)}
            className="h-12 cursor-pointer rounded-full border-2 border-navy-ink px-10 text-base font-semibold text-navy-ink transition-colors hover:bg-primary hover:text-white lg:h-14 lg:text-lg"
          >
            {t("Muat berita lainnya")}
          </button>
        </div>
      )}
    </>
  );
}
