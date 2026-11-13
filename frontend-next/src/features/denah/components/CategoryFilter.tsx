"use client";

import { CATEGORY_ORDER, categoryMeta } from "../constants/meta";
import type { RoomCategory } from "../types/denah.type";
import { useTranslation } from "@/shared/hooks/useTranslation";

/**
 * Filter kategori ruangan: deret pil di atas peta (bisa digeser bila tidak muat),
 * agar peta mendapat lebar penuh di desktop.
 */
export default function CategoryFilter({ categories, active, onChange }: { categories: RoomCategory[]; active: string; onChange: (slug: string) => void }) {
  const { t } = useTranslation();
  const available = new Set(categories.map((category) => category.slug));
  const slugs = ["semua", ...CATEGORY_ORDER.filter((slug) => available.has(slug))];

  return (
    <div
      role="tablist"
      aria-label={t("Kategori ruangan")}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0"
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
            className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? "bg-[var(--color-navy-deep)] text-white"
                : "border border-[var(--color-line)] bg-card text-ink hover:bg-[var(--color-surface-alt)]"
            }`}
          >
            <Icon size={16} aria-hidden="true" />
            {t(label)}
          </button>
        );
      })}
    </div>
  );
}
