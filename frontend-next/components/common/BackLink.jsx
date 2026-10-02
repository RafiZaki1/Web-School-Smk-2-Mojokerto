import Link from "next/link";
import { ArrowLeft, ChevronLeft } from "lucide-react";

/** Tautan kembali kecil di atas halaman detail. */
export default function BackLink({ href, children, variant = "chevron", className = "" }) {
  const Icon = variant === "arrow" ? ArrowLeft : ChevronLeft;
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${className}`}
    >
      <Icon size={variant === "arrow" ? 18 : 16} strokeWidth={2.25} aria-hidden="true" />
      {children}
    </Link>
  );
}
