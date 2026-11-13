"use client";

import Image from "next/image";
import { useEffect, useMemo, type ChangeEvent } from "react";
import { FileText, ImagePlus, Plus, X } from "lucide-react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { FormField } from "./FormField";

export type UploadValue = File | string | null;

/** URL pratinjau untuk File (dibebaskan saat berganti) atau string apa adanya. */
export function useObjectUrl(value: UploadValue | undefined): string | null {
  const url = useMemo(() => {
    if (!value) return null;
    return typeof value === "string" ? value : URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    if (!value || typeof value === "string" || !url) return undefined;
    return () => URL.revokeObjectURL(url);
  }, [url, value]);

  return url;
}

interface FormImageUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  title?: string;
  hint?: string;
  accept?: string;
  variant?: "box" | "inline";
  previewClassName?: string;
}

// Unggah satu berkas: kotak putus-putus, pratinjau gambar, dan tombol hapus.
// variant "inline" = baris kecil (foto profil).
export function FormImageUpload<T extends FieldValues>({
  control,
  name,
  label,
  title = "Klik untuk unggah foto",
  hint,
  accept = "image/*",
  variant = "box",
  previewClassName = "aspect-[16/7] w-full",
}: FormImageUploadProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message}>
          <SingleUploadBody
            value={field.value as UploadValue}
            onChange={field.onChange}
            title={title}
            hint={hint}
            accept={accept}
            variant={variant}
            previewClassName={previewClassName}
          />
        </FormField>
      )}
    />
  );
}

interface SingleUploadBodyProps {
  value: UploadValue;
  onChange: (value: UploadValue) => void;
  title: string;
  hint?: string;
  accept: string;
  variant: "box" | "inline";
  previewClassName: string;
}

function SingleUploadBody({ value, onChange, title, hint, accept, variant, previewClassName }: SingleUploadBodyProps) {
  const { t } = useTranslation();
  const preview = useObjectUrl(value);

  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onChange(file);
    event.target.value = "";
  };

  if (preview && value) {
    const isImage = typeof value === "string" ? !/\.pdf($|\?)/i.test(value) : value.type.startsWith("image/");
    const fileName = typeof value === "string" ? decodeURIComponent(value.split("/").pop() ?? "") : value.name;

    return (
      <div className={`unggah-preview ${variant === "inline" ? "h-20 w-20 rounded-full" : previewClassName}`}>
        {isImage ? (
          <Image src={preview} alt={t("Pratinjau unggahan")} fill sizes="(min-width: 640px) 320px, 100vw" className="object-cover" />
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
        <button type="button" className="unggah-preview__remove" onClick={() => onChange(null)} aria-label={t("Hapus berkas")}>
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <label className="flex cursor-pointer items-center gap-4 rounded-[14px] border border-[#e2e8f0] bg-card p-4 hover:border-[#2563eb]">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
          <Plus size={22} aria-hidden="true" />
        </span>
        <span>
          <span className="block text-[15px] font-semibold text-[#0f172a]">{title}</span>
          {hint ? <span className="block text-[13px] text-[#64748b]">{hint}</span> : null}
        </span>
        <input type="file" accept={accept} className="sr-only" onChange={pick} />
      </label>
    );
  }

  return (
    <label className="unggah">
      <span className="unggah__icon">
        <ImagePlus size={24} aria-hidden="true" />
      </span>
      <span className="unggah__title">{t(title)}</span>
      {hint ? <span className="unggah__hint">{t(hint)}</span> : null}
      <input type="file" accept={accept} className="sr-only" onChange={pick} />
    </label>
  );
}
