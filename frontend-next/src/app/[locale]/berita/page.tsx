import { Suspense } from "react";
import type { Metadata } from "next";
import PublicPage from "@/shared/components/layout/PublicPage";
import { BeritaExplorer, BeritaExplorerFromUrl, getBeritaKategori, getBeritaList } from "@/features/berita";
import { getTranslator } from "@/shared/lib/i18n/server";

const TITLE = "Semua Berita & Artikel - SMKN 2 Kota Mojokerto";
const DESCRIPTION = "Ikuti terus informasi dan berita-berita terbaru tentang SMK Negeri 2 Kota Mojokerto.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = t(TITLE);
  const description = t(DESCRIPTION);
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function BeritaPage() {
  const [items, categories, t] = await Promise.all([getBeritaList(), getBeritaKategori(), getTranslator()]);

  return (
    <PublicPage className="bg-card" ornaments="berita">
      <h1 className="text-3xl font-bold tracking-[-0.02em] text-navy-deep-ink sm:text-4xl lg:mt-6 lg:text-5xl">{t("Semua Berita & Artikel")}</h1>
      <p className="mt-3 text-base text-[var(--color-body)] sm:text-lg">{t(DESCRIPTION)}</p>
      <Suspense fallback={<BeritaExplorer items={items} categories={categories} />}>
        <BeritaExplorerFromUrl items={items} categories={categories} />
      </Suspense>
    </PublicPage>
  );
}
