import SectionHeader from "@/shared/components/ui/SectionHeader";
import LogoGrid, { type Partner } from "@/shared/components/ui/LogoGrid";
import { OrnamentLinkedRings } from "@/shared/components/ui/Ornaments";

export default function MitraSection({ partners = [] }: { partners?: Partner[] }) {
  return (
    <section id="mitra" className="relative mt-16 overflow-x-clip bg-surface py-12 sm:py-14 lg:mt-28 lg:py-[46px]">
      {/* Cincin bertaut: kemitraan sekolah dengan industri */}

      <OrnamentLinkedRings className="absolute top-10 left-[5%] hidden w-24 text-tint-strong lg:block" />
      <div className="page-container relative">
        <SectionHeader title="Mitra Industri Kami" />
        <LogoGrid partners={partners} />
      </div>
    </section>
  );
}
