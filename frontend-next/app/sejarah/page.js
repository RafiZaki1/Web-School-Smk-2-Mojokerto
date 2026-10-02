import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/common/PageHero";
import PageHeading from "@/components/common/PageHeading";
import { getSejarahContent } from "@/lib/api/contentApi";

export const metadata = {
  title: "Sejarah Sekolah - SMKN 2 Kota Mojokerto",
  description: "Sejarah SMKN 2 Mojokerto dari masa ke masa.",
};

export default async function SejarahPage() {
  const { intro: SEJARAH_INTRO, timeline: SEJARAH_TIMELINE, kepala_sekolah: KEPALA_SEKOLAH } = await getSejarahContent();

  return (
    <>
      <Navbar variant="light" />
      <main className="flex-1 bg-white pt-[100px] font-ui lg:pt-[120px]">
        <div className="page-container">
          <PageHero badge="Informasi" title="Sejarah Sekolah" description="Sejarah SMKN 2 Mojokerto dari masa ke masa." />

          <section className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-[27px] lg:py-[180px]">
            <img
              src={SEJARAH_INTRO.image}
              alt="Gedung SMK Negeri 2 Kota Mojokerto"
              className="aspect-[662/456] w-full rounded-2xl border border-[#e5e7eb] object-cover shadow-[0_8px_24px_rgba(0,17,41,0.08)]"
            />
            <div>
              <PageHeading size="xl" tone="muted" eyebrow={SEJARAH_INTRO.eyebrow} title={SEJARAH_INTRO.title} />
              <p className="mt-4 text-base leading-[1.7] text-[#4b5563] lg:text-lg">{SEJARAH_INTRO.text}</p>
            </div>
          </section>
        </div>

        <section className="bg-[#f2f4f6] py-16 lg:py-[100px]">
          <div className="page-container">
            <PageHeading size="xl" tone="muted" align="center" eyebrow="Perjalanan kami" title="Jejak langkah dari masa ke masa" />
            <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:mt-[90px] lg:grid-cols-4 lg:gap-8 lg:px-[54px] lg:before:absolute lg:before:top-[9px] lg:before:right-[54px] lg:before:left-[54px] lg:before:h-0.5 lg:before:bg-[#c7ccd4]">
              {SEJARAH_TIMELINE.map((item) => (
                <li key={item.title} className="relative text-center">
                  <span
                    className={`relative mx-auto block h-3 w-3 rounded-full ${item.highlight ? "bg-[#e9c349]" : "bg-[#5a86ff]"}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`mt-6 inline-flex rounded-full px-3 py-0.5 text-sm font-bold ${
                      item.highlight ? "bg-[#ffdf8f] text-[#241a00]" : "bg-[#d5e3ff] text-[#001129]"
                    }`}
                  >
                    {item.year}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-[#001129] sm:text-2xl lg:text-[26px]">{item.title}</h3>
                  <p className="mx-auto mt-2 max-w-[290px] text-sm leading-relaxed text-[#4b5563] lg:text-base">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="page-container py-16 lg:py-[150px]">
          <PageHeading size="xl" tone="muted" align="center" eyebrow="Kepemimpinan" title="Kepala sekolah dari masa ke masa" />
          <ul className="mt-10 flex flex-wrap justify-center gap-12 lg:gap-[205px]">
            {KEPALA_SEKOLAH.map((item) => (
              <li key={item.periode} className="text-center">
                {item.foto ? (
                  <img
                    src={item.foto}
                    alt={`Kepala sekolah ${item.periode}`}
                    className="mx-auto h-36 w-36 rounded-full border-2 border-white object-cover shadow-[0_8px_20px_rgba(0,17,41,0.15)]"
                  />
                ) : (
                  <span className="mx-auto block h-36 w-36 rounded-full bg-gradient-to-br from-[#3b4f7a] to-[#1d2b4f] shadow-[0_8px_20px_rgba(0,17,41,0.15)]" aria-hidden="true" />
                )}
                <p className="mt-4 text-sm font-bold text-[#001129] lg:text-base">{item.periode}</p>
                <p className="text-sm text-[#4b5563]">{item.tahun}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
