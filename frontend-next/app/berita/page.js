import PublicPage from "@/components/layout/PublicPage";
import BeritaExplorer from "@/components/berita/BeritaExplorer";
import { getBeritaKategori, getBeritaList } from "@/lib/api/contentApi";

export const metadata = {
  title: "Semua Berita & Artikel - SMKN 2 Kota Mojokerto",
  description: "Ikuti terus informasi dan berita-berita terbaru tentang SMK Negeri 2 Kota Mojokerto.",
};

export default async function BeritaPage({ searchParams }) {
  const { cari = "", kategori = "" } = await searchParams;
  const [items, categories] = await Promise.all([getBeritaList(), getBeritaKategori()]);
  return (
    <PublicPage className="bg-white">
      <h1 className="text-4xl font-bold tracking-[-0.02em] text-[#03192e] sm:text-5xl lg:mt-10 lg:text-[64px]">Semua Berita &amp; Artikel</h1>
      <p className="mt-3 text-base text-[#4b5563] sm:text-xl lg:text-[22px]">
        Ikuti terus informasi dan berita-berita terbaru tentang SMK Negeri 2 Kota Mojokerto.
      </p>
      <BeritaExplorer key={`${cari}-${kategori}`} items={items} categories={categories} initialQuery={cari} initialCategory={kategori} />
    </PublicPage>
  );
}
