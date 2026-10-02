"use client";

import { CATEGORY_ORDER, categoryMeta } from "@/lib/denah/meta";

/**
 * Filter kategori ruangan: kolom vertikal di desktop (sesuai Figma),
 * deret pil yang bisa digeser di tablet/mobile.
 */
export default function CategoryFilter({ categories, active, onChange }) {
  const available = new Set(categories.map((category) => category.slug));
  const slugs = ["semua", ...CATEGORY_ORDER.filter((slug) => available.has(slug))];

  return (
    <div
      role="tablist"
      aria-label="Kategori ruangan"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0"
    >
      {slugs.map((slug) => {
        const { label, icon: Icon } = categoryMeta(slug);
        const isActive = slug === active;
        return (
          <button
            key={slug}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(slug)}
            className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors lg:w-full lg:px-3.5 lg:py-3 ${
              isActive ? "bg-[#0b2a5b] text-white" : "border border-[#e2e8f0] bg-white text-ink hover:bg-[#f1f5f9] lg:border-transparent"
            }`}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
