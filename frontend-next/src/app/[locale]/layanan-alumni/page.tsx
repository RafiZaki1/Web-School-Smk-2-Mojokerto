import type { Metadata } from "next";
import PublicPage from "@/shared/components/layout/PublicPage";
import { LayananAlumniView } from "@/features/layanan-alumni";
import { getTranslator } from "@/shared/lib/i18n/server";

const TITLE = "Layanan Berkas Alumni - SMKN 2 Kota Mojokerto";
const DESCRIPTION = "Ajukan pengambilan ijazah, cap tiga jari, atau legalisir di SMKN 2 Kota Mojokerto tanpa login, lalu pantau statusnya dari HP.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = t(TITLE);
  const description = t(DESCRIPTION);
  return { title, description, alternates: { canonical: "/layanan-alumni" }, openGraph: { title, description, type: "website" } };
}

export default function LayananAlumniPage() {
  return (
    <PublicPage ornaments="layananAlumni">
      <LayananAlumniView />
    </PublicPage>
  );
}
