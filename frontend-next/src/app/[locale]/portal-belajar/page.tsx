import type { Metadata } from "next";
import PublicPage from "@/shared/components/layout/PublicPage";
import PageHeading from "@/shared/components/layout/PageHeading";
import ContactPanel from "@/shared/components/ui/ContactPanel";
import {
  ELEARNING,
  ELearningCard,
  GuruExplorer,
  PortalHero,
  PortalSteps,
} from "@/features/portal-belajar";
import { getTranslator } from "@/shared/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = `${t("e-Learning & Data Guru")} - SMKN 2 Kota Mojokerto`;
  const description = t(
    "Informasi resmi e-Learning SMKN 2 Kota Mojokerto (smkn2mojokerto.my.id) beserta direktori lengkap Bapak & Ibu Guru pengampu mata pelajaran umum dan kejuruan.",
  );
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function PortalBelajarPage() {
  const t = await getTranslator();
  return (
    <PublicPage ornaments="portal">
      <PortalHero />
      <ELearningCard className="mt-8 lg:mt-12" />
      <PortalSteps className="mt-8 lg:mt-12" />

      <section id="data-guru" className="mt-14 scroll-mt-28 lg:mt-[96px]">
        <PageHeading
          size="xl"
          tone="blue"
          eyebrow={t("Direktori Pendidik • {domain}", { domain: ELEARNING.domain })}
          title="Data Bapak & Ibu Guru SMKN 2 Kota Mojokerto"
          description={t(
            "Daftar Bapak dan Ibu Guru pengampu mata pelajaran umum (Normatif & Adaptif), Bimbingan Konseling, Kewirausahaan, serta 5 Konsentrasi Keahlian beserta tautan langsung ke ruang kelas e-Learning.",
          )}
        />
        <GuruExplorer />
      </section>

      <ContactPanel
        className="mt-14 lg:mt-[88px]"
        title={t("Kendala akses akun {nama}?", { nama: ELEARNING.name })}
        description="Lupa password atau butuh bantuan masuk ke ruang kelas di smkn2mojokerto.my.id? Hubungi tim operator e-Learning sekolah melalui kontak berikut."
      />
    </PublicPage>
  );
}
