import BackLink from "@/components/common/BackLink";
import { BkkFooter, BkkHeader } from "@/components/bkk/BkkChrome";
import LowonganExplorer from "@/components/bkk/LowonganExplorer";
import { getLowonganKategori, getLowonganList } from "@/lib/api/contentApi";

export const metadata = {
  title: "Semua Lowongan - BKK SMKN 2 Kota Mojokerto",
  description: "Daftar lengkap lowongan kerja yang tersedia melalui Bursa Kerja Khusus SMKN 2 Kota Mojokerto.",
};

export default async function LowonganPage() {
  const [items, kategori] = await Promise.all([getLowonganList(), getLowonganKategori()]);

  return (
    <>
      <BkkHeader active="Lowongan" />
      <main className="flex-1 bg-[#f7f9fb] py-8 lg:py-10">
        <div className="page-container">
          <BackLink href="/bkk" variant="arrow" className="font-normal text-[#374151] hover:text-blue-deep">
            Kembali ke BKK
          </BackLink>
          <h1 className="mt-6 text-2xl font-medium text-ink sm:text-[28px]">Semua Lowongan</h1>
          <p className="mt-2 max-w-[740px] text-base leading-relaxed text-[#4b5563] sm:text-lg">
            Daftar lengkap lowongan kerja yang tersedia melalui Bursa Kerja Khusus SMKN 2 Kota Mojokerto.
          </p>
          <LowonganExplorer items={items} kategori={kategori} />
        </div>
      </main>
      <BkkFooter />
    </>
  );
}
