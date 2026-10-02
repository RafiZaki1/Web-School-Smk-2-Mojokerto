import PublicPage from "@/components/layout/PublicPage";
import PageHero from "@/components/common/PageHero";
import PageHeading from "@/components/common/PageHeading";
import ContactPanel from "@/components/common/ContactPanel";
import AspirasiForm from "@/components/aspirasi/AspirasiForm";
import { KATEGORI_ASPIRASI_TONES, STATUS_ASPIRASI_TONES } from "@/lib/data/aspirasiData";
import { getAspirasiPublik } from "@/lib/api/contentApi";

export const metadata = {
  title: "Kotak Aspirasi - SMKN 2 Kota Mojokerto",
  description: "Sampaikan masalah, keluhan, atau saran untuk sekolah yang lebih baik.",
};

export default async function AspirasiPage() {
  const { kategori, items } = await getAspirasiPublik();

  return (
    <PublicPage className="bg-white">
      <PageHero
        badge="Aspirasi"
        title="Kotak Aspirasi"
        description="Sampaikan masalah, keluhan, atau saran untuk sekolah yang lebih baik. Suaramu penting bagi kami."
        overlay="bg-[linear-gradient(90deg,rgba(30,58,138,0.9)_0%,rgba(37,99,235,0.62)_60%,rgba(37,99,235,0.35)_100%)]"
      />

      <div className="mt-8 rounded-3xl bg-white px-0 py-8 shadow-none sm:px-2 lg:mt-[50px] lg:px-3 lg:py-[60px]">
        <h2 className="text-2xl font-bold text-heading sm:text-3xl lg:text-[34px]">Formulir Penyampaian Aspirasi</h2>
        <div className="mt-6">
          <AspirasiForm kategori={kategori} />
        </div>

        <section className="mt-14 lg:mt-[86px]">
          <PageHeading
            size="xl"
            tone="blue"
            eyebrow="Transparansi"
            title="Aspirasi yang sudah ditindaklanjuti"
            description="Beberapa contoh laporan yang sudah direspons sekolah (identitas pelapor dirahasiakan)."
          />
          <ul className="mt-8 space-y-4">
            {items.map((item) => (
              <li key={`${item.judul}-${item.status}`} className="rounded-2xl border border-[#dde3f0] px-6 py-6 lg:px-8">
                <div className="flex items-center justify-between gap-3">
                  <span className={`rounded-md px-3 py-1 text-sm font-medium sm:text-base ${KATEGORI_ASPIRASI_TONES[item.kategori]}`}>{item.kategori}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium sm:text-base ${STATUS_ASPIRASI_TONES[item.status]}`}>
                    <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-heading sm:text-[22px]">{item.judul}</h3>
                <p className="mt-2 text-base text-[#4b5563] sm:text-[20px]">{item.tindakLanjut}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ContactPanel className="mt-10 font-ui lg:mt-12" />
    </PublicPage>
  );
}
