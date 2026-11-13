"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { FormField } from "./FormField";

interface FormChoiceChipsProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  options: readonly string[];
  label: string;
  className?: string;
}

// Pilihan pil satu nilai (kategori, predikat, status).
export function FormChoiceChips<T extends FieldValues>({ control, name, options, label, className }: FormChoiceChipsProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message} className={className}>
          <div className="choice-chips" role="radiogroup" aria-label={label}>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={field.value === option}
                className="choice-chip"
                onClick={() => field.onChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </FormField>
      )}
    />
  );
}
