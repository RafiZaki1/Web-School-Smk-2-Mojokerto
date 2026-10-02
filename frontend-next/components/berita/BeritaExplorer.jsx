"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import TabButtons from "@/components/ui/TabButtons";
import { KATEGORI_TONES } from "@/lib/data/beritaData";

const PAGE_SIZE = 6;

function BeritaRow({ item }) {
  return (
    <article className="grid gap-5 border-b border-[#dee2e6] py-8 first:pt-0 sm:grid-cols-[346px_1fr] sm:gap-[43px] lg:py-[43px]">
      <Link href={`/berita/${item.slug}`} className="block overflow-hidden rounded-2xl" tabIndex={-1} aria-hidden="true">
        {item.thumb ? (
          <img src={item.thumb} alt="" loading="lazy" className="aspect-[346/230] w-full object-cover" />
        ) : (
          <span className={`block aspect-[346/230] w-full bg-gradient-to-br ${item.gradient}`} />
        )}
      </Link>
      <div className="min-w-0">
        <span className={`inline-flex rounded-md px-3 py-1 text-sm font-medium sm:text-base ${KATEGORI_TONES[item.category] ?? KATEGORI_TONES.Prestasi}`}>
          {item.category}
        </span>
        <h2 className="mt-3 line-clamp-3 text-2xl leading-tight font-bold tracking-[-0.01em] text-[#03192e] sm:text-3xl lg:text-[44px] lg:leading-[56px]">
          <Link href={`/berita/${item.slug}`} className="hover:text-primary">
            {item.title}
          </Link>
        </h2>
        <p className="mt-3 flex items-center gap-2.5 text-base text-[#4b5563] sm:text-lg">
          <CalendarDays size={16} aria-hidden="true" />
          {item.date}
        </p>
      </div>
    </article>
  );
}

export default function BeritaExplorer({ items, categories = [], initialQuery = "", initialCategory = "" }) {
  const TABS = ["Semua", ...categories];
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : "Semua");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const term = initialQuery.trim().toLowerCase();
  const filtered = items.filter(
    (item) => (category === "Semua" || item.category === category) && (!term || item.title.toLowerCase().includes(term))
  );

  return (
    <>
      <TabButtons
        variant="outline-dark"
        className="mt-10 lg:mt-[70px]"
        ariaLabel="Kategori berita"
        tabs={TABS.map((label) => ({ id: label, label }))}
        activeId={category}
        onChange={(value) => {
          setCategory(value);
          setLimit(PAGE_SIZE);
        }}
      />

      {term && (
        <p className="mt-8 text-[15px] text-[#4b5563]">
          Hasil pencarian untuk <strong className="text-ink">&ldquo;{initialQuery}&rdquo;</strong>
        </p>
      )}

      <div className="mt-10 lg:mt-[86px]">
        {filtered.slice(0, limit).map((item) => (
          <BeritaRow key={item.slug} item={item} />
        ))}
        {filtered.length === 0 && <p className="py-12 text-center text-[#6b7280]">Belum ada berita di kategori ini.</p>}
      </div>

      {filtered.length > limit && (
        <div className="mt-12 flex justify-center lg:mt-[130px]">
          <button
            type="button"
            onClick={() => setLimit((value) => value + PAGE_SIZE)}
            className="h-14 cursor-pointer rounded-full border-2 border-blue-deep px-12 text-lg font-semibold text-blue-deep transition-colors hover:bg-blue-deep hover:text-white lg:h-[68px] lg:w-[322px] lg:text-[22px]"
          >
            Muat berita lainnya
          </button>
        </div>
      )}
    </>
  );
}
