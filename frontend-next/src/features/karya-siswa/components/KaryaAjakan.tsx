import Button from "@/shared/components/ui/Button";
import { PPDB_HREF } from "@/shared/constants/navigation";
import type { Translator } from "@/shared/lib/i18n/translate";
import type { KaryaSiswa } from "../constants/karya-data";
import { OrnamentRing, OrnamentSparkle } from "@/shared/components/ui/Ornaments";
import { getJurusanIcons } from "@/shared/components/ui/PageOrnaments";

/** Ajakan ikut SPMB tepat setelah etalase karya, saat pembaca baru saja melihat hasilnya. */
export function KaryaAjakan({ jurusan, t }: { jurusan: KaryaSiswa["jurusan"]; t: Translator }) {

  const [, , JurusanOrnament] = getJurusanIcons(jurusan);
  return (
    <aside className="relative mt-6 flex flex-col items-start gap-6 overflow-hidden rounded-[32px] bg-navy-deep px-6 py-8 text-white sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-14">
      <OrnamentRing className="absolute -top-20 -right-12 w-56 text-white/[0.06]" />
      <JurusanOrnament className="absolute right-[38%] -bottom-4 hidden w-16 rotate-12 text-white/[0.08] lg:block" />
      <OrnamentSparkle className="absolute top-6 right-8 w-6 text-sun sm:w-7" />
      <div className="relative">
        <p className="font-heading text-3xl leading-tight font-bold sm:text-4xl">
          {t("Kamu juga bisa,")} <span className="text-sun">{t("kok!")}</span>
        </p>
        <p className="mt-2 text-base leading-relaxed text-white/85 sm:text-lg">
          {t("Yuk, jadi bagian dari SKANEDA. Kepoin info SPMB-nya sekarang!")}
        </p>
      </div>

      <Button href={PPDB_HREF} variant="accent" className="relative shrink-0">
        {t("Kepoin SPMB")}
      </Button>
    </aside>
  );
}
