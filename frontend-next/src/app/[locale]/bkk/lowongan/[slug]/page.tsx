import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import BackLink from "@/shared/components/ui/BackLink";
import ContactPanel from "@/shared/components/ui/ContactPanel";
import { LowonganBanner, getBkkContent, getLowonganDetail, getLowonganList } from "@/features/bkk";
import { localizeDate } from "@/shared/lib/i18n/date";
import { getLocale, getTranslator } from "@/shared/lib/i18n/server";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

export async function generateStaticParams() {
  return (await getLowonganList()).map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [job, t] = await Promise.all([getLowonganDetail(slug), getTranslator()]);
  const title = job ? `${t(job.title)} - ${job.company} | BKK SMKN 2 Kota Mojokerto` : `${t("Lowongan")} - BKK SMKN 2 Kota Mojokerto`;
  const description = job?.deskripsi ? t(job.deskripsi) : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: job?.poster ? [job.poster] : undefined },
  };
}

async function CheckList({ title, items }: { title: string; items: string[] }) {
  const t = await getTranslator();
  return (
    <section>
      <h2 className="text-xl font-bold text-ink sm:text-2xl lg:text-[28px]">{t(title)}</h2>
      <ul className="mt-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4 border-b border-[var(--color-line)] py-4 text-base text-[var(--color-body)] sm:text-lg lg:py-[22px] lg:text-xl">
            <Check size={18} strokeWidth={2.75} className="mt-1 shrink-0 text-[#16a34a] dark:text-green-400" aria-hidden="true" />
            {t(item)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function LowonganDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [job, bkk, t, locale] = await Promise.all([getLowonganDetail(slug), getBkkContent(), getTranslator(), getLocale()]);
  if (!job) notFound();

  // Kontak khusus lowongan diutamakan, sisanya kontak BKK
  const jobContact = Object.fromEntries(Object.entries(job.kontak).filter(([, value]) => value));
  const contact = { ...bkk.kontak, ...jobContact };

  const meta = [
    { label: t("Tipe kerja"), value: t(job.tipe) },
    { label: t("Lokasi"), value: t(job.location) },
    { label: t("Tutup"), value: localizeDate(job.tutup, locale) },
  ];

  return (
    <main className="relative isolate flex-1 border-b border-[var(--color-line)] bg-card pt-10 pb-16 lg:pt-[45px] lg:pb-[100px]">
      <div className="page-container max-w-[1316px]">
      <PageOrnaments theme="lowonganDetail" />
        <BackLink href="/bkk/lowongan" variant="arrow" className="font-normal text-[var(--color-body)] hover:text-blue">
          Kembali ke semua lowongan
        </BackLink>

        <section className="mt-8 grid items-start gap-8 lg:grid-cols-[530px_1fr] lg:gap-[45px]">
          {job.poster ? (
            <span className="relative block aspect-[530/410] w-full overflow-hidden rounded-2xl">
              <Image src={job.poster} alt={t("Poster lowongan {judul}", { judul: t(job.title) })} fill sizes="(min-width: 1024px) 530px, 100vw" className="object-cover object-top" />
            </span>
          ) : (
            <LowonganBanner banner={job.banner} className="aspect-[530/410] w-full rounded-2xl" />
          )}
          <div className="lg:pt-8">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${job.status === "Tutup" ? "bg-[var(--color-surface-alt)] text-[var(--color-muted)]" : "bg-[#dcfce7] text-[#166534] dark:bg-green-400/15 dark:text-green-200"}`}
            >
              {t(job.status)}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.02em] text-ink sm:text-5xl lg:text-[56px]">{t(job.title)}</h1>
            <p className="mt-4 text-lg text-[var(--color-body)] sm:text-[22px] lg:text-[28px]">
              {job.company} · {t(job.location)}
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-4 lg:mt-14 lg:max-w-[640px]">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-semibold tracking-[0.06em] text-[var(--color-muted)] uppercase sm:text-[13px]">{item.label}</dt>
                  <dd className="mt-1 text-base font-semibold text-ink sm:text-xl lg:text-2xl">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="mt-14 max-w-[1260px] space-y-12 lg:mt-[100px]">
          <section>
            <h2 className="text-xl font-bold text-ink sm:text-2xl lg:text-[28px]">{t("Deskripsi Pekerjaan")}</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-body)] sm:text-lg lg:text-xl lg:leading-9">{t(job.deskripsi)}</p>
          </section>
          <CheckList title="Tanggung Jawab" items={job.tanggungJawab} />
          <CheckList title="Kualifikasi" items={job.kualifikasi} />
          <ContactPanel title="Tertarik dengan posisi ini?" description="Hubungi panitia BKK untuk info lebih lanjut sebelum melamar." contact={contact} />
        </div>
      </div>
    </main>
  );
}
