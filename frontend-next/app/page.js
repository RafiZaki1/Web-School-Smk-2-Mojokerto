import { homeApi } from "@/lib/api/homeApi";
import {
  getBeritaKategori,
  getBeritaList,
  getEkstraList,
  getJurusanList,
  getLulusanTerbaik,
  getMitraLanding,
  getPrestasiList,
} from "@/lib/api/contentApi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import SambutanSection from "@/components/home/SambutanSection";
import VisiMisiSection from "@/components/home/VisiMisiSection";
import JurusanSection from "@/components/home/JurusanSection";
import MitraSection from "@/components/home/MitraSection";
import EkstrakurikulerSection from "@/components/home/EkstrakurikulerSection";
import LulusanSection from "@/components/home/LulusanSection";
import PrestasiSection from "@/components/home/PrestasiSection";
import BeritaSection from "@/components/home/BeritaSection";
import DenahInteraktif from "@/components/denah/DenahInteraktif";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export async function generateMetadata() {
  const homeData = await homeApi.getHomeData();
  const schoolName =
    homeData?.school_profile?.school_name ||
    homeData?.hero?.school_name ||
    "SMK Negeri 2 Kota Mojokerto";

  return {
    title: `${schoolName} - Disiplin, Berakhlak, Berprestasi`,
    description:
      homeData?.school_profile?.description ||
      "Pusat keunggulan vokasi, teknologi, rekayasa perangkat lunak, dan seni kuliner di Kota Mojokerto.",
  };
}

export default async function HomePage() {
  const [homeData, jurusan, mitra, ekstra, lulusan, prestasi, berita, beritaKategori] = await Promise.all([
    homeApi.getHomeData(),
    getJurusanList(),
    getMitraLanding(),
    getEkstraList(),
    getLulusanTerbaik(),
    getPrestasiList(),
    getBeritaList(6),
    getBeritaKategori(),
  ]);
  const schoolProfile = homeData?.school_profile || null;
  const schoolName = schoolProfile?.school_name || homeData?.hero?.school_name || "SMK Negeri 2 Kota Mojokerto";

  // Urutan section mengikuti landing page di Figma
  return (
    <>
      <Navbar variant="transparent" schoolName={schoolName} />

      <main className="flex-1">
        <HeroSection />
        <SambutanSection statistics={homeData?.statistics || {}} />
        <VisiMisiSection />
        <DenahInteraktif />
        <JurusanSection items={jurusan} />
        <MitraSection partners={mitra} />
        <EkstrakurikulerSection items={ekstra} />
        <LulusanSection items={lulusan} />
        <PrestasiSection items={prestasi} />
        <BeritaSection items={berita} categories={beritaKategori} />
      </main>

      <Footer />
    </>
  );
}
