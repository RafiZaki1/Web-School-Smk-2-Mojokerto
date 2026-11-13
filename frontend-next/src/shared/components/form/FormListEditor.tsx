"use client";

import { useId } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { FormField } from "./FormField";

interface FormListEditorProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  addLabel?: string;
}

// Daftar poin teks yang bisa ditambah/dihapus (tanggung jawab, kualifikasi, pencapaian).
export function FormListEditor<T extends FieldValues>({ control, name, label, placeholder = "Tulis poin...", addLabel = "Tambah poin" }: FormListEditorProps<T>) {
  const groupId = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const items = (field.value ?? []) as string[];
        const update = (index: number, value: string) => field.onChange(items.map((item, i) => (i === index ? value : item)));

        return (
          <FormField label={label} error={fieldState.error?.message} htmlFor={groupId}>
            <ul className="space-y-3" id={groupId}>
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
                    onClick={() => field.onChange(items.filter((_, i) => i !== index))}
                    aria-label={`Hapus poin ${index + 1}`}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="adm-btn adm-btn--text mt-2 px-0 text-[#2563eb]" onClick={() => field.onChange([...items, ""])}>
              <Plus aria-hidden="true" />
              <span>{addLabel}</span>
            </button>
          </FormField>
        );
      }}
    />
  );
}
