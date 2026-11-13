import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import { GraduationHelpContacts } from "./GraduationHelpContacts";

export type PortalTone = "neutral" | "success" | "danger";

const EYEBROW_TONE: Record<PortalTone, string> = {
  neutral: "text-accent",
  success: "text-[#15803d] dark:text-[#86efac]",
  danger: "text-[#b91c1c] dark:text-[#fca5a5]",
};

const ICON_TONE: Record<PortalTone, string> = {
  neutral: "bg-tint text-accent",
  success: "bg-[#dcfce7] text-[#15803d] dark:bg-[#14532d] dark:text-[#86efac]",
  danger: "bg-[#fee2e2] text-[#b91c1c] dark:bg-[#450a0a] dark:text-[#fca5a5]",
};

interface GraduationPortalCardProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  tone?: PortalTone;
  children?: ReactNode;
}

/**
 * Kartu tunggal di tengah halaman Cek Kelulusan: ikon, status singkat, judul, penjelasan,
 * isi sesuai keadaan (tombol, hitung mundur, form, atau hasil), lalu kontak bantuan.
 */
export function GraduationPortalCard({ eyebrow, title, description, tone = "neutral", children }: GraduationPortalCardProps) {
  return (
    <section className="mx-auto max-w-[840px] rounded-3xl border border-line bg-card px-5 py-10 text-center sm:px-12 sm:py-12" aria-labelledby="judul-portal-kelulusan" aria-live="polite">
      <span className={`mx-auto flex size-[68px] items-center justify-center rounded-full ${ICON_TONE[tone]}`}>
        <GraduationCap size={30} aria-hidden="true" />
      </span>
      <p className={`mt-5 text-[15px] font-semibold ${EYEBROW_TONE[tone]}`}>{eyebrow}</p>
      <h1 id="judul-portal-kelulusan" className="mt-2 text-[26px] leading-tight font-bold text-heading sm:text-[32px]">
        {title}
      </h1>
      {description ? <div className="mx-auto mt-3 max-w-[620px] text-[16px] leading-relaxed text-muted sm:text-[17px]">{description}</div> : null}
      {children ? <div className="mt-7">{children}</div> : null}
      <div className="mt-9">
        <GraduationHelpContacts />
      </div>
    </section>
  );
}
