import Link from "next/link";
import { ArrowLeft, Award, CalendarDays, Gavel, MapPin, Star, Trophy, UserRound } from "lucide-react";
import ShareButton from "./ShareButton";

function GlassCard({ icon: Icon, label, value, className = "" }) {
  return (
    <div className={`rounded-3xl border border-white/25 bg-white/15 px-6 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-md lg:px-8 lg:py-6 ${className}`}>
      <p className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-white/75 uppercase sm:text-[13px]">
        <Icon size={15} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1.5 text-xl leading-snug font-bold text-white sm:text-2xl lg:text-[28px] lg:leading-[1.4]">{value}</p>
    </div>
  );
}

export function PrestasiHero({ data }) {
  return (
    <section className="relative overflow-hidden bg-navy-deep text-white lg:min-h-[785px]">
      <img src={data.hero} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,16,32,0.88)_0%,rgba(9,16,32,0.6)_55%,rgba(9,16,32,0.4)_100%)]" />

      <div className="page-container relative grid gap-10 pt-32 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,450px)] lg:pt-[176px] lg:pb-[60px]">
        <div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6d860] px-4 py-2 text-xs font-semibold text-[#3b2f00] uppercase sm:text-sm">
              <Trophy size={14} aria-hidden="true" />
              {data.predikat}
            </span>
            <span className="rounded-full bg-[#cfe3ff] px-4 py-2 text-xs font-semibold text-[#0b3b66] uppercase sm:text-sm">{data.tingkat}</span>
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase backdrop-blur-sm sm:text-sm">{data.bulan}</span>
          </div>

          <h1 className="mt-6 max-w-[720px] font-ui text-5xl leading-[0.95] font-extrabold tracking-[-0.045em] sm:text-7xl lg:text-[100px]">
            {data.title}
          </h1>

          <div className="mt-8 flex items-center gap-4 lg:mt-10">
            {data.siswa.foto ? (
              <img src={data.siswa.foto} alt={data.siswa.nama} className="h-20 w-20 shrink-0 rounded-2xl border-[3px] border-white object-cover shadow-lg sm:h-[89px] sm:w-[89px]" />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-[3px] border-white bg-white/15">
                <UserRound size={32} aria-hidden="true" />
              </span>
            )}
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">
              <p className="text-lg font-semibold sm:text-[28px] sm:leading-tight">{data.siswa.nama}</p>
              <p className="mt-0.5 text-sm text-white/80 sm:text-[15px]">{data.siswa.kelas}</p>
            </div>
          </div>

          <Link
            href="/prestasi"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/90 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Kembali
          </Link>
        </div>

        <div className="flex flex-col gap-4 lg:pt-2">
          <GlassCard icon={CalendarDays} label="Tanggal" value={data.tanggal} className="lg:ml-9" />
          <GlassCard icon={MapPin} label="Lokasi" value={data.lokasi} />
          <GlassCard icon={Gavel} label="Penyelenggara" value={data.penyelenggara} className="lg:ml-[54px]" />
        </div>
      </div>
    </section>
  );
}

export function PrestasiArticle({ data }) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)] sm:p-10 lg:rounded-[36px] lg:p-[54px]">
      <p className="text-xl leading-snug font-bold text-[#11649a] sm:text-2xl lg:text-[34px] lg:leading-[1.4]">{data.ringkasan}</p>
      <div className="mt-8 space-y-6 text-base leading-[1.7] text-[#4b5563] sm:text-lg lg:text-xl">
        {data.deskripsi.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export function PrestasiAside({ data }) {
  return (
    <aside className="space-y-8">
      <ShareButton title={data.title} />

      <section className="overflow-hidden rounded-[28px] border border-[#e5e7eb] bg-[#f3f4f6] shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
        <h2 className="flex items-center gap-2 border-b border-[#e5e7eb] px-6 py-5 text-lg font-semibold text-ink">
          <Award size={20} className="text-[#8a6d00]" aria-hidden="true" />
          Dokumen Resmi
        </h2>
        <div className="flex justify-center px-6 py-8">
          <div className="w-full max-w-[327px] rounded-xl bg-white p-8 shadow-[0_12px_28px_rgba(15,23,42,0.1)]">
            <span className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-xl border-4 border-[#f6d860] bg-[#fff7d6] text-[#e3b400]">
              <Star size={36} aria-hidden="true" />
            </span>
            <div className="mt-8 space-y-4" aria-hidden="true">
              <span className="mx-auto block h-3 w-4/5 rounded-full bg-[#eceef1]" />
              <span className="mx-auto block h-3 w-3/5 rounded-full bg-[#eceef1]" />
              <span className="mx-auto block h-3 w-1/2 rounded-full bg-[#eceef1]" />
            </div>
          </div>
        </div>
      </section>

      {data.testimoni && (
        <figure className="rounded-[28px] border border-[#e5e7eb] bg-[#f3f4f6] p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)] lg:p-8">
          <blockquote className="text-xl leading-snug font-bold text-ink lg:text-[22px] lg:leading-[1.45]">{data.testimoni.quote}</blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a74c0] text-white">
              <UserRound size={20} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-lg font-medium text-ink">{data.testimoni.nama}</span>
              <span className="block text-xs text-[#6b7280]">{data.testimoni.jabatan}</span>
            </span>
          </figcaption>
        </figure>
      )}
    </aside>
  );
}

export function PrestasiGallery({ galeri }) {
  const [main, ...rest] = galeri.foto;
  return (
    <section>
      <h2 className="font-ui text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-6xl lg:text-[72px]">{galeri.judul}</h2>
      <p className="mt-4 max-w-[641px] text-base leading-relaxed text-[#4b5563] sm:text-lg">{galeri.deskripsi}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[432px_1fr] lg:gap-[81px]">
        <img src={main} alt="Dokumentasi prestasi" loading="lazy" className="h-80 w-full rounded-3xl object-cover sm:h-[480px] lg:h-[675px] lg:rounded-[32px]" />
        <div className="grid gap-6">
          {rest.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt="Dokumentasi malam penganugerahan"
              loading="lazy"
              className="h-56 w-full rounded-3xl border-4 border-white object-cover shadow-[0_16px_32px_rgba(15,23,42,0.12)] sm:h-[320px] lg:h-full lg:rounded-[28px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PrestasiMiniFooter() {
  const links = ["Tentang Kami", "Hubungi Kami", "Kebijakan Privasi", "Syarat & Ketentuan"];
  return (
    <div className="border-t border-[#e5e7eb] bg-[#f3f4f6]">
      <div className="page-container flex flex-col items-center gap-6 py-8 text-center lg:flex-row lg:justify-between lg:text-left">
        <img src="/images/brand/logo-smkn2-full.png" alt="SMK Negeri 2 Kota Mojokerto" className="h-12 w-auto" />
        <ul className="flex max-w-[560px] flex-wrap justify-center gap-x-6 gap-y-3 text-base font-medium text-[#374151] sm:text-xl">
          {links.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        <p className="max-w-[235px] text-sm text-[#6b7280] lg:text-right">© 2026 SMKN 2 Kota Mojokerto. Semua Hak Dilindungi.</p>
      </div>
    </div>
  );
}
