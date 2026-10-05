/**
 * Banner bersudut di atas halaman dalam: foto sekolah + lapisan navy,
 * label kecil, judul, dan deskripsi (BKK, SPMB, Sejarah, Aspirasi, Produk).
 */
export default function PageHero({
  badge,
  title,
  description,
  image = "/hero-bg.webp",
  overlay = "bg-[linear-gradient(90deg,rgba(11,34,78,0.92)_0%,rgba(11,34,78,0.7)_45%,rgba(11,34,78,0.35)_100%)]",
  className = "",
}) {
  return (
    <section className={`relative overflow-hidden rounded-3xl bg-navy-deep text-white ${className}`}>
      {image && <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />}
      <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />

      <div className="relative px-6 py-10 sm:px-12 sm:py-14 lg:px-[72px] lg:py-[72px]">
        {badge && (
          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm lg:px-4 lg:text-sm">
            {badge}
          </span>
        )}
        <h1 className="mt-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-[48px]">{title}</h1>
        {description && (
          <p className="mt-3 max-w-[720px] text-base leading-relaxed text-white/85 sm:text-lg lg:text-2xl lg:leading-[1.45]">{description}</p>
        )}
      </div>
    </section>
  );
}
