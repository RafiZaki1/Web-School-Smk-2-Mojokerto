"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LoadErrorNotice from "@/shared/components/admin/LoadErrorNotice";
import { FormChoiceChips } from "@/shared/components/form/FormChoiceChips";
import { FormGalleryUpload } from "@/shared/components/form/FormGalleryUpload";
import { FormImageUpload } from "@/shared/components/form/FormImageUpload";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { StepForm, type FormStep } from "@/shared/components/form/StepForm";
import { loadErrorMessage } from "@/features/admin";
import { useBeritaRecord, useSaveBerita } from "../hooks/useBeritaAdmin";
import { BERITA_KATEGORI } from "../constants/berita-data";
import { BERITA_FORM_EMPTY, toBeritaFormValues, toBeritaPayload } from "../services/berita-form.service";
import { beritaSchema, type BeritaFormValues } from "../validation/berita.schema";

interface BeritaFormProps {
  id?: string;
}

export function BeritaForm({ id }: BeritaFormProps) {
  const record = useBeritaRecord(id);
  const save = useSaveBerita(id);
  const values = useMemo(() => (record.data ? toBeritaFormValues(record.data) : undefined), [record.data]);

  const form = useForm<BeritaFormValues>({
    resolver: zodResolver(beritaSchema),
    defaultValues: BERITA_FORM_EMPTY,
    values,
  });

  if (record.isError) return <LoadErrorNotice message={loadErrorMessage(record.error)} backHref="/admin/berita" />;

  const steps: FormStep<BeritaFormValues>[] = [
    {
      label: "Info Dasar",
      title: "Info dasar",
      description: "Judul, kategori, penulis, dan foto sampul yang tampil di daftar dan bagian atas halaman berita.",
      fields: ["judul", "kategori", "penulis", "tanggal", "sampul"],
      content: (
        <>
          <FormText control={form.control} name="judul" label="Judul berita" placeholder="Tulis judul berita..." />
          <FormChoiceChips control={form.control} name="kategori" label="Kategori" options={BERITA_KATEGORI} />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormText control={form.control} name="penulis" label="Penulis" />
            <FormText
              control={form.control}
              name="tanggal"
              type="date"
              label="Tanggal publish"
              hint="Kosongkan untuk memakai tanggal hari ini"
            />
          </div>
          <FormImageUpload
            control={form.control}
            name="sampul"
            label="Foto sampul"
            title="Unggah foto sampul"
            hint="Landscape, disarankan 1200×720px, maks 5MB"
          />
        </>
      ),
    },
    {
      label: "Konten & Galeri",
      title: "Konten & galeri",
      description: "Isi lengkap berita dan foto-foto tambahan yang tampil di bagian bawah artikel. Pisahkan paragraf dengan baris kosong.",
      fields: ["isi", "galeri"],
      content: (
        <>
          <FormTextarea control={form.control} name="isi" label="Isi berita" rows={10} placeholder="Tulis isi berita lengkap..." />
          <FormGalleryUpload control={form.control} name="galeri" label="Galeri foto tambahan" />
        </>
      ),
    },
  ];

  return (
    <StepForm
      form={form}
      title={id ? "Ubah Berita" : "Tambah Berita"}
      subtitle="Lengkapi data untuk halaman detail berita/artikel"
      steps={steps}
      backHref="/admin/berita"
      draftLabel="Simpan sebagai draf"
      saveLabel="Simpan & Publish"
      loading={Boolean(id) && record.isPending}
      onSubmit={(formValues, { draft }) => save.mutateAsync(toBeritaPayload(formValues, draft))}
    />
  );
}
