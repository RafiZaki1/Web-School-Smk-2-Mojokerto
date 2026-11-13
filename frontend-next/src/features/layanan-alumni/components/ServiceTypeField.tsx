"use client";

import { Controller, type Control } from "react-hook-form";
import { SERVICE_TYPE_OPTIONS } from "../constants/layanan-alumni-keys";
import type { AlumniServiceFormValues } from "../validation/alumni-service.schema";

/** Pilihan jenis layanan berbentuk radio berlabel jelas. */
export function ServiceTypeField({ control }: { control: Control<AlumniServiceFormValues> }) {
  return (
    <Controller
      control={control}
      name="service_type"
      render={({ field, fieldState }) => (
        <fieldset className="field">
          <legend className="field__label">Jenis layanan</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {SERVICE_TYPE_OPTIONS.map((option) => {
              const checked = field.value === option.value;
              return (
                <label key={option.value} className={`flex cursor-pointer gap-2.5 rounded-md border px-3 py-3 ${checked ? "border-accent bg-tint" : "border-line bg-card"}`}>
                  <input type="radio" name={field.name} value={option.value} checked={checked} onChange={() => field.onChange(option.value)} onBlur={field.onBlur} className="mt-1 accent-[var(--color-accent)]" />
                  <span>
                    <span className="block text-[15px] font-semibold text-heading">{option.label}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">{option.hint}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {fieldState.error ? (
            <p className="field__error" role="alert">
              {fieldState.error.message}
            </p>
          ) : null}
        </fieldset>
      )}
    />
  );
}
