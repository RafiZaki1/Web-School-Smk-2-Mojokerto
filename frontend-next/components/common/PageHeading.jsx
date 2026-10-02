const TONES = {
  blue: { eyebrow: "text-blue", title: "text-[#1f2937]" },
  accent: { eyebrow: "text-accent", title: "text-heading" },
  navy: { eyebrow: "text-[#1c52b2]", title: "text-navy-deep" },
  muted: { eyebrow: "text-[#798eb1]", title: "text-[#001129]" },
};

/** Eyebrow + judul + deskripsi untuk section di halaman dalam. */
export default function PageHeading({
  eyebrow,
  title,
  description,
  tone = "blue",
  align = "start",
  size = "md",
  as: Heading = "h2",
  className = "",
}) {
  const colors = TONES[tone] ?? TONES.blue;
  const titleSize = {
    lg: "text-3xl sm:text-4xl lg:text-[48px] lg:leading-[1.25]",
    xl: "text-2xl sm:text-[30px] lg:text-[34px] lg:leading-[1.3]",
    md: "text-2xl sm:text-[28px] lg:text-[32px] lg:leading-[1.3]",
  }[size];
  const eyebrowSize = size === "xl" ? "text-[13px] sm:text-base lg:text-lg" : "text-xs sm:text-[13px]";
  const descSize = size === "xl" ? "text-base sm:text-lg lg:text-[22px]" : "text-base sm:text-lg";

  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <p className={`font-bold tracking-[0.08em] uppercase ${eyebrowSize} ${colors.eyebrow}`}>{eyebrow}</p>
      )}
      <Heading className={`mt-2 font-bold tracking-[-0.01em] ${titleSize} ${colors.title}`}>{title}</Heading>
      {description && (
        <p className={`mt-2 leading-relaxed text-[#6b7280] ${descSize} ${align === "center" ? "mx-auto" : ""} max-w-[1000px]`}>
          {description}
        </p>
      )}
    </div>
  );
}
