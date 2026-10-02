"use client";

import { useState } from "react";
import { Search, Upload, X } from "lucide-react";
import JurusanIcon from "@/components/jurusan/JurusanIcon";
import { Field } from "./Fields";

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
];

/** Grid pilih ikon dengan pencarian nama (dipakai kompetensi & prospek karier). */
export function IconPicker({ label = "Pilih ikon", value, onChange }) {
  const [query, setQuery] = useState("");
  const shown = ICON_OPTIONS.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Field label={label} caps>
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
              onClick={() => onChange?.(name)}
              className={`flex aspect-square cursor-pointer items-center justify-center rounded-lg border transition-colors ${
                value === name ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#e2e8f0] bg-white text-[#334155] hover:border-[#2563eb]"
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
    </Field>
  );
}

/** Input tag: ketik lalu Enter; setiap tag punya ikon yang bisa dipilih. */
export default function TagIconInput({ label, hint, items, onChange, placeholder = "Ketik lalu tekan Enter..." }) {
  const [draft, setDraft] = useState("");
  const [activeIndex, setActiveIndex] = useState(items.length ? 0 : -1);

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    onChange([...items, { title, icon: "Sparkles" }]);
    setActiveIndex(items.length);
    setDraft("");
  };

  return (
    <div className="space-y-4">
      <Field label={label} hint={hint}>
        <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-[10px] border border-[#e2e8f0] bg-white p-2">
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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                add();
              }
            }}
            placeholder={placeholder}
            aria-label={label}
            className="min-w-[200px] flex-1 border-0 bg-transparent px-2 text-[15px] outline-none placeholder:text-[#94a3b8]"
          />
        </div>
      </Field>
      {activeIndex >= 0 && items[activeIndex] ? (
        <IconPicker
          label={`Ikon untuk "${items[activeIndex].title}"`}
          value={items[activeIndex].icon}
          onChange={(icon) => onChange(items.map((item, i) => (i === activeIndex ? { ...item, icon } : item)))}
        />
      ) : null}
    </div>
  );
}
