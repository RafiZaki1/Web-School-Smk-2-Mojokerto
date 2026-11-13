import type { Metadata } from "next";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import PageHero from "@/shared/components/layout/PageHero";
import { KaryaExplorer } from "@/features/karya-siswa";
import { getTranslator } from "@/shared/lib/i18n/server";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

const DESCRIPTION =
  "Aplikasi, desain, kuliner, olahan pangan, hingga media edukasi keuangan: karya nyata siswa SMK Negeri 2 Kota Mojokerto yang lahir dari bekal PKL di dunia industri.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = `${t("Galeri Karya Siswa")} - SMKN 2 Kota Mojokerto`;
  const description = t(DESCRIPTION);
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default function KaryaSiswaPage() {
  return (
    <>
      <Navbar variant="light" />
      <main className="relative isolate flex-1 bg-card pt-[100px] pb-16 lg:pt-[120px] lg:pb-24">
        <div className="page-container">
        <PageOrnaments theme="karya" />
          <PageHero
            title="Galeri Karya Siswa"
            description={DESCRIPTION}
            image={null}
            overlay="bg-[linear-gradient(120deg,var(--color-navy-deep)_0%,var(--color-navy)_100%)]"
            className="shadow-[0_16px_32px_rgba(16,25,49,0.18)]"
          />

          <KaryaExplorer />
        </div>
      </main>
      <Footer />
    </>
  );
}
