import PublicPage from "@/components/layout/PublicPage";
import PageHero from "@/components/common/PageHero";
import PageHeading from "@/components/common/PageHeading";
import ContactPanel from "@/components/common/ContactPanel";
import { DataTable, JadwalTabs } from "@/components/spmb/SpmbTables";
import { getSpmbContent } from "@/lib/api/contentApi";

export const metadata = {
  title: "Informasi SPMB 2026 - SMKN 2 Kota Mojokerto",
  description: "Panduan lengkap jalur pendaftaran, jadwal tiap tahapan, serta data nilai & domisili pendaftar tahun sebelumnya.",
};

const NILAI_COLUMNS = [
  { key: "kompetensi", label: "Kompetensi Keahlian", className: "w-[38%]" },
  { key: "terdekat", label: "Jarak Terdekat" },
  { key: "terjauh", label: "Jarak Terjauh" },
  { key: "terendah", label: "Nilai Terendah" },
  { key: "tertinggi", label: "Nilai Tertinggi" },
];

function DomisiliChart({ data }) {
  const stops = data
    .map((item, index) => {
      const start = data.slice(0, index).reduce((sum, prev) => sum + prev.value, 0);
      return `${item.color} ${start}% ${start + item.value}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-8 rounded-2xl border border-[#e5e7eb] bg-white p-8 sm:flex-row sm:gap-12 lg:px-11 lg:py-11">
      <div
        className="relative h-[200px] w-[200px] shrink-0 rounded-full lg:h-[270px] lg:w-[270px]"
        style={{ background: `conic-gradient(${stops})` }}
        role="img"
        aria-label={data.map((item) => `${item.label} ${item.value}%`).join(", ")}
      >
        <span className="absolute inset-[18%] rounded-full bg-white" />
      </div>
      <ul className="space-y-4">
        {data.map((item) => (
          <li key={item.label} className="flex items-center gap-3 text-base text-ink sm:text-lg lg:text-[22px]">
            <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
            {item.label}
            <span className="whitespace-nowrap text-[#6b7280]">— {item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SpmbPage() {
  const spmb = await getSpmbContent();

  return (
    <PublicPage className="bg-white" contentClassName="font-ui">
      <PageHero
        badge="SPMB 2026"
        title="Informasi Sistem Penerimaan Murid Baru"
        description="Panduan lengkap jalur pendaftaran, jadwal tiap tahapan, serta data nilai & domisili pendaftar tahun sebelumnya sebagai gambaran bagi calon siswa."
        overlay="bg-[linear-gradient(90deg,rgba(30,58,138,0.88)_0%,rgba(37,99,235,0.6)_60%,rgba(37,99,235,0.35)_100%)]"
      />

      <section className="mt-14 lg:mt-[100px]">
        <PageHeading
          size="xl"
          tone="blue"
          eyebrow="Jadwal"
          title="Jadwal tiap jalur pendaftaran"
          description="Pilih jalur untuk melihat rincian tanggal, jam, dan tempat pelaksanaannya."
        />
        <JadwalTabs jalur={spmb.jalur} />
      </section>

      <section className="mt-14 lg:mt-[100px]">
        <PageHeading
          size="xl"
          tone="blue"
          eyebrow="Data tahun sebelumnya"
          title="Nilai & jarak pendaftar tahun 2025"
          description="Gambaran rentang nilai akademik dan jarak domisili pendaftar yang diterima pada tiap kompetensi keahlian."
        />
        <div className="mt-8">
          <DataTable columns={NILAI_COLUMNS} rows={spmb.nilai} />
        </div>
      </section>

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
