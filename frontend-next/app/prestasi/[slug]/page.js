import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  PrestasiArticle,
  PrestasiAside,
  PrestasiGallery,
  PrestasiHero,
  PrestasiMiniFooter,
} from "@/components/prestasi/PrestasiDetail";
import { getPrestasi, getPrestasiList } from "@/lib/api/contentApi";

export async function generateStaticParams() {
  return (await getPrestasiList()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPrestasi(slug);
  return {
    title: data ? `${data.title} - Prestasi SMKN 2 Kota Mojokerto` : "Prestasi - SMKN 2 Kota Mojokerto",
    description: data?.ringkasan,
  };
}

export default async function PrestasiDetailPage({ params }) {
  const { slug } = await params;
  const data = await getPrestasi(slug);
  if (!data) notFound();

  return (
    <>
      <Navbar variant="transparent" />
      <main className="flex-1 bg-[#f5f7fa]">
        <PrestasiHero data={data} />

        <div className="page-container py-12 lg:py-[78px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,730px)_minmax(0,521px)] lg:justify-between">
            <PrestasiArticle data={data} />
            <PrestasiAside data={data} />
          </div>

          {data.galeri && (
            <>
              <hr className="my-14 border-[#dbe3ee] lg:my-[110px]" />
              <PrestasiGallery galeri={data.galeri} />
            </>
          )}
        </div>
        <PrestasiMiniFooter />
      </main>
      <Footer />
    </>
  );
}
