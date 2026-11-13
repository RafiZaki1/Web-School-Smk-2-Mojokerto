import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import BackLink from "@/shared/components/ui/BackLink";
import { KARYA_SISWA, KaryaAjakan, KaryaLainnya, KaryaShowcase, getKarya } from "@/features/karya-siswa";
import { getTranslator } from "@/shared/lib/i18n/server";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

export function generateStaticParams() {
  return KARYA_SISWA.map((karya) => ({ slug: karya.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const karya = getKarya(slug);
  const t = await getTranslator();
  if (!karya) return { title: `${t("Karya Siswa")} - SMKN 2 Kota Mojokerto` };

  const title = `${karya.nama} - ${t("Karya Siswa")} SMKN 2 Kota Mojokerto`;
  const description = t(karya.deskripsi);
  const image = karya.media.tipe === "aplikasi" ? karya.media.desktop : karya.media.src;
  return { title, description, openGraph: { title, description, type: "article", images: [image] } };
}

export default async function KaryaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const karya = getKarya(slug);
  if (!karya) notFound();
  const t = await getTranslator();

  return (
    <>
      <Navbar variant="light" />
      <main className="relative isolate flex-1 bg-card pt-[100px] pb-16 lg:pt-[120px] lg:pb-24">
        <div className="page-container">
        <PageOrnaments theme="karya" />
          <BackLink href="/karya-siswa" variant="arrow" className="text-base text-blue hover:text-blue-dark sm:text-lg">
            Semua Karya
          </BackLink>

          <div className="mt-6">
            <KaryaShowcase karya={karya} t={t} />
          </div>

          <KaryaAjakan jurusan={karya.jurusan} t={t} />

          <section aria-labelledby="karya-lainnya" className="mt-16 lg:mt-24">
            <h2 id="karya-lainnya" className="text-2xl font-bold text-heading sm:text-[32px]">
              {t("Karya lainnya")}
            </h2>
            <KaryaLainnya exclude={karya.slug} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
