"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import JurusanIcon from "@/shared/components/ui/JurusanIcon";
import { FormField } from "./FormField";
import { IconPicker } from "./IconPicker";

export interface TagIconItem {
  title: string;
  icon: string;
}

interface FormTagIconProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  placeholder?: string;
}

// Input tag: ketik lalu Enter; setiap tag punya ikon yang bisa dipilih.
export function FormTagIcon<T extends FieldValues>({ control, name, label, hint, placeholder = "Ketik lalu tekan Enter..." }: FormTagIconProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TagIconEditor
          items={(field.value ?? []) as TagIconItem[]}
          onChange={field.onChange}
          label={label}
          hint={hint}
          error={fieldState.error?.message}
          placeholder={placeholder}
        />
      )}
    />
  );
}

interface TagIconEditorProps {
  items: TagIconItem[];
  onChange: (items: TagIconItem[]) => void;
  label: string;
  hint?: string;
  error?: string;
  placeholder: string;
}

function TagIconEditor({ items, onChange, label, hint, error, placeholder }: TagIconEditorProps) {
  const [draft, setDraft] = useState("");
  const [activeIndex, setActiveIndex] = useState(items.length ? 0 : -1);

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    onChange([...items, { title, icon: "Sparkles" }]);
    setActiveIndex(items.length);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      add();
    }
  };

  const activeItem = activeIndex >= 0 ? items[activeIndex] : undefined;

  return (
    <div className="space-y-4">
      <FormField label={label} hint={hint} error={error}>
        <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-[10px] border border-[#e2e8f0] bg-card p-2">
          {items.map((item, index) => (
            <span
              key={`${item.title}-${index}`}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[14px] ${
                index === activeIndex ? "border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8]" : "border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b]"
              }`}
            >
              <button type="button" onClick={() => setActiveIndex(index)} className="flex cursor-pointer items-center gap-2" aria-label={`Pilih ikon untuk ${item.title}`}>
                <JurusanIcon name={item.icon} size={15} />
                {item.title}
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(items.filter((_, i) => i !== index));
                  setActiveIndex(-1);
                }}
                aria-label={`Hapus ${item.title}`}
                className="cursor-pointer text-[#94a3b8] hover:text-[#dc2626]"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </span>
          ))}
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label={label}
            className="min-w-[140px] flex-1 border-0 bg-transparent px-2 py-1 text-[15px] outline-none placeholder:text-[#94a3b8] sm:min-w-[200px]"
          />
        </div>
      </FormField>
      {activeItem ? (
        <IconPicker
          label={`Ikon untuk "${activeItem.title}"`}
          value={activeItem.icon}
          onChange={(icon) => onChange(items.map((item, i) => (i === activeIndex ? { ...item, icon } : item)))}
        />
      ) : null}
    </div>
  );
}
