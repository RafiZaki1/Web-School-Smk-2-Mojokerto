"use client";

import { useState } from "react";
import { Search, Upload } from "lucide-react";
import JurusanIcon from "@/shared/components/ui/JurusanIcon";
import { FormField } from "./FormField";

export const ICON_OPTIONS = [
  "Code",
  "Laptop",
  "Smartphone",
  "Database",
  "PenTool",
  "Palette",
  "Camera",
  "Landmark",
  "Calculator",
  "Handshake",
  "CreditCard",
  "FlaskConical",
  "ShieldCheck",
  "Package",
  "Store",
  "Leaf",
  "ChefHat",
  "Coffee",
  "GraduationCap",
  "Sparkles",
] as const;


interface IconPickerProps {
  label?: string;
  value: string;
  onChange: (name: string) => void;
}

// Grid pilih ikon dengan pencarian nama (dipakai kompetensi & prospek karier).
export function IconPicker({ label = "Pilih ikon", value, onChange }: IconPickerProps) {
  const [query, setQuery] = useState("");
  const shown = ICON_OPTIONS.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <FormField label={label} caps>
      <div className="rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] p-4">
        <label className="search-input-wrap">
          <span className="sr-only">Cari ikon</span>
          <Search className="search-input__icon" aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder='Cari ikon (mis: "bank", "laptop")...' className="search-input" />
        </label>
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10" role="radiogroup" aria-label={label}>
          {shown.map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={value === name}
              aria-label={name}
              title={name}
              onClick={() => onChange(name)}
              className={`flex aspect-square cursor-pointer items-center justify-center rounded-lg border transition-colors ${
                value === name ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#e2e8f0] bg-card text-[#334155] hover:border-[#2563eb]"
              }`}
            >
              <JurusanIcon name={name} size={20} />
            </button>
          ))}
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-[14px] font-medium text-[#2563eb]">
          <Upload size={16} aria-hidden="true" />
          Atau unggah ikon/logo sendiri (SVG/PNG)
          <input type="file" accept=".svg,image/png" className="sr-only" />
        </label>
      </div>
    </FormField>
  );
}
