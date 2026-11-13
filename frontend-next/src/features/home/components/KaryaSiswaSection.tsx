import { Lightbulb } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { OrnamentRing, OrnamentSparkle, OrnamentSquiggle } from "@/shared/components/ui/Ornaments";
import { getJurusanIcons } from "@/shared/components/ui/PageOrnaments";
import { KARYA_JURUSAN, KARYA_SISWA, type KaryaJurusan } from "@/features/karya-siswa";
import { getTranslator } from "@/shared/lib/i18n/server";

const JURUSAN = (Object.keys(KARYA_JURUSAN) as KaryaJurusan[]).filter((id) => KARYA_SISWA.some((karya) => karya.jurusan === id));

/** Posisi ikon jurusan samar di ruang kosong banner, di luar blok teks (hanya layar lebar). */
const ICON_SPOTS = [
  "top-8 left-[30%] w-10 rotate-12",
  "bottom-8 left-[22%] w-12 -rotate-6",
  "top-[42%] right-4 w-10 -rotate-12",
  "bottom-8 right-8 w-10 rotate-6",
  "bottom-10 left-[47%] w-9 -rotate-12",
];

/** Ajakan ke galeri karya siswa di beranda: cukup teks, karyanya tampil di /karya-siswa. */
export default async function KaryaSiswaSection() {
  const t = await getTranslator();

  return (
    <section id="karya-siswa" aria-labelledby="karya-siswa-title" className="section relative overflow-x-clip bg-card pt-0 lg:pt-0">
      <div className="page-container">
        <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(120deg,var(--color-navy-deep)_0%,var(--color-navy)_100%)] px-6 py-12 text-white sm:px-10 lg:px-16 lg:py-16">
          <OrnamentSquiggle className="absolute -top-16 -right-16 w-56 text-white/[0.06] lg:w-72" />
          <OrnamentRing className="absolute -bottom-24 -left-20 w-64 text-white/[0.05]" />
          <OrnamentSparkle className="absolute top-6 right-8 w-7 text-sun lg:top-8 lg:right-12 lg:w-9" />
          <OrnamentSparkle className="absolute top-14 right-5 w-4 text-tint-strong lg:top-[4.5rem] lg:right-7" />
          {JURUSAN.map((id, index) => {
            const [Icon] = getJurusanIcons(id);
            return <Icon key={id} className={`absolute hidden text-white/[0.07] xl:block ${ICON_SPOTS[index % ICON_SPOTS.length]}`} />;
          })}

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase lg:text-sm">
                <Lightbulb size={16} aria-hidden="true" />
                {t("Karya Siswa")}
              </span>
              <h2 id="karya-siswa-title" className="mt-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-[46px] lg:leading-[1.12]">
                {t("Enam bulan di industri,")} <span className="text-sun">{t("pulang membawa karya.")}</span>
              </h2>
            </div>

            <div>
              <p className="text-base leading-relaxed text-white/85 sm:text-lg">
                {t(
                  "Aplikasi yang bisa langsung dicoba, wajah baru untuk UMKM, dessert bercita rasa restoran, hingga camilan dari hasil panen petani sekitar. Siswa SMK Negeri 2 Kota Mojokerto pulang dari PKL membawa lebih dari sekadar sertifikat.",
                )}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2" aria-label={t("Jurusan yang karyanya ditampilkan")}>
                {JURUSAN.map((id) => (
                  <li key={id} className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/90">
                    {t(KARYA_JURUSAN[id])}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button href="/karya-siswa" variant="accent">
                  {t("Lihat Karya Siswa")}
                </Button>
                <span className="text-sm text-white/70">
                  {t("{karya} karya dari {jurusan} jurusan", { karya: KARYA_SISWA.length, jurusan: JURUSAN.length })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
