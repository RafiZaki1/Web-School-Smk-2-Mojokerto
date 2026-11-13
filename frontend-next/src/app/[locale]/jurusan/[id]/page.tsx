import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import { getTranslator } from "@/shared/lib/i18n/server";
import { getMitraLanding } from "@/features/home";
import { FasilitasBelajar, getJurusan, getJurusanList, JurusanHero, KompetensiUtama, MitraJurusan, ProspekKarier, TentangJurusan } from "@/features/jurusan";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";
import { jurusanOrnamentTheme } from "@/shared/components/ui/PageOrnaments";

export async function generateStaticParams() {
  return (await getJurusanList()).map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const [jurusan, t] = await Promise.all([getJurusan(id.toLowerCase()), getTranslator()]);
  if (!jurusan) return { title: `${t("Jurusan Tidak Ditemukan")} - SMKN 2 Kota Mojokerto` };

  const title = `${t(jurusan.fullName)} (${t(jurusan.code)}) - SMKN 2 Kota Mojokerto`;
  const description = jurusan.desc ? t(jurusan.desc) : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: [jurusan.image] },
  };
}

export default async function JurusanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [jurusan, mitraSekolah] = await Promise.all([getJurusan(id.toLowerCase()), getMitraLanding()]);

  if (!jurusan) notFound();

  return (
    <>
      <Navbar variant="light" />

      <main className="relative isolate flex-1 overflow-x-clip pt-28 pb-20 sm:pt-32 lg:pt-[132px] lg:pb-28">
        <div className="page-container space-y-16 lg:space-y-[88px]">
        <PageOrnaments theme={jurusanOrnamentTheme(jurusan.id)} />
          <JurusanHero jurusan={jurusan} />
          <TentangJurusan jurusan={jurusan} />
          <KompetensiUtama items={jurusan.kompetensi} />
          <ProspekKarier items={jurusan.karir} />
          <MitraJurusan partners={jurusan.mitra ?? mitraSekolah} />
          <FasilitasBelajar items={jurusan.fasilitas} title={jurusan.fasilitasTitle} />
        </div>
      </main>

      <Footer />
    </>
  );
}
