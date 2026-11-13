"use client";

import Image from "next/image";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { OrnamentSparkle, OrnamentSquiggle } from "@/shared/components/ui/Ornaments";
import { HERO_ORNAMENTS, type PageOrnamentTheme } from "@/shared/components/ui/PageOrnaments";

interface PageHeroProps {
  badge?: string;
  title: string;
  description?: string;
  image?: string | null;
  overlay?: string;
  className?: string;
  /** Topik halaman; menampilkan ikon besar samar yang sesuai di sisi kanan banner. */
  theme?: PageOrnamentTheme;
}

/**
 * Banner bersudut di atas halaman dalam: foto sekolah + lapisan navy,
 * label kecil, judul, dan deskripsi (BKK, SPMB, Sejarah, Produk).
 */
export default function PageHero({
  badge,
  title,
  description,
  image = "/hero-bg.webp",
  overlay = "bg-[linear-gradient(90deg,rgba(8,53,75,0.92)_0%,rgba(8,53,75,0.7)_45%,rgba(8,53,75,0.35)_100%)]",
  className = "",
  theme,
}: PageHeroProps) {
  const { t } = useTranslation();
  const ThemeOrnament = theme ? HERO_ORNAMENTS[theme] : undefined;
  return (
    <section className={`relative overflow-hidden rounded-3xl bg-navy-deep text-white ${className}`}>
      {image && <Image src={image} alt="" aria-hidden="true" fill sizes="100vw" className="object-cover" />}
      <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />
      {/* Ikon tema butuh ruang kosong di kanan teks, jadi baru muncul di xl; di bawahnya tetap coretan */}
      <OrnamentSquiggle className={`absolute -top-20 -right-10 hidden w-56 text-white/15 sm:block lg:w-72 ${ThemeOrnament ? "xl:hidden" : ""}`} />
      {ThemeOrnament && <ThemeOrnament className="absolute top-1/2 right-[7%] hidden w-44 -translate-y-1/2 rotate-12 text-white/15 xl:block 2xl:w-52" />}
      <OrnamentSparkle className="absolute top-8 right-8 w-7 text-sun sm:top-10 sm:right-[22%] lg:w-9" />

      <div className="relative px-6 py-10 sm:px-12 sm:py-14 lg:px-[72px] lg:py-[72px]">
        {badge && (
          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm lg:px-4 lg:text-sm">
            {t(badge)}
          </span>
        )}
        <h1 className="mt-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-[48px]">{t(title)}</h1>
        {description && <p className="mt-3 max-w-[720px] text-base leading-relaxed text-white/85 sm:text-lg lg:text-2xl lg:leading-[1.45]">{t(description)}</p>}
      </div>
    </section>
  );
}
