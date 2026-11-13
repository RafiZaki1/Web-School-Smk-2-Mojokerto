"use client";

import Image from "next/image";
import type { ChangeEvent } from "react";
import { Plus, X } from "lucide-react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { FormField } from "./FormField";
import { useObjectUrl, type UploadValue } from "./FormImageUpload";

interface FormGalleryUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  max?: number;
}

// Kumpulan foto (galeri) dengan kotak "Tambah foto".
export function FormGalleryUpload<T extends FieldValues>({ control, name, label, max = 12 }: FormGalleryUploadProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const files = (field.value ?? []) as UploadValue[];

        const add = (event: ChangeEvent<HTMLInputElement>) => {
          const picked = Array.from(event.target.files ?? []);
          field.onChange([...files, ...picked].slice(0, max));
          event.target.value = "";
        };

        return (
          <FormField label={label} error={fieldState.error?.message}>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {files.map((file, index) => (
                <GaleriItem key={`${typeof file === "string" ? file : (file?.name ?? "")}-${index}`} file={file} index={index} onRemove={() => field.onChange(files.filter((_, i) => i !== index))} />
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
          </FormField>
        );
      }}
    />
  );
}

function GaleriItem({ file, index, onRemove }: { file: UploadValue; index: number; onRemove: () => void }) {
  const url = useObjectUrl(file);

  return (
    <li className="unggah-preview aspect-[4/3]">
      {url ? <Image src={url} alt={`Foto ${index + 1}`} fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" /> : null}
      <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white">Foto {index + 1}</span>
      <button type="button" className="unggah-preview__remove" onClick={onRemove} aria-label={`Hapus foto ${index + 1}`}>
        <X size={16} aria-hidden="true" />
      </button>
    </li>
  );
}
