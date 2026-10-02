import BackLink from "@/components/common/BackLink";
import PrestasiExplorer from "@/components/prestasi/PrestasiExplorer";
import { getPrestasiList } from "@/lib/api/contentApi";

export const metadata = {
  title: "Semua Prestasi - SMKN 2 Kota Mojokerto",
  description: "Deretan penghargaan siswa SMKN 2 Kota Mojokerto di ajang lokal, nasional, hingga internasional.",
};

export default async function PrestasiPage() {
  const items = await getPrestasiList();

  return (
    <main className="flex-1 bg-page py-12 lg:py-[64px]">
      <div className="page-container">
        <BackLink href="/#prestasi" variant="arrow" className="text-xl font-normal text-blue hover:text-blue-dark sm:text-2xl">
          Kembali
        </BackLink>
        <h1 className="mt-6 text-3xl font-bold text-[#1b1b1f] sm:text-[32px]">Semua Prestasi</h1>
        <p className="mt-4 max-w-[785px] text-base leading-relaxed text-[#4b5563] sm:text-lg">
          Deretan penghargaan siswa SMKN 2 Kota Mojokerto di ajang lokal, nasional, hingga internasional.
        </p>

        <PrestasiExplorer items={items} />
      </div>
    </main>
  );
}
