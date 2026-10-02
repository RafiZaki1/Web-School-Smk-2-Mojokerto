"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Select from "@/components/ui/Select";

/** Pembungkus label + hint + galat untuk semua field admin. */
export function Field({ label, hint, error, caps = false, htmlFor, children, className = "" }) {
  return (
    <div className={`field ${className}`}>
      {label ? (
        <label htmlFor={htmlFor} className={`field__label${caps ? " field__label--caps" : ""}`}>
          {label}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="field__hint">{hint}</p> : null}
      {error ? <p className="field__error">{error}</p> : null}
    </div>
  );
}

/** InputText dari dealtech-ui, dengan ikon kiri & tombol lihat sandi. */
export function InputText({ label, hint, error, caps, icon: Icon, type = "text", className = "", id, ...props }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";

  return (
    <Field label={label} hint={hint} error={error} caps={caps} htmlFor={fieldId} className={className}>
      <div className={`inputtext__wrap${Icon ? " inputtext__wrap--icon" : ""}`}>
        {Icon ? <Icon aria-hidden="true" /> : null}
        <input
          id={fieldId}
          type={isPassword && reveal ? "text" : type}
          aria-invalid={error ? true : undefined}
          className={`inputtext__field${error ? " inputtext__field--error" : ""}${isPassword ? " pr-12" : ""}`}
          {...props}
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
    </Field>
  );
}

/** InputLongText (textarea) dari dealtech-ui. */
export function InputLongText({ label, hint, error, caps, rows = 4, className = "", id, ...props }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} caps={caps} htmlFor={fieldId} className={className}>
      <textarea id={fieldId} rows={rows} aria-invalid={error ? true : undefined} className="inputlongtext__field" {...props} />
    </Field>
  );
}

/** Dropdown bergaya dealtech-ui memakai Select kustom; onChange menerima nilai langsung. */
export function SelectInput({ label, hint, error, options = [], placeholder, className = "", id, value, onChange, searchable, disabled }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} htmlFor={fieldId} className={className}>
      <Select
        id={fieldId}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        searchable={searchable}
        disabled={disabled}
        invalid={Boolean(error)}
      />
    </Field>
  );
}

/** Pilihan pil satu nilai (kategori, predikat, status). */
export function ChoiceChips({ label, options, value, onChange, className = "" }) {
  return (
    <Field label={label} className={className}>
      <div className="choice-chips" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={value === option}
            className="choice-chip"
            onClick={() => onChange?.(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </Field>
  );
}
