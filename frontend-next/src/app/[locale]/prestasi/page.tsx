import type { Metadata } from "next";
import BackLink from "@/shared/components/ui/BackLink";
import { PrestasiExplorer, getPrestasiList } from "@/features/prestasi";
import { getTranslator } from "@/shared/lib/i18n/server";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

const TITLE = "Semua Prestasi - SMKN 2 Kota Mojokerto";
const DESCRIPTION = "Deretan penghargaan siswa SMKN 2 Kota Mojokerto di ajang lokal, nasional, hingga internasional.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = t(TITLE);
  const description = t(DESCRIPTION);
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function PrestasiPage() {
  const [items, t] = await Promise.all([getPrestasiList(), getTranslator()]);

  return (
    <main className="relative isolate flex-1 bg-page py-12 lg:py-[64px]">
      <div className="page-container">
      <PageOrnaments theme="prestasi" />
        <BackLink href="/#prestasi" variant="arrow" className="text-xl font-normal text-blue hover:text-blue-dark sm:text-2xl">
          Kembali
        </BackLink>
        <h1 className="mt-6 text-3xl font-bold text-heading sm:text-[32px]">{t("Semua Prestasi")}</h1>
        <p className="mt-4 max-w-[785px] text-base leading-relaxed text-[var(--color-body)] sm:text-lg">{t(DESCRIPTION)}</p>

        <PrestasiExplorer items={items} />
      </div>
    </main>
  );
}
