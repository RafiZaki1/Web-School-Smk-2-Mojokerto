"use client";

import { useEffect, useMemo } from "react";
import { FileText, ImagePlus, Plus, X } from "lucide-react";
import { Field } from "./Fields";

/** URL pratinjau untuk File (dibebaskan saat berganti) atau string apa adanya. */
function useObjectUrl(value) {
  const url = useMemo(() => (value && typeof value !== "string" ? URL.createObjectURL(value) : value || null), [value]);
  useEffect(() => {
    if (!value || typeof value === "string") return undefined;
    return () => URL.revokeObjectURL(url);
  }, [url, value]);
  return url;
}

/**
 * Unggah satu berkas dari dealtech-ui (UnggahGambar): kotak putus-putus,
 * pratinjau gambar, dan tombol hapus. variant "inline" = baris kecil (foto profil).
 */
export default function UnggahGambar({
  label,
  title = "Klik untuk unggah foto",
  hint,
  accept = "image/*",
  value,
  onChange,
  variant = "box",
  previewClassName = "aspect-[16/7] w-full",
}) {
  const preview = useObjectUrl(value);

  const pick = (event) => {
    const file = event.target.files?.[0];
    if (file) onChange?.(file);
    event.target.value = "";
  };

  const isImage = !value || (typeof value === "string" ? !/\.pdf($|\?)/i.test(value) : value.type?.startsWith("image/"));
  const fileName = typeof value === "string" ? decodeURIComponent(value.split("/").pop() ?? "") : value?.name;

  if (preview) {
    return (
      <Field label={label}>
        <div className={`unggah-preview ${variant === "inline" ? "h-20 w-20 rounded-full" : previewClassName}`}>
          {isImage ? (
            <img src={preview} alt="Pratinjau unggahan" />
          ) : (
            <span className="flex h-full min-h-[120px] items-center justify-center gap-2 text-[15px] text-[#334155]">
              <FileText size={20} aria-hidden="true" />
              {typeof value === "string" ? (
                <a href={value} target="_blank" rel="noreferrer" className="underline">
                  {fileName}
                </a>
              ) : (
                fileName
              )}
            </span>
          )}
          <button type="button" className="unggah-preview__remove" onClick={() => onChange?.(null)} aria-label="Hapus berkas">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </Field>
    );
  }

  if (variant === "inline") {
    return (
      <Field label={label}>
        <label className="flex cursor-pointer items-center gap-4 rounded-[14px] border border-[#e2e8f0] bg-white p-4 hover:border-[#2563eb]">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
            <Plus size={22} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[15px] font-semibold text-[#0f172a]">{title}</span>
            {hint ? <span className="block text-[13px] text-[#64748b]">{hint}</span> : null}
          </span>
          <input type="file" accept={accept} className="sr-only" onChange={pick} />
        </label>
      </Field>
    );
  }

  return (
    <Field label={label}>
      <label className="unggah">
        <span className="unggah__icon">
          <ImagePlus size={24} aria-hidden="true" />
        </span>
        <span className="unggah__title">{title}</span>
        {hint ? <span className="unggah__hint">{hint}</span> : null}
        <input type="file" accept={accept} className="sr-only" onChange={pick} />
      </label>
    </Field>
  );
}

/** Kumpulan foto (galeri) dengan kotak "Tambah foto". */
export function GaleriUnggah({ label, files = [], onChange, max = 12 }) {
  const add = (event) => {
    const picked = Array.from(event.target.files ?? []);
    onChange?.([...files, ...picked].slice(0, max));
    event.target.value = "";
  };

  return (
    <Field label={label}>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {files.map((file, index) => (
          <GaleriItem key={`${file.name ?? file}-${index}`} file={file} index={index} onRemove={() => onChange?.(files.filter((_, i) => i !== index))} />
        ))}
        {files.length < max && (
          <li>
            <label className="unggah aspect-[4/3] min-h-0 p-3">
              <Plus size={22} aria-hidden="true" />
              <span className="unggah__title">Tambah foto</span>
              <input type="file" accept="image/*" multiple className="sr-only" onChange={add} />
            </label>
          </li>
        )}
      </ul>
    </Field>
  );
}

function GaleriItem({ file, index, onRemove }) {
  const url = useObjectUrl(file);

  return (
    <li className="unggah-preview aspect-[4/3]">
      {url ? <img src={url} alt={`Foto ${index + 1}`} /> : null}
      <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">Foto {index + 1}</span>
      <button type="button" className="unggah-preview__remove" onClick={onRemove} aria-label={`Hapus foto ${index + 1}`}>
        <X size={16} aria-hidden="true" />
      </button>
    </li>
  );
}
