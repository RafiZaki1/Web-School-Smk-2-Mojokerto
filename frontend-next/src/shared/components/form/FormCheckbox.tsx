"use client";

import { useId } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  className?: string;
}

/** Satu kotak centang boolean, mis. "Tampilkan di website". */
export function FormCheckbox<T extends FieldValues>({ control, name, label, hint, className = "" }: FormCheckboxProps<T>) {
  const fieldId = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`flex items-start gap-3 ${className}`}>
          <input
            id={fieldId}
            type="checkbox"
            checked={Boolean(field.value)}
            onChange={(event) => field.onChange(event.target.checked)}
            onBlur={field.onBlur}
            className="mt-1 size-[18px] cursor-pointer accent-[var(--color-accent)]"
          />
          <label htmlFor={fieldId} className="cursor-pointer">
            <span className="block text-[15px] font-semibold">{label}</span>
            {hint ? <span className="block text-[13px] opacity-75">{hint}</span> : null}
          </label>
        </div>
      )}
    />
  );
}

interface FormCheckboxGroupProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: readonly { value: string; label: string }[];
  className?: string;
}

/** Banyak pilihan sekaligus; nilai field berupa array string. */
export function FormCheckboxGroup<T extends FieldValues>({ control, name, label, options, className = "" }: FormCheckboxGroupProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected: string[] = Array.isArray(field.value) ? field.value : [];
        const toggle = (value: string) => field.onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);

        return (
          <fieldset className={`field ${className}`}>
            <legend className="field__label">{label}</legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {options.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2 text-[15px]">
                  <input type="checkbox" checked={selected.includes(option.value)} onChange={() => toggle(option.value)} className="size-[18px] cursor-pointer accent-[var(--color-accent)]" />
                  {option.label}
                </label>
              ))}
            </div>
            {fieldState.error ? (
              <p className="field__error" role="alert">
                {fieldState.error.message}
              </p>
            ) : null}
          </fieldset>
        );
      }}
    />
  );
}
