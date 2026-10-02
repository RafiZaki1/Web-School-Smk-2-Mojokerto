import { ChevronLeft, ChevronRight } from "lucide-react";

const base =
  "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

/** Paginasi angka sederhana; aktif berwarna biru. */
export default function Pagination({ page, totalPages, onChange, activeClassName = "border-blue bg-blue text-white", className = "" }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Halaman" className={`flex items-center justify-center gap-2 ${className}`}>
      {page > 1 && (
        <button type="button" className={`${base} border-[#e2e8f0] bg-white text-ink hover:bg-[#f1f5f9]`} onClick={() => onChange(page - 1)} aria-label="Halaman sebelumnya">
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
      )}
      {pages.map((number) => (
        <button
          key={number}
          type="button"
          aria-current={number === page ? "page" : undefined}
          onClick={() => onChange(number)}
          className={`${base} ${number === page ? activeClassName : "border-[#e2e8f0] bg-white text-ink hover:bg-[#f1f5f9]"}`}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        className={`${base} border-[#e2e8f0] bg-white text-ink hover:bg-[#f1f5f9]`}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
