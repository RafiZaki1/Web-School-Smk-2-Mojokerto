"use client";

import { useId } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import Select from "@/shared/components/ui/Select";
import { FormField } from "./FormField";

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  options: readonly string[] | readonly { value: string; label: string }[];
  label?: string;
  hint?: string;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

// Dropdown form memakai komponen Select kustom; nilainya langsung string.
export function FormSelect<T extends FieldValues>({ control, name, options, label, hint, placeholder, searchable, disabled, className }: FormSelectProps<T>) {
  const fieldId = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField label={label} hint={hint} error={fieldState.error?.message} htmlFor={fieldId} className={className}>
          <Select
            id={fieldId}
            value={field.value ?? ""}
            onChange={field.onChange}
            options={options}
            placeholder={placeholder}
            searchable={searchable}
            disabled={disabled}
            invalid={Boolean(fieldState.error)}
          />
        </FormField>
      )}
    />
  );
}
