"use client";

import type { ElementType } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";

type HeadingTone = "blue" | "accent" | "navy" | "muted";
type HeadingSize = "md" | "lg" | "xl";

const TONES: Record<HeadingTone, { eyebrow: string; title: string }> = {
  blue: { eyebrow: "text-blue", title: "text-[var(--color-body)]" },
  accent: { eyebrow: "text-accent", title: "text-heading" },
  navy: { eyebrow: "text-navy-ink", title: "text-navy-deep-ink" },
  muted: { eyebrow: "text-muted", title: "text-navy-deep-ink" },
};

const TITLE_SIZE: Record<HeadingSize, string> = {
  lg: "text-3xl sm:text-4xl lg:text-[48px] lg:leading-[1.25]",
  xl: "text-2xl sm:text-[30px] lg:text-[34px] lg:leading-[1.3]",
  md: "text-2xl sm:text-[28px] lg:text-[32px] lg:leading-[1.3]",
};

interface PageHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: HeadingTone;
  align?: "start" | "center";
  size?: HeadingSize;
  as?: ElementType;
  className?: string;
}

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
}: PageHeadingProps) {
  const { t } = useTranslation();
  const colors = TONES[tone];
  const titleSize = TITLE_SIZE[size];
  const eyebrowSize = size === "xl" ? "text-[13px] sm:text-base lg:text-lg" : "text-xs sm:text-[13px]";
  const descSize = size === "xl" ? "text-base sm:text-lg lg:text-[22px]" : "text-base sm:text-lg";

  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && <p className={`font-bold ${eyebrowSize} ${colors.eyebrow}`}>{t(eyebrow)}</p>}
      <Heading className={`mt-2 font-bold tracking-[-0.01em] ${titleSize} ${colors.title}`}>{t(title)}</Heading>
      {description && (
        <p className={`mt-2 leading-relaxed text-[var(--color-muted)] ${descSize} ${align === "center" ? "mx-auto" : ""} max-w-[1000px]`}>{t(description)}</p>
      )}
    </div>
  );
}
