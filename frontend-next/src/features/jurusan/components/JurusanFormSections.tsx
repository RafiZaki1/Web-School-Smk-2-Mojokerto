"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useWatch, type Control, type UseFormReturn } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import Modal from "@/shared/components/admin/Modal";
import { FormField } from "@/shared/components/form/FormField";
import { FormGalleryUpload } from "@/shared/components/form/FormGalleryUpload";
import { FormTagIcon } from "@/shared/components/form/FormTagIcon";
import { FormText } from "@/shared/components/form/FormText";
import { IconPicker } from "@/shared/components/form/IconPicker";
import JurusanIcon from "@/shared/components/ui/JurusanIcon";
import type { JurusanFormValues } from "../validation/jurusan.schema";

const ACCENTS = [
  { label: "Hijau", value: "#22c55e" },
  { label: "Biru", value: "#2563eb" },
  { label: "Merah", value: "#ef4444" },
  { label: "Kuning", value: "#eab308" },
];

const EMPTY_PROSPEK = { title: "", desc: "", icon: "BriefcaseBusiness" };

export interface Prospek {
  title: string;
  desc: string;
  icon: string;
}

export function AccentPicker({ control }: { control: Control<JurusanFormValues> }) {
  return (
    <Controller
      control={control}
      name="accent"
      render={({ field }) => (
        <FormField label="Warna aksen jurusan" hint="Menentukan warna badge, tombol, dan ikon di halaman detail jurusan ini.">
          <div className="flex flex-wrap items-center gap-3" role="radiogroup" aria-label="Warna aksen jurusan">
            {ACCENTS.map((accent) => (
              <button
                key={accent.value}
                type="button"
                role="radio"
                aria-checked={field.value === accent.value}
                aria-label={accent.label}
                onClick={() => field.onChange(accent.value)}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white ring-offset-2 aria-checked:ring-2 aria-checked:ring-[#0f172a]"
                style={{ backgroundColor: accent.value }}
              >
                {field.value === accent.value ? <Check size={18} aria-hidden="true" /> : null}
              </button>
            ))}
            <label className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-[#cbd5e1] text-[#64748b]" title="Warna kustom">
              <Plus size={18} aria-hidden="true" />
              <input
                type="color"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(event) => field.onChange(event.target.value)}
                aria-label="Warna kustom"
              />
            </label>
          </div>
        </FormField>
      )}
    />
  );
}

export function KompetensiKarirStep({ form }: { form: UseFormReturn<JurusanFormValues> }) {
  const karir = useWatch({ control: form.control, name: "karir" }) ?? [];
  const [prospek, setProspek] = useState<{ index: number; value: Prospek } | null>(null);

  const saveProspek = () => {
    if (!prospek || !prospek.value.title.trim()) return;
    const list = [...form.getValues("karir")];
    if (prospek.index === -1) list.push(prospek.value);
    else list[prospek.index] = prospek.value;
    form.setValue("karir", list, { shouldDirty: true });
    setProspek(null);
  };

  const removeKarir = (index: number) => {
    form.setValue(
      "karir",
      form.getValues("karir").filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  return (
    <>
      <div>
        <h2 className="stepform__section-title">Kompetensi utama</h2>
        <p className="stepform__section-desc">Tambahkan poin skill lengkap dengan ikon, akan tampil sebagai tag di halaman detail.</p>
      </div>
      <FormTagIcon control={form.control} name="kompetensi" label="Kompetensi" placeholder="Ketik nama kompetensi lalu tekan Enter..." />

      <div>
        <h2 className="stepform__section-title">Prospek karier</h2>
        <p className="stepform__section-desc">Tiap item jadi satu kartu profesi di halaman detail.</p>
      </div>
      <ul className="space-y-3">
        {karir.map((item, index) => (
          <li key={`${item.title}-${index}`} className="flex items-start gap-4 rounded-[14px] border border-[#e2e8f0] p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#b7f568] text-[#416900]">
              <JurusanIcon name={item.icon} size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-semibold text-[#0f172a]">{item.title}</span>
              <span className="block text-[14px] text-[#475569]">{item.desc}</span>
            </span>
            <button type="button" className="adm-icon-btn" onClick={() => setProspek({ index, value: item })} aria-label={`Ubah ${item.title}`}>
              <Pencil size={18} aria-hidden="true" />
            </button>
            <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => removeKarir(index)} aria-label={`Hapus ${item.title}`}>
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <AdminButton variant="ghost" icon={Plus} className="w-full border-dashed" onClick={() => setProspek({ index: -1, value: EMPTY_PROSPEK })}>
        Tambah prospek karier
      </AdminButton>

      <Modal
        open={Boolean(prospek)}
        onClose={() => setProspek(null)}
        title="Informasi Prospek Karier"
        maxWidth="max-w-[760px]"
        footer={
          <>
            <AdminButton variant="ghost" onClick={() => setProspek(null)}>
              Batal
            </AdminButton>
            <AdminButton onClick={saveProspek}>Simpan Prospek</AdminButton>
          </>
        }
      >
        {prospek ? (
          <>
            <FormField label="Nama prospek karier" caps>
              <input
                className="inputtext__field"
                placeholder="Contoh: Staf Operasional Bank Syariah"
                value={prospek.value.title}
                onChange={(e) => setProspek({ ...prospek, value: { ...prospek.value, title: e.target.value } })}
              />
            </FormField>
            <FormField label="Deskripsi singkat" caps>
              <textarea
                rows={3}
                className="inputlongtext__field"
                placeholder="Jelaskan peran dan tanggung jawab utama..."
                value={prospek.value.desc}
                onChange={(e) => setProspek({ ...prospek, value: { ...prospek.value, desc: e.target.value } })}
              />
            </FormField>
            <IconPicker
              label="Pilih ikon representatif"
              value={prospek.value.icon}
              onChange={(icon) => setProspek({ ...prospek, value: { ...prospek.value, icon } })}
            />
          </>
        ) : null}
      </Modal>
    </>
  );
}

export function GaleriFasilitasStep({ control }: { control: Control<JurusanFormValues> }) {
  const grupFasilitas = useFieldArray({ control, name: "grupFasilitas" });
  const label = useWatch({ control, name: "fasilitasLabel" });

  return (
    <>
      <div className="rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] p-5">
        <FormText control={control} name="fasilitasLabel" caps label="Label section (tampil sekali di atas galeri)" />
        <p className="mt-4 text-[13px] text-[#64748b]">Pratinjau di halaman detail:</p>
        <p className="mt-1 text-[13px] font-bold tracking-[0.1em] text-[#416900] uppercase">{label || "Fasilitas Belajar"}</p>
      </div>
      {grupFasilitas.fields.map((grup, index) => (
        <div key={grup.id} className="space-y-4 rounded-[14px] border border-[#e2e8f0] p-5">
          <div className="flex items-end gap-2">
            <FormText
              control={control}
              name={`grupFasilitas.${index}.judul`}
              caps
              className="flex-1"
              label="Judul grup"
              placeholder="Contoh: Kunjungan industri & studi lapangan"
            />
            {grupFasilitas.fields.length > 1 ? (
              <button
                type="button"
                className="adm-icon-btn adm-icon-btn--danger mb-1.5"
                onClick={() => grupFasilitas.remove(index)}
                aria-label={`Hapus grup ${index + 1}`}
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <FormGalleryUpload control={control} name={`grupFasilitas.${index}.foto`} label="Foto" />
        </div>
      ))}
      <AdminButton variant="ghost" icon={Plus} className="w-full border-dashed" onClick={() => grupFasilitas.append({ judul: "", foto: [] })}>
        Tambah Grup Fasilitas
      </AdminButton>
    </>
  );
}

