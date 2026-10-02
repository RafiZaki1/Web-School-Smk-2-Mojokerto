"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

function SideCard({ title, children }) {
  return (
    <section className="rounded-3xl border border-[#eef0f4] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] lg:p-7">
      <h2 className="border-l-4 border-primary pl-3 text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function BeritaSidebar({ terbaru, kategori }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <aside className="space-y-8">
      <SideCard title="Pencarian">
        <form
          role="search"
          className="relative"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(`/berita?cari=${encodeURIComponent(query)}`);
          }}
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari berita..."
            aria-label="Cari berita"
            className="h-12 w-full rounded-full border border-[#e2e8f0] bg-[#f8fafc] pr-12 pl-5 text-sm text-ink outline-none focus:border-primary"
          />
          <button type="submit" aria-label="Cari" className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary text-white">
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
                  <img src={item.thumb} alt="" aria-hidden="true" loading="lazy" className="h-[86px] w-[86px] shrink-0 rounded-xl object-cover" />
                ) : (
                  <span className={`h-[86px] w-[86px] shrink-0 rounded-xl bg-gradient-to-br ${item.gradient}`} aria-hidden="true" />
                )}
                <span className="min-w-0 pt-1">
                  <span className="line-clamp-2 text-sm leading-snug font-medium text-ink group-hover:text-primary">{item.title}</span>
                  <span className="mt-1.5 block text-xs font-semibold text-primary">{item.tag}</span>
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
              <Link href={`/berita?kategori=${encodeURIComponent(label)}`} className="text-[15px] text-[#4b5563] hover:text-primary">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </SideCard>
    </aside>
  );
}
