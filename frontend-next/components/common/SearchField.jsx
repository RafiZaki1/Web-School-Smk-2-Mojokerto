import { Search } from "lucide-react";

/** Kolom cari dengan ikon (pola SearchV1 DealTech UI tanpa tombol). */
export default function SearchField({ value, onChange, placeholder = "Cari...", className = "", inputClassName = "", ...rest }) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{placeholder}</span>
      <Search
        size={16}
        strokeWidth={2.25}
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#6b7280]"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-lg border border-[#e2e8f0] bg-white pr-4 pl-10 text-sm text-ink outline-none placeholder:text-[#9ca3af] focus:border-blue focus:ring-2 focus:ring-blue/15 ${inputClassName}`}
        {...rest}
      />
    </label>
  );
}
