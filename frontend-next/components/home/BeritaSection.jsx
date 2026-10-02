"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import TabButtons from "@/components/ui/TabButtons";
import Link from "next/link";


function CategoryBadge({ category, featured }) {
  const tone = category === "Prestasi" ? "bg-gold text-[#402600]" : featured ? "bg-white text-primary" : "bg-white text-accent";
  return <span className={`inline-flex w-fit rounded-full px-4 py-1 text-[13px] font-bold ${tone}`}>{category}</span>;
}

function ArticleDate({ date }) {
  return (
    <p className="flex items-center gap-3 text-[13px] font-bold text-white/80">
      <CalendarDays size={16} aria-hidden="true" />
      {date}
    </p>
  );
}

export default function BeritaSection({ items = [], categories = [] }) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const ARTICLES = items.slice(0, 6);
  const CATEGORIES = ["Semua", ...categories];

  const filtered =
    activeCategory === "Semua" ? ARTICLES : ARTICLES.filter((article) => article.category === activeCategory);
  const [featured, ...rest] = filtered;
  const sideArticles = rest.slice(0, 2);

  return (
    <section id="informasi" className="section pt-0 lg:pt-0">
      <div className="page-container">
        <SectionHeader
          title="Berita & Artikel"
          description="Ikuti terus informasi dan berita-berita terbaru tentang SMK Negeri 2 Kota Mojokerto."
        />

        <TabButtons
          tabs={CATEGORIES.map((category) => ({ id: category, label: category }))}
          activeId={activeCategory}
          onChange={setActiveCategory}
          ariaLabel="Kategori berita"
        />

        {featured && (
          <div
            className={`mt-8 grid gap-5 lg:mt-9 ${sideArticles.length ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]" : ""}`}
          >
            <article
              className="flex min-h-[300px] flex-col justify-center gap-6 rounded-3xl p-7 text-white sm:p-10 lg:min-h-[453px] lg:rounded-[35px] lg:p-[52px]"
              style={{ backgroundImage: "linear-gradient(150deg, #006494 0%, #009be3 100%)" }}
            >
              <CategoryBadge category={featured.category} featured />
              <h3 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl lg:text-[35px] lg:leading-[1.3]">
                <Link href={`/berita/${featured.slug}`} className="hover:underline">
                  {featured.title}
                </Link>
              </h3>
              <ArticleDate date={featured.date} />
            </article>

            {sideArticles.length > 0 && (
              <div className="grid gap-5">
                {sideArticles.map((article) => (
                  <article
                    key={article.slug}
                    className="flex flex-col justify-center gap-3 rounded-3xl bg-accent p-7 text-white lg:rounded-[35px] lg:px-[35px] lg:py-6"
                  >
                    <CategoryBadge category={article.category} />
                    <h3 className="text-xl leading-snug font-bold sm:text-2xl lg:text-[26px] lg:leading-[1.4]">
                      <Link href={`/berita/${article.slug}`} className="hover:underline">
                        {article.title}
                      </Link>
                    </h3>
                    <ArticleDate date={article.date} />
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button href="/berita" variant="link" withArrow>
            Lihat semua berita
          </Button>
        </div>
      </div>
    </section>
  );
}
