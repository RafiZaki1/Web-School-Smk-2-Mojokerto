"use client";

import type { ReactNode } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  caps?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

// Pembungkus label, hint, dan pesan galat untuk semua field form.
export function FormField({ label, hint, error, caps = false, htmlFor, className = "", children }: FormFieldProps) {
  const { t } = useTranslation();
  return (
    <div className={`field ${className}`}>
      {label ? (
        <label htmlFor={htmlFor} className={`field__label${caps ? " field__label--caps" : ""}`}>
          {t(label)}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="field__hint">{t(hint)}</p> : null}
      {error ? <p className="field__error" role="alert">{t(error)}</p> : null}
    </div>
  );
}
