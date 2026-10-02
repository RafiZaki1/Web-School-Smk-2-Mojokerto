import { Star } from "lucide-react";

/**
 * Header section: eyebrow (badge atau teks), judul, dan deskripsi.
 * - badge: label pil biru (mis. "Kebanggaan Kami")
 * - eyebrow: label teks hijau kapital (halaman detail jurusan)
 */
export default function SectionHeader({
  badge,
  eyebrow,
  title,
  description,
  align = "center",
  flush = false,
  as: Heading = "h2",
  id,
  className = "",
}) {
  const classes = [
    "section-header",
    align === "start" && "section-header--start",
    flush && "section-header--flush",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {badge && (
        <span className="section-header__badge">
          <Star size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          {badge}
        </span>
      )}
      {eyebrow && <span className="section-header__eyebrow">{eyebrow}</span>}
      <Heading id={id} className="section-header__title">
        {title}
      </Heading>
      {description && <p className="section-header__desc">{description}</p>}
    </div>
  );
}
