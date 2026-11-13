"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import type { BeritaTeaser } from "../types/berita.type";
import { useTranslation } from "@/shared/hooks/useTranslation";

function SideCard({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <section className="rounded-3xl border border-line bg-card p-6 shadow-[0_8px_24px_rgba(19,35,44,0.05)] lg:p-7">
      <h2 className="border-l-4 border-primary pl-3 text-lg font-semibold text-ink">{t(title)}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

interface BeritaSidebarProps {
  terbaru: BeritaTeaser[];
  kategori: string[];
}

export function BeritaSidebar({ terbaru, kategori }: BeritaSidebarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/berita?cari=${encodeURIComponent(query)}`);
  };

  return (
    <aside className="space-y-8">
      <SideCard title="Pencarian">
        <form role="search" className="relative" onSubmit={onSearch}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("Cari berita...")}
            aria-label={t("Cari berita")}
            className="h-12 w-full rounded-full border border-[var(--color-line)] bg-[var(--color-surface-alt)] pr-12 pl-5 text-sm text-ink focus:border-primary"
          />
          <button type="submit" aria-label={t("Cari")} className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary text-white">
            <Search size={15} aria-hidden="true" />
          </button>
        </form>
      </SideCard>

      <SideCard title="Berita Terbaru">
        <ul className="space-y-5">
          {terbaru.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group flex gap-4">
                {item.thumb ? (
                  <span className="relative block h-[86px] w-[86px] shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.thumb} alt="" fill sizes="86px" className="object-cover" aria-hidden="true" />
                  </span>
                ) : (
                  <span className={`h-[86px] w-[86px] shrink-0 rounded-xl bg-gradient-to-br ${item.gradient}`} aria-hidden="true" />
                )}
                <span className="min-w-0 pt-1">
                  <span className="line-clamp-2 text-sm leading-snug font-medium text-ink group-hover:text-primary">{t(item.title)}</span>
                  <span className="mt-1.5 block text-xs font-semibold text-primary">{t(item.tag)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </SideCard>

      <SideCard title="Kategori">
        <ul className="space-y-3.5">
          {kategori.map((label) => (
            <li key={label}>
              <Link href={`/berita?kategori=${encodeURIComponent(label)}`} className="text-[15px] text-[var(--color-body)] hover:text-primary">
                {t(label)}
              </Link>
            </li>
          ))}
        </ul>
      </SideCard>
    </aside>
  );
}
