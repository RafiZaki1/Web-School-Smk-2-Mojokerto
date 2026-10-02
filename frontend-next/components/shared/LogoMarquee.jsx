/**
 * Deretan logo mitra yang bergulir terus.
 * Dua paruh identik + translateX(-50%) supaya loop tidak meloncat;
 * jarak memakai padding (bukan gap) agar kedua paruh sama lebar.
 */
export default function LogoMarquee({ partners = [], spacingClass = "pr-14 sm:pr-20" }) {
  if (!partners.length) return null;

  const half = partners.length < 6 ? [...partners, ...partners] : partners;

  return (
    <div className="overflow-hidden py-2">
      <ul className="animate-marquee items-center">
        {[...half, ...half].map((partner, index) => (
          <li
            key={`${partner.name}-${index}`}
            className={`flex shrink-0 items-center ${spacingClass}`}
            aria-hidden={index >= partners.length || undefined}
          >
            <img src={partner.logo} alt={partner.name} className={`${partner.height} w-auto object-contain`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
