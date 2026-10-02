import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/common/PageHero";
import { BkkAbout, BkkLokerTerkini, BkkMitra, BkkRekrut, BkkVisiMisi } from "@/components/bkk/BkkSections";
import { getBkkContent, getLowonganList } from "@/lib/api/contentApi";

export const metadata = {
  title: "Bursa Kerja Khusus (BKK) - SMKN 2 Kota Mojokerto",
  description: "Jembatan penghubung lulusan SMKN 2 Mojokerto dengan dunia usaha dan dunia industri.",
};

export default async function BkkPage() {
  const [bkk, lowongan] = await Promise.all([getBkkContent(), getLowonganList()]);

  return (
    <>
      <Navbar variant="light" />
      <main className="flex-1 bg-[#f9fafb] pt-[100px] lg:pt-[120px]">
        <div className="page-container space-y-16 pb-16 lg:space-y-[146px] lg:pb-[100px]">
          <PageHero
            badge="Platform Resmi"
            title="Bursa Kerja Khusus (BKK)"
            description="Jembatan penghubung lulusan SMKN 2 Mojokerto dengan dunia usaha dan dunia industri."
          />
          <BkkAbout />
        </div>

        <BkkVisiMisi visi={bkk.visi} misi={bkk.misi} />

        <div className="page-container space-y-16 py-16 lg:space-y-[90px] lg:py-[110px]">
          <BkkRekrut items={bkk.rekrut} />
          <BkkMitra items={bkk.mitra} />
          <BkkLokerTerkini items={lowongan.filter((job) => job.poster && job.status === "Aktif").slice(0, 3)} />
        </div>
      </main>
      <Footer />
    </>
  );
}
