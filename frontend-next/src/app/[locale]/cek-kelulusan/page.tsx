import type { Metadata } from "next";
import PublicPage from "@/shared/components/layout/PublicPage";
import { CekKelulusanView } from "@/features/kelulusan";
import { getTranslator } from "@/shared/lib/i18n/server";

const TITLE = "Cek Kelulusan - SMKN 2 Kota Mojokerto";
const DESCRIPTION = "Cek hasil kelulusan siswa kelas XII SMKN 2 Kota Mojokerto dengan NISN dan tanggal lahir, serta Direktori Lulusan angkatan sebelumnya.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = t(TITLE);
  const description = t(DESCRIPTION);
  return { title, description, alternates: { canonical: "/cek-kelulusan" }, openGraph: { title, description, type: "website" } };
}

export default function CekKelulusanPage() {
  return (
    <PublicPage ornaments="kelulusan">
      <CekKelulusanView />
    </PublicPage>
  );
}
