import type { Metadata } from "next";
import PublicPage from "@/shared/components/layout/PublicPage";
import PageHero from "@/shared/components/layout/PageHero";
import PageHeading from "@/shared/components/layout/PageHeading";
import ContactPanel from "@/shared/components/ui/ContactPanel";
import { getJurusanList } from "@/features/jurusan";
import { JadwalTabs, SpmbNilaiSection, SpmbVideo, getSpmbContent, susunNaskah, type SpmbDomisili } from "@/features/spmb";
import { getTranslator } from "@/shared/lib/i18n/server";

const TAHUN_SPMB = 2026;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = `${t("Informasi SPMB {tahun}", { tahun: TAHUN_SPMB })} - SMKN 2 Kota Mojokerto`;
  const description = t(
    "Panduan lengkap jalur pendaftaran, jadwal tiap tahapan, komposisi penilaian 60% rapor + 40% TKA, serta data sebaran nilai & domisili pendaftar.",
  );
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

async function DomisiliChart({ data }: { data: SpmbDomisili[] }) {
  const t = await getTranslator();
  const stops = data
    .map((item: SpmbDomisili, index: number) => {
      const start = data.slice(0, index).reduce((sum: number, prev: SpmbDomisili) => sum + prev.value, 0);
      return `${item.color} ${start}% ${start + item.value}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-8 rounded-2xl border border-[var(--color-line)] bg-card p-8 sm:flex-row sm:gap-12 lg:px-11 lg:py-11">
      <div
        className="relative h-[200px] w-[200px] shrink-0 rounded-full lg:h-[270px] lg:w-[270px]"
        style={{ background: `conic-gradient(${stops})` }}
        role="img"
        aria-label={data.map((item) => `${t(item.label)} ${item.value}%`).join(", ")}
      >
        <span className="absolute inset-[18%] rounded-full bg-card" />
      </div>
      <ul className="space-y-4">
        {data.map((item: SpmbDomisili) => (
          <li key={item.label} className="flex items-center gap-3 text-base text-ink sm:text-lg lg:text-[22px]">
            <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
            {t(item.label)}
            <span className="whitespace-nowrap text-[var(--color-muted)]">— {item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SpmbPage() {
  const [spmb, jurusan] = await Promise.all([getSpmbContent(), getJurusanList()]);
  // Isi video disusun dari data yang sama dengan tabel di halaman ini
  const naskahVideo = susunNaskah({ spmb, jurusan, tahun: TAHUN_SPMB });

  return (
    <PublicPage className="bg-card" contentClassName="font-ui" ornaments="spmb">
      <PageHero
        badge={`SPMB ${TAHUN_SPMB}`}
        title="Informasi Sistem Penerimaan Murid Baru"
        description="Panduan lengkap jalur pendaftaran, jadwal tiap tahapan, serta data nilai & domisili pendaftar tahun sebelumnya sebagai gambaran bagi calon siswa."
        overlay="bg-[linear-gradient(90deg,rgba(8,53,75,0.88)_0%,rgba(12,74,104,0.6)_60%,rgba(12,74,104,0.35)_100%)]"
      />

      <SpmbVideo naskah={naskahVideo} bukaOtomatis />

      <section id="jadwal" className="mt-14 lg:mt-[100px]">
        <PageHeading
          size="xl"
          tone="blue"
          eyebrow="Jadwal"
          title="Jadwal tiap jalur pendaftaran"
          description="Pilih jalur untuk melihat rincian tanggal, jam, dan tempat pelaksanaannya."
        />
        <JadwalTabs jalur={spmb.jalur} />
      </section>

      <SpmbNilaiSection nilai={spmb.nilai} />

      <section className="mt-14 lg:mt-[100px]">
        <PageHeading size="xl" tone="blue" eyebrow="Data tahun sebelumnya" title="Persentase domisili siswa" />
        <div className="mt-8">
          <DomisiliChart data={spmb.domisili} />
        </div>
      </section>

      <ContactPanel className="mt-14 lg:mt-[90px]" />
    </PublicPage>
  );
}
