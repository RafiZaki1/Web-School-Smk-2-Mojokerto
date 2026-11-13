"use client";

import Image from "next/image";
import Link from "next/link";
import { Trophy } from "lucide-react";
import type { PrestasiCardItem, PrestasiTone } from "../types/prestasi.type";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { localizeDate } from "@/shared/lib/i18n/date";

const TONES: Record<PrestasiTone, string> = {
  blue: "from-[var(--color-primary)] to-[var(--color-navy)]",
  teal: "from-[var(--color-brand)] to-[var(--color-primary-dark)]",
  indigo: "from-[var(--color-navy)] to-[var(--color-navy-deep)]",
  sky: "from-[var(--color-accent)] to-[var(--color-primary)]",
};

export default function PrestasiCard({ item }: { item: PrestasiCardItem }) {
  const { t, locale } = useTranslation();
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-line)] bg-card shadow-[0_1px_3px_rgba(19,35,44,0.06)] transition-shadow hover:shadow-md">
      <div className={`relative flex h-48 flex-col justify-between overflow-hidden bg-gradient-to-br p-5 lg:h-[216px] ${TONES[item.tone]}`}>
        {item.image && (
          <>
            <Image
              src={item.image}
              alt={t(item.title)}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,35,54,0.92)] via-[rgba(8,35,54,0.55)] to-[rgba(8,35,54,0.25)]" />
          </>
        )}
        <span className="relative z-10 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-sun)] px-3 py-1 text-xs font-semibold text-sun-ink shadow-sm">
          <Trophy size={12} strokeWidth={2.5} aria-hidden="true" />
          {t(item.badge)}
        </span>
        <p className="relative z-10 line-clamp-2 text-lg leading-snug font-semibold text-white sm:text-xl">{t(item.cardTitle)}</p>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6 lg:px-7 lg:py-7">
        <div>
          <p className="text-xs font-bold tracking-[0.06em] text-[var(--color-body)] uppercase">
            {localizeDate(item.date, locale)} • {t(item.level)}
          </p>
          <h2 className="mt-2 text-lg leading-snug font-semibold text-blue sm:text-xl">
            <Link href={`/prestasi/${item.slug}`} className="hover:underline">
              {t(item.title)}
            </Link>
          </h2>
        </div>
        <p className="mt-4 text-sm text-[var(--color-body)]">{t(item.subtitle)}</p>
      </div>
    </article>
  );
}
