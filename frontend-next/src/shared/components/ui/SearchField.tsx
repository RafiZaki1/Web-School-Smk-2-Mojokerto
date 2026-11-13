"use client";

import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

/** Kolom cari dengan ikon (pola SearchV1 DealTech UI tanpa tombol). */
export default function SearchField({ value, onChange, placeholder: rawPlaceholder = "Cari...", className = "", inputClassName = "", ...rest }: SearchFieldProps) {
  const { t } = useTranslation();
  const placeholder = t(rawPlaceholder);
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{placeholder}</span>
      <Search size={16} strokeWidth={2.25} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--color-muted)]" aria-hidden="true" />
      <input
        {...rest}
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-lg border border-[var(--color-line)] bg-card pr-4 pl-10 text-sm text-ink placeholder:text-[var(--color-muted)] focus:border-blue focus:ring-2 focus:ring-blue/15 ${inputClassName}`}
      />
    </label>
  );
}
