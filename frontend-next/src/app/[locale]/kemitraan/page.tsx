import type { Metadata } from "next";
import PublicPage from "@/shared/components/layout/PublicPage";
import { KemitraanView, getKemitraanData } from "@/features/kemitraan";
import { getTranslator } from "@/shared/lib/i18n/server";

export const revalidate = 60;

const TITLE = "Kemitraan & PKL - SMKN 2 Kota Mojokerto";
const DESCRIPTION = "Daftar mitra dunia usaha dan dunia industri (DU/DI) SMKN 2 Kota Mojokerto per jurusan, beserta dokumentasi Praktik Kerja Lapangan siswa.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = t(TITLE);
  const description = t(DESCRIPTION);
  return { title, description, alternates: { canonical: "/kemitraan" }, openGraph: { title, description, type: "website" } };
}

export default async function KemitraanPage() {
  const data = await getKemitraanData();
  return (
    <PublicPage ornaments="kemitraan">
      <KemitraanView data={data} />
    </PublicPage>
  );
}
