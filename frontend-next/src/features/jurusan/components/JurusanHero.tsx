import { ViewTransition, type CSSProperties } from "react";
import Image from "next/image";
import type { Jurusan } from "../types/jurusan.type";
import { OrnamentBurst } from "@/shared/components/ui/Ornaments";
import { getJurusanIcons } from "@/shared/components/ui/PageOrnaments";
import { getTranslator } from "@/shared/lib/i18n/server";

export default async function JurusanHero({ jurusan }: { jurusan: Jurusan }) {
  const t = await getTranslator();
  const [MainIcon] = getJurusanIcons(jurusan.id);
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:gap-10">
      <div>
        <h1 className="enter-up font-heading text-[32px] leading-[1.15] font-bold text-primary sm:text-[44px] lg:text-[56px]">{t(jurusan.fullName)}</h1>
        <p className="enter-up mt-5 font-ui text-xl font-bold text-green sm:text-2xl lg:mt-12 lg:text-[26px]" style={{ "--i": 1 } as CSSProperties}>
          {t(jurusan.code)}
        </p>
        <p className="enter-up mt-4 max-w-[620px] text-base leading-relaxed text-body sm:text-lg lg:mt-10 lg:text-xl lg:leading-8" style={{ "--i": 2 } as CSSProperties}>
          {t(jurusan.desc)}
        </p>
      </div>

      <div className="relative">
        {/* Pasangan morph dengan kartu jurusan di beranda */}
        <ViewTransition name={`jurusan-${jurusan.id}`} share="jurusan-morph" default="none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-surface shadow-[0_8px_20px_rgba(19,35,44,0.1)] lg:rounded-[36px]">
            <Image src={jurusan.image} alt={t("Siswa jurusan {nama}", { nama: t(jurusan.fullName) })} fill sizes="(min-width: 1024px) 620px, 100vw" className="object-cover object-top" />
          </div>
        </ViewTransition>
        {/* Ikon khas jurusan menempel di sudut foto */}
        <span className="absolute -top-5 -left-4 z-10 flex h-14 w-14 -rotate-12 items-center justify-center rounded-2xl bg-sun text-sun-ink shadow-[0_8px_20px_rgba(19,35,44,0.15)] sm:-top-7 sm:-left-7 sm:h-[72px] sm:w-[72px]">
          <MainIcon className="w-7 sm:w-9" />
        </span>
        <OrnamentBurst className="absolute -right-5 -bottom-6 z-10 w-14 rotate-[135deg] text-lime sm:-right-8 sm:-bottom-8 sm:w-[72px]" />
      </div>
    </section>
  );
}
