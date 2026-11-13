import type { Metadata } from "next";
import BackLink from "@/shared/components/ui/BackLink";
import { BkkFooter, BkkHeader, LowonganExplorer, getLowonganKategori, getLowonganList } from "@/features/bkk";
import { getTranslator } from "@/shared/lib/i18n/server";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

const TITLE = "Semua Lowongan - BKK SMKN 2 Kota Mojokerto";
const DESCRIPTION = "Daftar lengkap lowongan kerja yang tersedia melalui Bursa Kerja Khusus SMKN 2 Kota Mojokerto.";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = t(TITLE);
  const description = t(DESCRIPTION);
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function LowonganPage() {
  const [items, kategori, t] = await Promise.all([getLowonganList(), getLowonganKategori(), getTranslator()]);

  return (
    <>
      <BkkHeader active="Lowongan" />
      <main className="relative isolate flex-1 bg-page py-8 lg:py-10">
        <div className="page-container">
        <PageOrnaments theme="lowongan" />
          <BackLink href="/bkk" variant="arrow" className="font-normal text-[var(--color-body)] hover:text-navy-ink">
            Kembali ke BKK
          </BackLink>
          <h1 className="mt-6 text-2xl font-medium text-ink sm:text-[28px]">{t("Semua Lowongan")}</h1>
          <p className="mt-2 max-w-[740px] text-base leading-relaxed text-[var(--color-body)] sm:text-lg">{t(DESCRIPTION)}</p>
          <LowonganExplorer items={items} kategori={kategori} />
        </div>
      </main>
      <BkkFooter />
    </>
  );
}
