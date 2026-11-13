"use client";

import { useId } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { FormField } from "./FormField";

interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  hint?: string;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export function FormTextarea<T extends FieldValues>({ control, name, label, hint, rows = 4, placeholder, className }: FormTextareaProps<T>) {
  const { t } = useTranslation();
  const fieldId = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField label={label} hint={hint} error={fieldState.error?.message} htmlFor={fieldId} className={className}>
          <textarea
            {...field}
            id={fieldId}
            rows={rows}
            value={field.value ?? ""}
            placeholder={placeholder && t(placeholder)}
            aria-invalid={fieldState.error ? true : undefined}
            className="inputlongtext__field"
          />
        </FormField>
      )}
    />
  );
}
