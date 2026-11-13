"use client";

import type { ElementType, ReactNode } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface SectionHeaderProps {
  badge?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "start";
  flush?: boolean;
  as?: ElementType;
  id?: string;
  className?: string;
}

/**
 * Header section: eyebrow (badge atau teks), judul, dan deskripsi.
 * - badge: label kapital dengan garis kuning (mis. "Kebanggaan Kami")
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
}: SectionHeaderProps) {
  const { t } = useTranslation();
  // Teks biasa diterjemahkan; elemen JSX diteruskan apa adanya.
  const tr = (node: ReactNode) => (typeof node === "string" ? t(node) : node);
  const classes = ["section-header", align === "start" && "section-header--start", flush && "section-header--flush", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {badge && <span className="section-header__badge">{tr(badge)}</span>}
      {eyebrow && <span className="section-header__eyebrow">{tr(eyebrow)}</span>}
      <Heading id={id} className="section-header__title">
        {tr(title)}
      </Heading>
      {description && <p className="section-header__desc">{tr(description)}</p>}
    </div>
  );
}
