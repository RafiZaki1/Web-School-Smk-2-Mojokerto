import Link from "next/link";
import { ArrowRight, Eye, Target } from "lucide-react";
import PageHeading from "@/components/common/PageHeading";
import MitraSearch from "./MitraSearch";

export function BkkAbout() {
  return (
    <section id="tentang" className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-[511px_1fr] lg:gap-[54px]">
      <img src="/images/bkk/bkk-logo.jpg" alt="Logo Bursa Kerja Khusus SMKN 2 Mojokerto" className="aspect-square w-full max-w-[511px] rounded-3xl object-cover shadow-[0_16px_32px_rgba(11,34,78,0.12)]" />
      <div>
        <PageHeading size="xl" tone="navy" eyebrow="Tentang Layanan" title="Apa itu BKK?" />
        <div className="mt-5 space-y-4 text-base leading-relaxed text-[#4b5563] sm:text-[17px]">
          <p>
            Bursa Kerja Khusus (BKK) adalah unit layanan ketenagakerjaan di SMK yang menjembatani lulusan dengan dunia usaha dan
            dunia industri (DUDI), pemerintah serta dunia usaha sebagai mitra informasi lowongan kerja sesuai kompetensi.
          </p>
          <p>
            BKK SMKN 2 Mojokerto menampung, berbagi, dan menyalurkan siswa untuk memperoleh informasi lowongan kerja terbaru, job
            fair, seminar karier, hingga rekomendasi magang di sekolah.
          </p>
        </div>
      </div>
    </section>
  );
}

export function BkkVisiMisi({ visi, misi }) {
  return (
    <section className="bg-navy-deep py-14 text-white lg:py-[72px]">
      <div className="page-container">
        <p className="text-xs font-bold tracking-[0.08em] text-[#93c5fd] uppercase sm:text-[13px]">Visi &amp; Misi</p>
        <h2 className="mt-2 text-2xl font-bold sm:text-[32px]">Visi &amp; Misi BKK</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-9">
          <article className="rounded-3xl bg-white p-7 text-ink lg:p-9">
            <h3 className="flex items-center gap-4 text-xl font-bold text-[#1c52b2] sm:text-2xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dbeafe]">
                <Eye size={26} aria-hidden="true" />
              </span>
              Visi BKK
            </h3>
            <p className="mt-6 text-base leading-relaxed text-[#4b5563] sm:text-lg">{visi}</p>
          </article>
          <article className="rounded-3xl bg-white p-7 text-ink lg:p-9">
            <h3 className="flex items-center gap-4 text-xl font-bold text-[#1c52b2] sm:text-2xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dbeafe]">
                <Target size={26} aria-hidden="true" />
              </span>
              Misi BKK
            </h3>
            <ul className="mt-6 space-y-3 text-base leading-relaxed text-[#4b5563] sm:text-lg">
              {misi.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

export function BkkRekrut({ items }) {
  return (
    <section>
      <PageHeading size="xl" tone="navy" eyebrow="Jejak Penelusuran" title="Siswa yang direkrut sebelum lulus" />
      <ul className="mt-8 grid grid-cols-2 gap-5 sm:gap-8 lg:mt-11 lg:grid-cols-4 lg:px-[52px]">
        {items.map((item) => (
          <li key={item.nama} className="flex justify-center">
            <img
              src={item.foto}
              alt={`${item.nama}, ${item.kelas}, direkrut ${item.perusahaan}`}
              loading="lazy"
              className="w-full max-w-[245px] rounded-2xl object-cover shadow-[0_12px_24px_rgba(11,34,78,0.15)]"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BkkMitra({ items }) {
  return (
    <section id="mitra" className="scroll-mt-28">
      <PageHeading size="xl" tone="navy" eyebrow="Mitra Perusahaan" title="Perusahaan mitra" />
      <MitraSearch items={items} />
    </section>
  );
}

export function BkkLokerTerkini({ items }) {
  return (
    <section>
      <PageHeading size="xl" tone="navy" eyebrow="Lowongan Terkini" title="Loker aktif saat ini" />
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[100px]">
        {items.map((job) => (
          <li key={job.slug}>
            <Link
              href={`/bkk/lowongan/${job.slug}`}
              className="block overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(11,34,78,0.08)] transition-shadow hover:shadow-[0_12px_32px_rgba(11,34,78,0.12)]"
            >
              <img src={job.poster} alt={`Poster lowongan ${job.title}`} loading="lazy" className="h-[226px] w-full object-cover object-top" />
              <div className="p-6">
                <h3 className="text-lg leading-snug font-bold text-ink">{job.title}</h3>
                <p className="mt-4 text-[13px] text-[#4b5563]">
                  {job.company} - {job.location}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <Link
          href="/bkk/lowongan"
          className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-base font-medium text-[#374151] shadow-[0_6px_18px_rgba(11,34,78,0.1)] transition-colors hover:text-blue sm:text-lg"
        >
          Lihat semua lowongan
          <ArrowRight size={18} className="text-blue" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
