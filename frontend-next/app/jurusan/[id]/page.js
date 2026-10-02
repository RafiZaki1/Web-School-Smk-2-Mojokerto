import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JurusanHero from "@/components/jurusan/JurusanHero";
import {
  FasilitasBelajar,
  KompetensiUtama,
  MitraJurusan,
  ProspekKarier,
  TentangJurusan,
} from "@/components/jurusan/JurusanDetailSections";
import { getJurusan, getJurusanList, getMitraLanding } from "@/lib/api/contentApi";

export async function generateStaticParams() {
  return (await getJurusanList()).map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const jurusan = await getJurusan(id?.toLowerCase());
  if (!jurusan) return { title: "Jurusan Tidak Ditemukan - SMKN 2 Kota Mojokerto" };

  return {
    title: `${jurusan.fullName} (${jurusan.code}) - SMKN 2 Kota Mojokerto`,
    description: jurusan.desc,
  };
}

export default async function JurusanDetailPage({ params }) {
  const { id } = await params;
  const [jurusan, mitraSekolah] = await Promise.all([getJurusan(id?.toLowerCase()), getMitraLanding()]);

  if (!jurusan) notFound();

  return (
    <>
      <Navbar variant="light" />

      <main className="flex-1 pt-28 pb-20 sm:pt-32 lg:pt-[132px] lg:pb-28">
        <div className="page-container space-y-16 lg:space-y-[88px]">
          <JurusanHero jurusan={jurusan} />
          <TentangJurusan jurusan={jurusan} />
          <KompetensiUtama items={jurusan.kompetensi} />
          <ProspekKarier items={jurusan.karir} />
          <MitraJurusan partners={jurusan.mitra || mitraSekolah} />
          <FasilitasBelajar items={jurusan.fasilitas} title={jurusan.fasilitasTitle} />
        </div>
      </main>

      <Footer />
    </>
  );
}
