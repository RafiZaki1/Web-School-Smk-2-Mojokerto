import type { Metadata } from "next";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import { getTranslator } from "@/shared/lib/i18n/server";
import { getBeritaKategori, getBeritaList } from "@/features/berita";
import { getEkstraList } from "@/features/ekstrakurikuler";
import { DenahInteraktif } from "@/features/denah";
import { getJurusanList } from "@/features/jurusan";
import { getLulusanTerbaik, getTestimoniAlumni } from "@/features/lulusan";
import { getPrestasiList } from "@/features/prestasi";
import {
  BeritaSection,
  EkstrakurikulerSection,
  HeroSection,
  JurusanSection,
  KaryaSiswaSection,
  KuisJurusanSection,
  LulusanSection,
  MitraSection,
  PklSection,
  PortalBelajarSection,
  PrestasiSection,
  SambutanSection,
  TestimoniAlumniSection,
  VisiMisiSection,
  getHomeData,
  getMitraLanding,
  getSambutanContent,
} from "@/features/home";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

const DEFAULT_SCHOOL_NAME = "SMK Negeri 2 Kota Mojokerto";
const DEFAULT_DESCRIPTION = "Pusat keunggulan vokasi, teknologi, rekayasa perangkat lunak, dan seni kuliner di Kota Mojokerto.";

export async function generateMetadata(): Promise<Metadata> {
  const [homeData, t] = await Promise.all([getHomeData(), getTranslator()]);
  const schoolName = homeData?.school_profile?.school_name || homeData?.hero?.school_name || DEFAULT_SCHOOL_NAME;
  const description = t(homeData?.school_profile?.description || DEFAULT_DESCRIPTION);
  const title = `${schoolName} - ${t("Disiplin, Berakhlak, Berprestasi")}`;

  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function HomePage() {
  const [homeData, jurusan, mitra, ekstra, lulusan, prestasi, berita, beritaKategori, sambutan, testimoni] = await Promise.all([
    getHomeData(),
    getJurusanList(),
    getMitraLanding(),
    getEkstraList(),
    getLulusanTerbaik(),
    getPrestasiList(),
    getBeritaList(6),
    getBeritaKategori(),
    getSambutanContent(),
    getTestimoniAlumni(),
  ]);
  const schoolProfile = homeData?.school_profile ?? null;
  const schoolName = schoolProfile?.school_name || homeData?.hero?.school_name || DEFAULT_SCHOOL_NAME;

  // Urutan section mengikuti landing page di Figma
  return (
    <>
      <Navbar variant="transparent" schoolName={schoolName} />

      <main className="flex-1">
        <HeroSection />
        <SambutanSection statistics={homeData?.statistics ?? {}} sambutan={sambutan} />
        <PortalBelajarSection />
        <VisiMisiSection />
        <DenahInteraktif />
        <KuisJurusanSection />
        <JurusanSection items={jurusan} />
        <PklSection />
        <KaryaSiswaSection />
        <MitraSection partners={mitra} />
        <EkstrakurikulerSection items={ekstra} />
        <LulusanSection items={lulusan} />
        <TestimoniAlumniSection items={testimoni} />
        <PrestasiSection items={prestasi} />
        <BeritaSection items={berita} categories={beritaKategori} />
      </main>

      <Footer />
    </>
  );
}
