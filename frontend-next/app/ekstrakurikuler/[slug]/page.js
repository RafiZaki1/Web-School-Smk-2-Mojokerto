import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import BackLink from "@/components/common/BackLink";
import {
  EkstraGallery,
  EkstraHero,
  EkstraInfoCards,
  EkstraPrestasi,
  EkstraTentang,
  EkstraTestimoni,
} from "@/components/ekstra/EkstraDetail";
import { getEkstra, getEkstraList } from "@/lib/api/contentApi";

export async function generateStaticParams() {
  return (await getEkstraList()).map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ekstra = await getEkstra(slug);
  return {
    title: ekstra ? `Ekstrakurikuler ${ekstra.name} - SMKN 2 Kota Mojokerto` : "Ekstrakurikuler - SMKN 2 Kota Mojokerto",
    description: ekstra?.desc,
  };
}

export default async function EkstraDetailPage({ params }) {
  const { slug } = await params;
  const ekstra = await getEkstra(slug);
  if (!ekstra) notFound();

  return (
    <>
      <main className="flex-1 bg-page pt-10 pb-20 lg:pt-[45px] lg:pb-[150px]">
        <div className="page-container">
          <BackLink href="/#ekstrakurikuler" className="text-primary hover:text-accent">
            Kembali ke ekstrakurikuler
          </BackLink>

          <div className="mt-10 space-y-16 lg:mt-[82px] lg:space-y-[100px]">
            <div className="space-y-8 lg:space-y-[54px]">
              <EkstraHero ekstra={ekstra} />
              <EkstraInfoCards ekstra={ekstra} />
            </div>
            <EkstraTentang ekstra={ekstra} />
            {ekstra.gallery?.length ? <EkstraGallery images={ekstra.gallery} /> : null}
            {ekstra.prestasi?.length ? <EkstraPrestasi ekstra={ekstra} /> : null}
            {ekstra.testimoni ? <EkstraTestimoni testimoni={ekstra.testimoni} /> : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
