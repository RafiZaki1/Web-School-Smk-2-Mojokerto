import SectionHeader from "@/components/ui/SectionHeader";
import LogoMarquee from "@/components/shared/LogoMarquee";
import JurusanIcon from "./JurusanIcon";

export function TentangJurusan({ jurusan }) {
  return (
    <section>
      <SectionHeader align="start" flush eyebrow="Tentang Jurusan" title={`Apa yang dipelajari di ${jurusan.code}?`} />
      <p className="mt-5 max-w-[860px] text-base leading-relaxed text-body sm:text-lg lg:text-xl lg:leading-8">
        {jurusan.tentang}
      </p>
    </section>
  );
}

export function KompetensiUtama({ items = [] }) {
  return (
    <section>
      <SectionHeader align="start" eyebrow="Kompetensi Utama" title="Yang akan kamu kuasai" className="mb-7" />
      <ul className="flex flex-wrap gap-3 sm:gap-4">
        {items.map((item) => (
          <li
            key={item.title}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#d5dde5] bg-white px-5 py-2 text-[15px] text-ink sm:text-[17px]"
          >
            <JurusanIcon name={item.icon} size={18} className="shrink-0 text-primary" />
            {item.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProspekKarier({ items = [] }) {
  return (
    <section>
      <SectionHeader align="start" eyebrow="Prospek Karier" title="Mau jadi apa setelah lulus?" className="mb-7" />
      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-[18px]">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex min-h-[96px] items-center gap-5 rounded-[20px] border border-[#d5dde5] bg-white px-6 py-5 lg:min-h-[116px] lg:px-[27px]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-soft text-green">
              <JurusanIcon name={item.icon} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold text-ink sm:text-lg">{item.title}</span>
              {item.desc && <span className="mt-1 block text-sm leading-relaxed text-[#4b5563] sm:text-base">{item.desc}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MitraJurusan({ partners = [] }) {
  return (
    <section>
      <SectionHeader align="start" title="Mitra Industri Kami" className="mb-7" />
      <LogoMarquee partners={partners} spacingClass="pr-12 sm:pr-24" />
    </section>
  );
}

export function FasilitasBelajar({ items = [], title = "Praktik langsung di lab & workshop" }) {
  return (
    <section>
      <SectionHeader align="start" eyebrow="Fasilitas Belajar" title={title} className="mb-7" />
      <ul className="grid gap-5 sm:grid-cols-3 sm:gap-[22px]">
        {items.map((item) => (
          <li key={item.title}>
            <figure className="overflow-hidden rounded-3xl bg-surface lg:rounded-[36px]">
              <img src={item.image} alt={item.title} loading="lazy" className="aspect-[396/216] w-full object-cover" />
              <figcaption className="sr-only">{item.title}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
