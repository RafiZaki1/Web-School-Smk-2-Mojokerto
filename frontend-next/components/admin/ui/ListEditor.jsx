"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Field } from "./Fields";

/** Daftar poin yang bisa ditambah/dihapus (tanggung jawab, kualifikasi, pencapaian). */
export default function ListEditor({ label, items, onChange, placeholder = "Tulis poin...", addLabel = "Tambah poin" }) {
  const update = (index, value) => onChange(items.map((item, i) => (i === index ? value : item)));

  return (
    <Field label={label}>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <GripVertical size={18} className="shrink-0 text-[#cbd5e1]" aria-hidden="true" />
            <input
              value={item}
              onChange={(event) => update(index, event.target.value)}
              placeholder={placeholder}
              aria-label={`${label} ${index + 1}`}
              className="inputtext__field"
            />
            <button
              type="button"
              className="adm-icon-btn adm-icon-btn--danger shrink-0"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label={`Hapus poin ${index + 1}`}
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="adm-btn adm-btn--text mt-2 px-0 text-[#2563eb]" onClick={() => onChange([...items, ""])}>
        <Plus aria-hidden="true" />
        <span>{addLabel}</span>
      </button>
    </Field>
  );
}
