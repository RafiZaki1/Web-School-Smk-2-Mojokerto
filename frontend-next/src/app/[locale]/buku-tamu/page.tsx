import type { Metadata } from "next";
import PublicPage from "@/shared/components/layout/PublicPage";
import { BukuTamuView } from "@/features/buku-tamu";
import { getTranslator } from "@/shared/lib/i18n/server";

const TITLE = "Buku Tamu - SMKN 2 Kota Mojokerto";
const DESCRIPTION = "Kirim pesan ke Tata Usaha SMKN 2 Kota Mojokerto atau ajukan jadwal kunjungan instansi ke sekolah.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = t(TITLE);
  const description = t(DESCRIPTION);
  return { title, description, alternates: { canonical: "/buku-tamu" }, openGraph: { title, description, type: "website" } };
}

export default function BukuTamuPage() {
  return (
    <PublicPage ornaments="bukuTamu">
      <BukuTamuView />
    </PublicPage>
  );
}
