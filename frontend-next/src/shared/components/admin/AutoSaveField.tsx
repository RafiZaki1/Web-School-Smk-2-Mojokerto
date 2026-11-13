"use client";

import { useRef, useState } from "react";

const DEBOUNCE_MS = 900;

interface AutoSaveTextProps {
  value: string | null;
  onSave: (value: string) => Promise<unknown>;
  label: string;
  multiline?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

/**
 * Kolom teks yang tersimpan sendiri: 0,9 detik setelah berhenti mengetik atau saat kolom ditinggalkan.
 * Selama diketik, teks lokal yang tampil; setelah tersimpan, nilai dari server kembali dipakai
 * sehingga perubahan dari perangkat TU lain ikut terlihat.
 */
export function AutoSaveText({ value, onSave, label, multiline = false, placeholder, maxLength = 1000, className = "" }: AutoSaveTextProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const focused = useRef(false);
  const current = value ?? "";

  const save = (next: string) => {
    window.clearTimeout(timer.current);
    if (next === current) {
      if (!focused.current) setDraft(null);
      return;
    }
    onSave(next)
      .then(() => !focused.current && setDraft(null))
      .catch(() => undefined);
  };

  const change = (next: string) => {
    setDraft(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => save(next), DEBOUNCE_MS);
  };

  const shared = {
    value: draft ?? current,
    "aria-label": label,
    placeholder,
    maxLength,
    className: `svc-input ${className}`,
    onFocus: () => {
      focused.current = true;
    },
    onBlur: () => {
      focused.current = false;
      if (draft !== null) save(draft);
    },
  };

  return multiline ? (
    <textarea {...shared} rows={2} onChange={(event) => change(event.target.value)} />
  ) : (
    <input {...shared} type="text" onChange={(event) => change(event.target.value)} />
  );
}

interface AutoSaveSelectProps {
  value: string;
  options: readonly { value: string; label: string }[];
  onSave: (value: string) => Promise<unknown>;
  label: string;
  className?: string;
}

/** Dropdown yang langsung tersimpan saat dipilih; pilihan baru tampil selama permintaan berjalan. */
export function AutoSaveSelect({ value, options, onSave, label, className = "" }: AutoSaveSelectProps) {
  const [pending, setPending] = useState<string | null>(null);

  const change = (next: string) => {
    setPending(next);
    onSave(next)
      .catch(() => undefined)
      .finally(() => setPending(null));
  };

  return (
    <select value={pending ?? value} aria-label={label} onChange={(event) => change(event.target.value)} className={`svc-input ${className}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
