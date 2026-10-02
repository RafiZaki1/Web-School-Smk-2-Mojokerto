import PublicPage from "@/components/layout/PublicPage";
import LulusanDirektori from "@/components/lulusan/LulusanDirektori";
import { getLulusanList } from "@/lib/api/contentApi";

export const metadata = {
  title: "Semua Lulusan Terbaik - SMKN 2 Kota Mojokerto",
  description: "Mereka yang membuktikan pendidikan vokasi di SMKN 2 Mojokerto benar-benar membuka jalan karier.",
};

export default async function LulusanPage() {
  const items = await getLulusanList();

  return (
    <PublicPage>
      <h1 className="text-3xl font-bold text-[#1f2937] sm:text-[32px]">Semua Lulusan Terbaik</h1>
      <p className="mt-3 max-w-[680px] text-base leading-relaxed text-[#6b7280] sm:text-lg">
        Mereka yang membuktikan pendidikan vokasi di SMKN 2 Mojokerto benar-benar membuka jalan karier.
      </p>
      <LulusanDirektori items={items} />
    </PublicPage>
  );
}
