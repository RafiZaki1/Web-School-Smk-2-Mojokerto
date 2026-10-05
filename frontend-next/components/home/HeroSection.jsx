import Button from "@/components/ui/Button";
import ArcCarousel from "./ArcCarousel";

const HERO_GRADIENT = "linear-gradient(148deg, #05529e 14%, #0885d1 54%, #42b8f2 86%)";

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative flex flex-col overflow-hidden pt-28 text-white sm:pt-36 lg:min-h-[900px] lg:pt-[176px]"
      style={{ backgroundImage: HERO_GRADIENT }}
    >
      <img
        src="/hero-bg.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
      />

      <div className="page-container relative z-10 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#cfefff] sm:text-[13px]">
          Disiplin • Berakhlak • Berprestasi
        </p>

        <h1 className="mx-auto mt-3 max-w-[940px] font-heading uppercase leading-[1.17] text-white">
          <span className="block text-[26px] font-medium sm:text-[40px] lg:text-[51px]">Selamat Datang di</span>
          <span className="block text-[30px] font-bold sm:text-[48px] lg:text-[60px]">SMK Negeri 2 Mojokerto</span>
        </h1>

        <p className="mx-auto mt-4 max-w-[690px] text-[15px] leading-relaxed text-white sm:text-[17px] sm:leading-[26px]">
          Temukan lingkungan belajar yang aktif, kreatif, dan relevan dengan dunia industri. Belajar dari praktik,
          berkembang lewat karya, dan siap melangkah lebih jauh.
        </p>

        <Button href="/#profil" variant="accent" className="mt-7 uppercase">
          Pelajari Selengkapnya
        </Button>
      </div>

      <ArcCarousel />
    </section>
  );
}
