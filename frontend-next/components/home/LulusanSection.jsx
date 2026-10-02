import { Star } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";

function AlumniCard({ alumni }) {
  return (
    <article className="relative h-[394px] w-[78vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#196194] shadow-[0_10px_16px_-4px_rgba(0,0,0,0.1)] sm:w-auto sm:max-w-none">
      <img
        src={alumni.photo || "/images/sejarah/gedung.jpg"}
        alt={alumni.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(72,75,80,0.2)] from-[54%] to-[#196194]" />

      <span className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/20 backdrop-blur-sm">
        <Star size={20} fill="#d9c249" strokeWidth={0} aria-hidden="true" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-heading text-xl font-bold text-white">{alumni.name}</h3>
        <p className="mt-1 text-sm font-bold text-white/85">
          {alumni.jurusan} • Angkatan {alumni.angkatan}
        </p>
        <p className="mt-3 rounded-xl border border-white/20 bg-white/10 p-4 text-sm leading-5 font-medium text-white backdrop-blur-sm">
          {alumni.karier}
        </p>
      </div>
    </article>
  );
}

export default function LulusanSection({ items = [] }) {
  return (
    <section id="lulusan" className="section mt-16 bg-surface-alt lg:mt-28">
      <div className="page-container">
        <SectionHeader
          badge="Kebanggaan Kami"
          title="Lulusan terbaik"
          description="Mereka yang membuktikan pendidikan vokasi di SMKN 2 Mojokerto benar-benar membuka jalan karier."
        />

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-9">
          {items.map((alumni) => (
            <AlumniCard key={alumni.name} alumni={alumni} />
          ))}
        </div>

        <div className="mt-10 flex justify-center lg:mt-12">
          <Button href="/lulusan" withArrow>
            Lihat semua lulusan terbaik
          </Button>
        </div>
      </div>
    </section>
  );
}
