import { GraduationCap, Heart, MessageCircle, ShieldCheck, Store } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/common/PageHero";
import { getProdukContent } from "@/lib/api/contentApi";

export const metadata = {
  title: "Produk Unggulan Sekolah - SMKN 2 Kota Mojokerto",
  description: "Hasil karya nyata siswa SMKN 2 Mojokerto, diproduksi langsung dari praktik industri di sekolah.",
};

const ICONS = { graduation: GraduationCap, heart: Heart, shield: ShieldCheck };

const waLink = (whatsapp, text) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;

export default async function ProdukPage() {
  const produk = await getProdukContent();

  return (
    <>
      <Navbar variant="light" />
      <main className="flex-1 bg-white pt-[100px] lg:pt-[120px]">
        <div className="mx-auto w-[min(1368px,calc(100%-32px))]">
          <PageHero
            badge="BLUD Sekolah"
            title="Produk Unggulan Sekolah"
            description="Hasil karya nyata siswa SMKN 2 Mojokerto — diproduksi langsung dari praktik industri di sekolah, siap dipesan untuk kebutuhan kamu."
            image={null}
            overlay="bg-[linear-gradient(120deg,#101931_0%,#1c367f_100%)]"
            className="shadow-[0_16px_32px_rgba(16,25,49,0.18)]"
          />

          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:mt-[50px] lg:grid-cols-4 lg:gap-[45px] lg:px-6">
            {produk.items.map((item) => (
              <li key={item.name} className="flex flex-col">
                <img src={item.image} alt={item.name} loading="lazy" className="aspect-[260/376] w-full rounded-2xl object-cover" />
                <h2 className="mt-4 text-sm font-semibold text-ink sm:text-base">{item.name}</h2>
                <p className="mt-1 text-sm font-medium text-blue sm:text-base">{item.price}</p>
                <a
                  href={waLink(produk.whatsapp, `Halo, saya ingin memesan ${item.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex h-11 items-center justify-center rounded-lg bg-blue text-sm font-medium text-white transition-colors hover:bg-blue-dark sm:text-base"
                >
                  Pesan
                </a>
              </li>
            ))}
          </ul>
        </div>

        <section className="mt-16 border-t border-[#f1f5f9] py-16 lg:mt-[78px] lg:py-[100px]">
          <div className="mx-auto w-[min(1368px,calc(100%-32px))]">
            <h2 className="text-center text-2xl font-bold text-ink sm:text-[32px]">Kenapa produk kami?</h2>
            <ul className="mt-10 grid gap-5 sm:grid-cols-3 lg:mt-[72px] lg:gap-9">
              {produk.keunggulan.map((item) => {
                const Icon = ICONS[item.icon];
                return (
                  <li key={item.title} className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-6 py-8 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dbe6fb] text-[#3864dc]">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[#4b5563]">{item.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="bg-[#111827] py-16 text-center text-white lg:py-[90px]">
          <div className="page-container">
            <h2 className="text-2xl font-bold sm:text-[32px]">Mau pesan produk sekolah?</h2>
            <p className="mt-3 text-base text-white/70 sm:text-lg">Hubungi kami langsung untuk info stok dan pemesanan.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={waLink(produk.whatsapp, "Halo, saya ingin bertanya tentang produk sekolah.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25d366] px-9 text-lg font-semibold transition-colors hover:bg-[#1fb85a]"
              >
                <MessageCircle size={20} aria-hidden="true" />
                Chat WhatsApp
              </a>
              <a
                href="https://maps.google.com/?q=SMK+Negeri+2+Kota+Mojokerto"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#1f2937] px-9 text-lg font-semibold transition-colors hover:bg-[#273449]"
              >
                <Store size={20} aria-hidden="true" />
                Kunjungi Toko Sekolah
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
