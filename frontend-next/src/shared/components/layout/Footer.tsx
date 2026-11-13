import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { FOOTER_NAV, SOCIAL_LINKS } from "@/shared/constants/navigation";
import { getTranslator } from "@/shared/lib/i18n/server";
import FooterMap from "./FooterMap";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="relative pb-3 font-ui text-[15px] font-semibold uppercase tracking-[0.1em] text-white">
      {children}
      <span className="absolute bottom-0 left-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-teal to-transparent" />
    </h3>
  );
}

const linkClass = "inline-flex items-center gap-2.5 font-ui text-base text-white/70 transition-colors hover:text-white";

export default async function Footer() {
  const t = await getTranslator();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="kontak" className="relative overflow-hidden bg-footer text-white">
      <div className="page-container grid grid-cols-1 gap-10 pt-16 pb-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:pt-[90px]">
        <div className="sm:col-span-2 lg:col-span-5">
          <Link
            href="/"
            className="inline-flex rounded-[18px] bg-white/95 px-[18px] py-3.5 shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
            aria-label="SMK Negeri 2 Kota Mojokerto"
          >
            <Image src="/images/brand/logo-smkn2-full.png" alt="" width={177} height={63} className="h-[52px] w-auto sm:h-[63px]" />
          </Link>
          <p className="mt-6 max-w-[504px] font-ui text-[15px] leading-relaxed text-white/75">
            {t("Kami Siap Melayani Masyarakat Pendidikan Dan Pembelajaran Berbasis Budaya Kerja, Disiplin Dan Berprestasi.")}
          </p>
        </div>

        <nav aria-label={t("Menu utama footer")} className="lg:col-span-2">
          <FooterHeading>{t("Menu Utama")}</FooterHeading>
          <ul className="mt-6 space-y-3">
            {FOOTER_NAV.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={linkClass}>
                  <span className="h-2 w-1.5 rounded-full bg-teal/60" aria-hidden="true" />
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <FooterHeading>{t("Sosmed Kami")}</FooterHeading>
          <div className="mt-4 flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.href} href={social.href} target="_blank" rel="noreferrer" aria-label={t(social.label)} className="transition-opacity hover:opacity-75">
                <Image src={social.icon} alt="" width={27} height={27} />
              </a>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <FooterHeading>{t("Alamat")}</FooterHeading>
          <div className="mt-4 overflow-hidden rounded-lg border border-white/15 bg-footer-deep">
            <FooterMap />
            <div className="flex items-start gap-3 p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun text-sun-ink">
                <MapPin size={20} aria-hidden="true" />
              </span>
              <p className="text-[13px] leading-snug text-white/80">
                Jl. Raya Pulorejo, Mergelo, Pulorejo, Kec. Prajurit Kulon, Kota Mojokerto, Jawa Timur 61325
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-container flex flex-col items-center justify-between gap-3 py-5 text-[13px] text-white/70 sm:flex-row">
          <p className="text-center sm:text-left">&copy; {currentYear} SMK Negeri 2 Kota Mojokerto. {t("Hak Cipta Dilindungi.")}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="tel:0321387356" className="inline-flex items-center gap-2 transition-colors hover:text-white">
              <Phone size={14} aria-hidden="true" />
              0321 387356
            </a>
            <a href="mailto:smkn2mr@gmail.com" className="inline-flex items-center gap-2 transition-colors hover:text-white">
              <Mail size={14} aria-hidden="true" />
              smkn2mr@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
