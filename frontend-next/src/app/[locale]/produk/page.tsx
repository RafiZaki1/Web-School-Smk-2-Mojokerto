import type { Metadata } from "next";
import Image from "next/image";
import { GraduationCap, Heart, MessageCircle, ShieldCheck, Store, type LucideIcon } from "lucide-react";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import PageHero from "@/shared/components/layout/PageHero";
import { getProdukContent } from "@/features/produk";
import { getTranslator } from "@/shared/lib/i18n/server";
import PageOrnaments from "@/shared/components/ui/PageOrnaments";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const title = `${t("Produk Unggulan Sekolah")} - SMKN 2 Kota Mojokerto`;
  const description = t("Hasil karya nyata siswa SMKN 2 Mojokerto — diproduksi langsung dari praktik industri di sekolah.");
  return { title, description, openGraph: { title, description, type: "website" } };
}

const ICONS: Record<string, LucideIcon> = { graduation: GraduationCap, heart: Heart, shield: ShieldCheck };

const waLink = (whatsapp: string, text: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;

export default async function ProdukPage() {
  const [produk, t] = await Promise.all([getProdukContent(), getTranslator()]);

  return (
    <>
      <Navbar variant="light" />
      <main className="relative isolate flex-1 bg-card pt-[100px] lg:pt-[120px]">
        <div className="mx-auto w-[min(1368px,calc(100%-32px))]">
        <PageOrnaments theme="produk" />
          <PageHero
            badge="BLUD Sekolah"
            title="Produk Unggulan Sekolah"
            description="Hasil karya nyata siswa SMKN 2 Mojokerto — diproduksi langsung dari praktik industri di sekolah, siap dipesan untuk kebutuhan kamu."
            image={null}
            overlay="bg-[linear-gradient(120deg,var(--color-navy-deep)_0%,var(--color-navy)_100%)]"
            className="shadow-[0_16px_32px_rgba(16,25,49,0.18)]"
          />

          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:mt-[50px] lg:grid-cols-4 lg:gap-[45px] lg:px-6">
            {produk.items.map((item) => (
              <li key={item.name} className="flex flex-col">
                <span className="relative block aspect-[260/376] w-full overflow-hidden rounded-2xl">
                  <Image src={item.image} alt={t(item.name)} fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />
                </span>
                <h2 className="mt-4 text-sm font-semibold text-ink sm:text-base">{t(item.name)}</h2>
                <p className="mt-1 text-sm font-medium text-blue sm:text-base">{item.price}</p>
                <a
                  href={waLink(produk.whatsapp, t("Halo, saya ingin memesan {nama}.", { nama: item.name }))}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex h-11 items-center justify-center rounded-lg bg-blue text-sm font-medium text-white transition-colors hover:bg-blue-dark sm:text-base"
                >
                  {t("Pesan")}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <section className="mt-16 border-t border-[var(--color-surface-alt)] py-16 lg:mt-[78px] lg:py-[100px]">
          <div className="mx-auto w-[min(1368px,calc(100%-32px))]">
            <h2 className="text-center text-2xl font-bold text-ink sm:text-[32px]">{t("Kenapa produk kami?")}</h2>
            <ul className="mt-10 grid gap-5 sm:grid-cols-3 lg:mt-[72px] lg:gap-9">
              {produk.keunggulan.map((item) => {
                const Icon = ICONS[item.icon];
                return (
                  <li key={item.title} className="rounded-xl border border-[var(--color-surface-alt)] bg-[var(--color-surface-alt)] px-6 py-8 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dbe6fb] text-[#3864dc] dark:bg-blue-400/15 dark:text-blue-200">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-ink">{t(item.title)}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--color-body)]">{t(item.text)}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="bg-[#13232c] py-16 text-center text-white lg:py-[90px]">
          <div className="page-container">
            <h2 className="text-2xl font-bold sm:text-[32px]">{t("Mau pesan produk sekolah?")}</h2>
            <p className="mt-3 text-base text-white/70 sm:text-lg">{t("Hubungi kami langsung untuk info stok dan pemesanan.")}</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={waLink(produk.whatsapp, t("Halo, saya ingin bertanya tentang produk sekolah."))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25d366] px-9 text-lg font-semibold transition-colors hover:bg-[#1fb85a]"
              >
                <MessageCircle size={20} aria-hidden="true" />
                {t("Chat WhatsApp")}
              </a>
              <a
                href="https://maps.google.com/?q=SMK+Negeri+2+Kota+Mojokerto"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#3e4b52] px-9 text-lg font-semibold transition-colors hover:bg-[#273449]"
              >
                <Store size={20} aria-hidden="true" />
                {t("Kunjungi Toko Sekolah")}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
