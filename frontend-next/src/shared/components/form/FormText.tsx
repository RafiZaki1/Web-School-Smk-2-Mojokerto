"use client";

import { useId, useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { FormField } from "./FormField";

interface FormTextProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  hint?: string;
  type?: "text" | "email" | "password" | "date" | "search" | "tel" | "url";
  placeholder?: string;
  autoComplete?: string;
  icon?: LucideIcon;
  caps?: boolean;
  className?: string;
  disabled?: boolean;
  // Mengubah nilai saat diketik, mis. huruf kapital untuk kode jurusan
  transform?: (value: string) => string;
  maxLength?: number;
}

// Input teks terkontrol oleh React Hook Form. Kata sandi punya tombol lihat/sembunyikan.
export function FormText<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  type = "text",
  placeholder,
  autoComplete,
  icon: Icon,
  caps,
  className,
  disabled,
  transform,
  maxLength,
}: FormTextProps<T>) {
  const { t } = useTranslation();
  const fieldId = useId();
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField label={label} hint={hint} error={fieldState.error?.message} caps={caps} htmlFor={fieldId} className={className}>
          <div className={`inputtext__wrap${Icon ? " inputtext__wrap--icon" : ""}`}>
            {Icon ? <Icon aria-hidden="true" /> : null}
            <input
              {...field}
              id={fieldId}
              value={field.value ?? ""}
              onChange={(event) => field.onChange(transform ? transform(event.target.value) : event.target.value)}
              type={isPassword && reveal ? "text" : type}
              placeholder={placeholder && t(placeholder)}
              autoComplete={autoComplete}
              disabled={disabled}
              maxLength={maxLength}
              aria-invalid={fieldState.error ? true : undefined}
              className={`inputtext__field${fieldState.error ? " inputtext__field--error" : ""}${isPassword ? " pr-12" : ""}`}
            />
            {isPassword ? (
              <button
                type="button"
                className="inputtext__reveal"
                onClick={() => setReveal((value) => !value)}
                aria-label={reveal ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
              >
                {reveal ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            ) : null}
          </div>
        </FormField>
      )}
    />
  );
}
