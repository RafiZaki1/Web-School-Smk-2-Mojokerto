import { notFound } from "next/navigation";
import { CalendarDays, UserRound } from "lucide-react";
import PublicPage from "@/components/layout/PublicPage";
import BeritaSidebar from "@/components/berita/BeritaSidebar";
import { getBeritaDetail, getBeritaKategori, getBeritaList } from "@/lib/api/contentApi";

export async function generateStaticParams() {
  return (await getBeritaList()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const berita = await getBeritaDetail(slug);
  return {
    title: berita ? `${berita.title} - SMKN 2 Kota Mojokerto` : "Berita - SMKN 2 Kota Mojokerto",
    description: berita?.paragraphs?.[0],
  };
}

export default async function BeritaDetailPage({ params }) {
  const { slug } = await params;
  const [berita, latest, categories] = await Promise.all([getBeritaDetail(slug), getBeritaList(5), getBeritaKategori()]);
  if (!berita) notFound();

  const terbaru = latest
    .filter((item) => item.slug !== slug)
    .slice(0, 4)
    .map((item) => ({ title: item.title, tag: item.category, gradient: item.gradient, thumb: item.thumb, href: `/berita/${item.slug}` }));

  return (
    <PublicPage className="bg-white" contentClassName="grid gap-12 lg:grid-cols-[minmax(0,857px)_416px] lg:justify-between">
      <article>
        {berita.hero ? (
          <img src={berita.hero} alt={berita.title} className="aspect-[857/432] w-full rounded-3xl object-cover" />
        ) : (
          <div className={`aspect-[857/432] w-full rounded-3xl bg-gradient-to-br ${berita.gradient}`} aria-hidden="true" />
        )}

        <span className="mt-7 inline-flex rounded-md bg-[#ffedd5] px-3 py-1 text-xs font-bold tracking-wide text-[#c2410c] uppercase">
          {berita.category}
        </span>
        <h1 className="mt-4 text-2xl leading-snug font-bold text-ink sm:text-3xl lg:text-[36px] lg:leading-[1.25]">{berita.title}</h1>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-[#e5e7eb] pb-5 text-sm text-[#4b5563]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={15} aria-hidden="true" />
            {berita.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UserRound size={15} aria-hidden="true" />
            {berita.author}
          </span>
        </p>

        <div className="mt-6 space-y-5 text-base leading-[1.75] text-[#4b5563]">
          {berita.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>

        {berita.gallery.length > 0 && (
          <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-[17px]">
            {berita.gallery.map((src, index) => (
              <img key={src} src={src} alt={`Dokumentasi ${index + 1}`} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
            ))}
          </div>
        )}
      </article>

      <BeritaSidebar terbaru={terbaru} kategori={categories} />
    </PublicPage>
  );
}
