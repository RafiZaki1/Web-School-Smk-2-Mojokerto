import { Eye, Flag, Rocket } from "lucide-react";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import { getTranslator } from "@/shared/lib/i18n/server";
import { OrnamentRing, OrnamentRoute, OrnamentSparkle } from "@/shared/components/ui/Ornaments";

const VISI =
  "Menjadi lembaga pendidikan dan pelatihan vokasi yang unggul, berkarakter, berwawasan lingkungan, dan berstandar internasional.";

const MISI = [
  "Menyelenggarakan pembelajaran berbasis proyek industri.",
  "Membekali peserta didik dengan kompetensi abad 21.",
  "Membangun kemitraan strategis dengan dunia usaha dan dunia industri.",
];

const TUJUAN =
  "Menghasilkan lulusan yang kompeten, kompetitif, adaptif, dan siap kerja atau berwirausaha sesuai kebutuhan Dunia Usaha dan Dunia Industri (DUDI).";

const HEADING = "font-heading text-xs sm:text-sm font-bold";

export default async function VisiMisiSection() {
  const t = await getTranslator();
  return (
    <section id="visi-misi" aria-labelledby="visi-misi-title" className="section relative overflow-x-clip">
      {/* Rute menuju pin: "arah" sekolah */}

      <OrnamentRoute className="absolute top-20 left-[3%] hidden w-36 text-tint-strong lg:block xl:w-44" />
      <OrnamentSparkle className="absolute top-20 right-[7%] hidden w-10 text-sun lg:block" />
      <OrnamentSparkle className="absolute top-36 right-[4%] hidden w-5 text-lime lg:block" />
      <div className="page-container relative">
        <SectionHeader badge="Arah Kami" id="visi-misi-title" title="Visi, misi & tujuan" />

        <div className="grid gap-5 lg:grid-cols-[5fr_7fr] lg:gap-6">
          <article className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white sm:p-10 lg:rounded-[32px] lg:p-12">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-sun" />

            <OrnamentRing className="absolute -right-20 -bottom-20 w-64 text-white/10" />
            <OrnamentSparkle className="absolute top-10 right-8 w-7 text-sun/80 sm:right-10" />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sun">
                <Eye size={22} aria-hidden="true" />
              </span>
              <h3 className={`mt-6 text-sun ${HEADING}`}>{t("Visi")}</h3>
              <p className="mt-3 font-heading text-[22px] leading-snug font-semibold sm:text-[26px] lg:text-[30px] lg:leading-[1.3]">{t(VISI)}</p>
            </div>
          </article>

          <div className="grid gap-5 lg:gap-6">
            <article className="rounded-3xl border border-line bg-card p-7 sm:p-9 lg:rounded-[32px]">
              <div className="flex items-center gap-3.5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-soft text-green">
                  <Rocket size={22} aria-hidden="true" />
                </span>
                <h3 className={`text-green ${HEADING}`}>{t("Misi")}</h3>
              </div>
              <ol className="mt-6 space-y-5 sm:space-y-6">
                {MISI.map((item, index) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="w-9 shrink-0 font-heading text-2xl sm:text-[26px] leading-snug font-extrabold text-lime tabular-nums" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[17px] leading-relaxed font-medium text-heading sm:text-lg lg:text-[19px] lg:leading-[1.65]">{t(item)}</span>
                  </li>
                ))}
              </ol>
            </article>

            <article className="flex flex-col gap-4 rounded-3xl bg-surface p-7 sm:flex-row sm:items-start sm:gap-5 sm:p-9 lg:rounded-[32px]">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary shadow-xs">
                <Flag size={22} aria-hidden="true" />
              </span>
              <div>
                <h3 className={`text-primary ${HEADING}`}>{t("Tujuan")}</h3>
                <p className="mt-2.5 text-[17px] leading-relaxed font-medium text-heading sm:text-lg lg:text-[19px] lg:leading-[1.65]">{t(TUJUAN)}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
