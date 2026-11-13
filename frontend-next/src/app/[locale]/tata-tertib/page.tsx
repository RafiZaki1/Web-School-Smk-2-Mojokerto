import type { Metadata } from "next";
import PublicPage from "@/shared/components/layout/PublicPage";
import { TataTertibView, getStudentGuide } from "@/features/tata-tertib";
import { getTranslator } from "@/shared/lib/i18n/server";

export const revalidate = 60;

const TITLE = "Tata Tertib & Seragam - SMKN 2 Kota Mojokerto";
const DESCRIPTION = "Tata tertib siswa SMKN 2 Kota Mojokerto, jadwal seragam harian Senin sampai Jumat, dan seragam praktik produktif tiap jurusan.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = t(TITLE);
  const description = t(DESCRIPTION);
  return { title, description, alternates: { canonical: "/tata-tertib" }, openGraph: { title, description, type: "website" } };
}

export default async function TataTertibPage() {
  const guide = await getStudentGuide();
  return (
    <PublicPage ornaments="tataTertib">
      <TataTertibView guide={guide} />
    </PublicPage>
  );
}
