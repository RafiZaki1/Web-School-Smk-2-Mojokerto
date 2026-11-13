import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/shared/components/layout/Footer";
import BackLink from "@/shared/components/ui/BackLink";
import { getTranslator } from "@/shared/lib/i18n/server";
import { EkstraGallery, EkstraHero, EkstraInfoCards, EkstraPrestasi, EkstraTentang, EkstraTestimoni, getEkstra, getEkstraList } from "@/features/ekstrakurikuler";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

export async function generateStaticParams() {
  return (await getEkstraList()).map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [ekstra, t] = await Promise.all([getEkstra(slug), getTranslator()]);
  const title = `${ekstra ? t("Ekstrakurikuler {nama}", { nama: t(ekstra.name) }) : t("Ekstrakurikuler")} - SMKN 2 Kota Mojokerto`;
  const description = ekstra?.desc ? t(ekstra.desc) : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: ekstra ? [ekstra.image] : undefined },
  };
}

export default async function EkstraDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ekstra = await getEkstra(slug);
  if (!ekstra) notFound();

  return (
    <>
      <main className="relative isolate flex-1 bg-page pt-10 pb-20 lg:pt-[45px] lg:pb-[150px]">
        <div className="page-container">
        <PageOrnaments theme="ekstra" />
          <BackLink href="/#ekstrakurikuler" className="text-primary hover:text-accent">
            Kembali ke ekstrakurikuler
          </BackLink>

          <div className="mt-10 space-y-16 lg:mt-[82px] lg:space-y-[100px]">
            <div className="space-y-8 lg:space-y-[54px]">
              <EkstraHero ekstra={ekstra} />
              <EkstraInfoCards ekstra={ekstra} />
            </div>
            <EkstraTentang ekstra={ekstra} />
            {ekstra.gallery.length ? <EkstraGallery images={ekstra.gallery} /> : null}
            {ekstra.prestasi.length ? <EkstraPrestasi ekstra={ekstra} /> : null}
            {ekstra.testimoni ? <EkstraTestimoni testimoni={ekstra.testimoni} /> : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
