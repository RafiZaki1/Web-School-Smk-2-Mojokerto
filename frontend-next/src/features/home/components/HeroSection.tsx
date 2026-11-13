import Image from "next/image";
import Button from "@/shared/components/ui/Button";
import ArcCarousel from "@/features/home/components/ArcCarousel";
import { getTranslator } from "@/shared/lib/i18n/server";

export default async function HeroSection() {
  const t = await getTranslator();
  return (
    <section
      id="beranda"
      className="relative flex flex-col overflow-hidden bg-navy pt-28 text-white sm:pt-36 lg:min-h-[900px] lg:pt-[176px]"
    >
      <Image
        src="/hero-bg.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/45 to-navy/90"
      />

      <div className="page-container relative z-10 text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-tint-strong)] sm:text-[13px]">
          {t("Disiplin • Berakhlak • Berprestasi")}
        </p>

        <h1 className="mx-auto mt-3 max-w-[940px] font-heading uppercase leading-[1.17] text-white">
          <span className="block text-[26px] font-medium sm:text-[40px] lg:text-[51px]">{t("Selamat Datang di")}</span>
          <span className="block text-[30px] font-bold sm:text-[48px] lg:text-[60px]">SMK Negeri 2 Mojokerto</span>
        </h1>

        <p className="mx-auto mt-4 max-w-[690px] text-[15px] leading-relaxed text-white sm:text-[17px] sm:leading-[26px]">
          {t(
            "Temukan lingkungan belajar yang aktif, kreatif, dan relevan dengan dunia industri. Belajar dari praktik, berkembang lewat karya, dan siap melangkah lebih jauh.",
          )}
        </p>

        <Button href="/#profil" variant="accent" className="mt-7">
          {t("Pelajari Selengkapnya")}
        </Button>
      </div>

      <ArcCarousel />
    </section>
  );
}
