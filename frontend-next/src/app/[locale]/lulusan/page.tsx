import type { Metadata } from "next";
import PublicPage from "@/shared/components/layout/PublicPage";
import { LulusanDirektori, getLulusanList } from "@/features/lulusan";
import { getTranslator } from "@/shared/lib/i18n/server";

const TITLE = "Semua Lulusan Terbaik - SMKN 2 Kota Mojokerto";
const DESCRIPTION = "Mereka yang membuktikan pendidikan vokasi di SMKN 2 Mojokerto benar-benar membuka jalan karier.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = t(TITLE);
  const description = t(DESCRIPTION);
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function LulusanPage() {
  const [items, t] = await Promise.all([getLulusanList(), getTranslator()]);

  return (
    <PublicPage ornaments="lulusan">
      <h1 className="text-3xl font-bold text-[var(--color-body)] sm:text-[32px]">{t("Semua Lulusan Terbaik")}</h1>
      <p className="mt-3 max-w-[680px] text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">{t(DESCRIPTION)}</p>
      <LulusanDirektori items={items} />
    </PublicPage>
  );
}
