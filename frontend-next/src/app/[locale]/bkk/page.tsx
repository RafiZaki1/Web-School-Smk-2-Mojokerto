import type { Metadata } from "next";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import PageHero from "@/shared/components/layout/PageHero";
import { getTranslator } from "@/shared/lib/i18n/server";
import { BkkAbout, BkkLokerTerkini, BkkMitra, BkkRekrut, BkkVisiMisi, getBkkContent, getLowonganList } from "@/features/bkk";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = `${t("Bursa Kerja Khusus (BKK)")} - SMKN 2 Kota Mojokerto`;
  const description = t("Jembatan penghubung lulusan SMKN 2 Mojokerto dengan dunia usaha dan dunia industri.");
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function BkkPage() {
  const [bkk, lowongan] = await Promise.all([getBkkContent(), getLowonganList()]);

  return (
    <>
      <Navbar variant="light" />
      <main className="relative isolate flex-1 bg-[var(--color-surface-alt)] pt-[100px] lg:pt-[120px]">
        <div className="page-container space-y-16 pb-16 lg:space-y-[146px] lg:pb-[100px]">
        <PageOrnaments theme="bkk" />
          <PageHero
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
