import SectionHeader from "@/components/ui/SectionHeader";
import LogoMarquee from "@/components/shared/LogoMarquee";

export default function MitraSection({ partners = [] }) {
  return (
    <section id="mitra" className="mt-16 bg-surface py-12 sm:py-14 lg:mt-28 lg:py-[46px]">
      <div className="page-container">
        <SectionHeader title="Mitra Industri Kami" />
        <LogoMarquee partners={partners} />
      </div>
    </section>
  );
}
