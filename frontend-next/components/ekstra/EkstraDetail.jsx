import { CalendarDays, MapPin, Medal, Quote, Trophy, UsersRound } from "lucide-react";
import Button from "@/components/ui/Button";
import PageHeading from "@/components/common/PageHeading";

const ACHIEVEMENT_ICONS = { trophy: Trophy, medal: Medal };

export function EkstraHero({ ekstra }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-navy-deep text-white lg:rounded-[32px]">
      <img src={ekstra.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,23,46,0.92)_0%,rgba(2,23,46,0.72)_50%,rgba(2,23,46,0.35)_100%)]" />
      <div className="relative flex min-h-[340px] flex-col justify-center px-6 py-10 sm:px-12 lg:min-h-[450px] lg:px-[72px]">
        <span className="w-fit rounded-full bg-accent px-4 py-1.5 text-sm font-medium tracking-wide uppercase sm:text-base">
          Ekstrakurikuler
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl">{ekstra.name}</h1>
        <p className="mt-5 max-w-[562px] text-base leading-relaxed text-white/90 sm:text-lg lg:text-[19px] lg:leading-8">{ekstra.desc}</p>
      </div>
    </section>
  );
}

export function EkstraInfoCards({ ekstra }) {
  const items = [
    { label: "Jadwal latihan", value: ekstra.jadwal, icon: CalendarDays },
    { label: "Lokasi", value: ekstra.lokasi, icon: MapPin },
    { label: "Anggota aktif", value: ekstra.anggota, icon: UsersRound },
  ];
  return (
    <ul className="grid gap-4 sm:grid-cols-3 lg:gap-[46px]">
      {items.map(({ label, value, icon: Icon }) => (
        <li
          key={label}
          className="flex items-center gap-4 rounded-full border border-[#e4e6f5] bg-white px-6 py-4 shadow-[0_4px_14px_rgba(19,27,46,0.05)]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft text-accent">
            <Icon size={20} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium tracking-wide text-[#6b7280] uppercase">{label}</span>
            <span className="block truncate text-base font-semibold text-heading">{value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function EkstraTentang({ ekstra }) {
  return (
    <section>
      <PageHeading tone="accent" size="lg" eyebrow={ekstra.tentangLabel} title={ekstra.tentangTitle} />
      <p className="mt-6 max-w-[1008px] text-base leading-relaxed text-[#4b5563] sm:text-lg lg:leading-[33px]">{ekstra.tentang}</p>
    </section>
  );
}

export function EkstraGallery({ images = [] }) {
  const [main, second, third, wide] = images;
  return (
    <section>
      <PageHeading tone="accent" eyebrow="Dokumentasi" title="Momen latihan & Event" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-[54px] lg:grid-cols-3 lg:grid-rows-[263px_272px] lg:gap-[27px]">
        {main && (
          <img src={main} alt="Dokumentasi kegiatan" loading="lazy" className="h-72 w-full rounded-3xl object-cover sm:row-span-2 sm:h-full lg:rounded-[32px]" />
        )}
        {second && <img src={second} alt="Dokumentasi latihan" loading="lazy" className="h-56 w-full rounded-3xl object-cover sm:h-full lg:rounded-[32px]" />}
        {third && <img src={third} alt="Dokumentasi acara" loading="lazy" className="h-56 w-full rounded-3xl object-cover sm:h-full lg:rounded-[32px]" />}
        {wide && (
          <img src={wide} alt="Dokumentasi upacara" loading="lazy" className="h-56 w-full rounded-3xl object-cover sm:col-span-1 lg:col-span-2 lg:h-full lg:rounded-[32px]" />
        )}
      </div>
    </section>
  );
}

export function EkstraPrestasi({ ekstra }) {
  return (
    <section>
      <PageHeading tone="accent" eyebrow="Prestasi" title={ekstra.prestasiTitle} />
      <ul className="mt-8 space-y-4 lg:mt-[54px]">
        {ekstra.prestasi.map((item) => {
          const Icon = ACHIEVEMENT_ICONS[item.icon] ?? Trophy;
          return (
            <li key={item.text} className="flex items-center gap-5 rounded-full border border-[#e4e6f5] bg-white px-6 py-4 lg:px-7 lg:py-[22px]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft text-accent lg:h-[54px] lg:w-[54px]">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="text-[15px] font-semibold text-heading sm:text-base">{item.text}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex justify-center">
        <Button href="/prestasi" variant="link" withArrow>
          Lihat semua prestasi {ekstra.name}
        </Button>
      </div>
    </section>
  );
}

export function EkstraTestimoni({ testimoni }) {
  return (
    <figure className="rounded-3xl bg-soft px-6 py-12 text-center sm:px-12 lg:rounded-[32px] lg:py-[60px]">
      <Quote size={36} className="mx-auto rotate-180 fill-accent text-accent" aria-hidden="true" />
      <p className="mt-4 text-xs font-bold tracking-[0.08em] text-accent uppercase">Kata Anggota</p>
      <blockquote className="mx-auto mt-4 max-w-[880px] text-xl leading-snug font-bold text-heading italic sm:text-2xl lg:text-[26px] lg:leading-[38px]">
        &ldquo;{testimoni.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 text-base text-[#4b5563] sm:text-lg">— {testimoni.author}</figcaption>
    </figure>
  );
}
