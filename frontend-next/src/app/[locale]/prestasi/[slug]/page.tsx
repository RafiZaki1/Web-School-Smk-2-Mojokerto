import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import { getTranslator } from "@/shared/lib/i18n/server";
import { PrestasiArticle, PrestasiAside, PrestasiGallery, PrestasiHero, PrestasiMiniFooter, getPrestasi, getPrestasiList } from "@/features/prestasi";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

export async function generateStaticParams() {
  return (await getPrestasiList()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [data, t] = await Promise.all([getPrestasi(slug), getTranslator()]);
  const title = data ? `${t(data.title)} - ${t("Prestasi SMKN 2 Kota Mojokerto")}` : `${t("Prestasi")} - SMKN 2 Kota Mojokerto`;
  const description = data?.ringkasan ? t(data.ringkasan) : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: data?.hero ? [data.hero] : undefined },
  };
}

export default async function PrestasiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPrestasi(slug);
  if (!data) notFound();

  return (
    <>
      <Navbar variant="transparent" />
      <main className="relative isolate flex-1 bg-page">
        <PrestasiHero data={data} />
        <PageOrnaments theme="prestasiDetail" />

        <div className="page-container py-12 lg:py-[78px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,730px)_minmax(0,521px)] lg:justify-between">
            <PrestasiArticle data={data} />
            <PrestasiAside data={data} />
          </div>

          {data.galeri && (
            <>
              <hr className="my-14 border-line lg:my-[110px]" />
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
