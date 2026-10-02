import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import BackLink from "@/components/common/BackLink";
import ContactPanel from "@/components/common/ContactPanel";
import { LowonganBanner } from "@/components/bkk/LowonganCard";
import { getBkkContent, getLowonganDetail, getLowonganList } from "@/lib/api/contentApi";

export async function generateStaticParams() {
  return (await getLowonganList()).map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = await getLowonganDetail(slug);
  return {
    title: job ? `${job.title} - ${job.company} | BKK SMKN 2 Kota Mojokerto` : "Lowongan - BKK SMKN 2 Kota Mojokerto",
    description: job?.deskripsi,
  };
}

function CheckList({ title, items }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-ink sm:text-2xl lg:text-[28px]">{title}</h2>
      <ul className="mt-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4 border-b border-[#e5e7eb] py-4 text-base text-[#374151] sm:text-lg lg:py-[22px] lg:text-xl">
            <Check size={18} strokeWidth={2.75} className="mt-1 shrink-0 text-[#16a34a]" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function LowonganDetailPage({ params }) {
  const { slug } = await params;
  const [job, bkk] = await Promise.all([getLowonganDetail(slug), getBkkContent()]);
  if (!job) notFound();

  // Kontak khusus lowongan diutamakan, sisanya kontak BKK
  const contact = { ...bkk.kontak, ...Object.fromEntries(Object.entries(job.kontak ?? {}).filter(([, value]) => value)) };

  const meta = [
    { label: "Tipe kerja", value: job.tipe },
    { label: "Lokasi", value: job.location },
    { label: "Tutup", value: job.tutup },
  ];

  return (
    <main className="flex-1 border-b border-[#d1d5db] bg-white pt-10 pb-16 lg:pt-[45px] lg:pb-[100px]">
      <div className="page-container max-w-[1316px]">
        <BackLink href="/bkk/lowongan" variant="arrow" className="font-normal text-[#374151] hover:text-blue">
          Kembali ke semua lowongan
        </BackLink>

        <section className="mt-8 grid items-start gap-8 lg:grid-cols-[530px_1fr] lg:gap-[45px]">
          {job.poster ? (
            <img src={job.poster} alt={`Poster lowongan ${job.title}`} className="aspect-[530/410] w-full rounded-2xl object-cover object-top" />
          ) : (
            <LowonganBanner banner={job.banner} className="aspect-[530/410] w-full rounded-2xl" />
          )}
          <div className="lg:pt-8">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${job.status === "Tutup" ? "bg-[#f1f5f9] text-[#475569]" : "bg-[#dcfce7] text-[#166534]"}`}>{job.status}</span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.02em] text-ink sm:text-5xl lg:text-[56px]">{job.title}</h1>
            <p className="mt-4 text-lg text-[#4b5563] sm:text-[22px] lg:text-[28px]">
              {job.company} · {job.location}
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-4 lg:mt-14 lg:max-w-[640px]">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-semibold tracking-[0.06em] text-[#6b7280] uppercase sm:text-[13px]">{item.label}</dt>
                  <dd className="mt-1 text-base font-semibold text-ink sm:text-xl lg:text-2xl">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="mt-14 max-w-[1260px] space-y-12 lg:mt-[100px]">
          <section>
            <h2 className="text-xl font-bold text-ink sm:text-2xl lg:text-[28px]">Deskripsi Pekerjaan</h2>
            <p className="mt-4 text-base leading-relaxed text-[#4b5563] sm:text-lg lg:text-xl lg:leading-9">{job.deskripsi}</p>
          </section>
          <CheckList title="Tanggung Jawab" items={job.tanggungJawab} />
          <CheckList title="Kualifikasi" items={job.kualifikasi} />
          <ContactPanel
            title="Tertarik dengan posisi ini?"
            description="Hubungi panitia BKK untuk info lebih lanjut sebelum melamar."
            contact={contact}
          />
        </div>
      </div>
    </main>
  );
}
