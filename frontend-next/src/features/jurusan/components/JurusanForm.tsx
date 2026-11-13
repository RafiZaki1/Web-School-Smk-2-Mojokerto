"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LoadErrorNotice from "@/shared/components/admin/LoadErrorNotice";
import { FormGalleryUpload } from "@/shared/components/form/FormGalleryUpload";
import { FormImageUpload } from "@/shared/components/form/FormImageUpload";
import { FormSelect } from "@/shared/components/form/FormSelect";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { StepForm, type FormStep } from "@/shared/components/form/StepForm";
import { loadErrorMessage } from "@/features/admin";
import { useJurusanRecord, useSaveJurusan } from "../hooks/useJurusanAdmin";
import { JURUSAN_FORM_EMPTY, toJurusanFormValues, toJurusanPayload } from "../services/jurusan-form.service";
import { jurusanSchema, type JurusanFormValues } from "../validation/jurusan.schema";
import { AccentPicker, GaleriFasilitasStep, KompetensiKarirStep } from "./JurusanFormSections";

interface JurusanFormProps {
  id?: string;
}

export function JurusanForm({ id }: JurusanFormProps) {
  const record = useJurusanRecord(id);
  const save = useSaveJurusan(id);
  const values = useMemo(() => (record.data ? toJurusanFormValues(record.data) : undefined), [record.data]);

  const form = useForm<JurusanFormValues>({
    resolver: zodResolver(jurusanSchema),
    defaultValues: JURUSAN_FORM_EMPTY,
    values,
  });

  if (record.isError) return <LoadErrorNotice message={loadErrorMessage(record.error)} backHref="/admin/jurusan" />;

  const steps: FormStep<JurusanFormValues>[] = [
    {
      label: "Info Dasar",
      title: "Info dasar",
      description: "Data utama jurusan yang tampil di card dan halaman detail.",
      fields: ["foto", "code", "status", "name", "tagline", "akreditasi", "shortDesc", "longDesc", "accent"],
      content: (
        <>
          <FormImageUpload
            control={form.control}
            name="foto"
            label="Foto/ilustrasi jurusan (untuk card & hero)"
            title="Klik untuk unggah foto"
            hint="atau seret dan lepas file di sini (JPG, PNG max 5MB)"
            previewClassName="aspect-[3/4] w-full max-w-[280px]"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormText
              control={form.control}
              name="code"
              label="Kode jurusan"
              placeholder="Contoh: TB"
              transform={(value) => value.toUpperCase()}
            />
            <FormSelect control={form.control} name="status" label="Status" placeholder="Pilih status" options={["Aktif", "Draf"]} />
          </div>
          <FormText control={form.control} name="name" label="Nama jurusan" placeholder="Contoh: Tata Boga" />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormText control={form.control} name="tagline" label="Bidang / tagline" placeholder="Contoh: Pariwisata & Hospitaliti" />
            <FormText control={form.control} name="akreditasi" label="Akreditasi" placeholder="Contoh: A (Unggul)" />
          </div>
          <FormTextarea
            control={form.control}
            name="shortDesc"
            label="Deskripsi singkat (tampil di card landing page)"
            placeholder="1-2 kalimat ringkas tentang jurusan ini..."
            rows={3}
          />
          <FormTextarea
            control={form.control}
            name="longDesc"
            label='Deskripsi lengkap (tampil di halaman detail — "Apa yang dipelajari?")'
            placeholder="Jelaskan lebih detail materi, praktik, dan kerja sama industri jurusan ini..."
            rows={5}
          />
          <AccentPicker control={form.control} />
        </>
      ),
    },
    {
      label: "Kompetensi & Karier",
      title: "Kompetensi & karier",
      description: "Kompetensi tampil sebagai tag, prospek karier tampil sebagai kartu profesi di halaman detail.",
      fields: ["kompetensi", "karir"],
      content: <KompetensiKarirStep form={form} />,
    },
    {
      label: "Mitra Industri",
      title: "Logo mitra industri",
      description: "Unggah logo perusahaan/instansi yang bekerja sama dengan jurusan ini. Logo akan tampil sebagai galeri di halaman detail.",
      fields: ["mitra"],
      content: (
        <>
          <FormGalleryUpload control={form.control} name="mitra" label="Logo mitra" />
          <p className="field__hint">Format SVG, PNG, atau JPG. Ukuran maksimal 2MB per logo. Rekomendasi rasio 1:1 dengan latar transparan.</p>
        </>
      ),
    },
    {
      label: "Galeri Fasilitas",
      title: "Galeri fasilitas belajar",
      description: "Buat beberapa grup fasilitas. Tiap grup punya judul sendiri dan kumpulan fotonya, akan tampil sebagai galeri di halaman detail.",
      fields: ["fasilitasLabel", "grupFasilitas"],
      content: <GaleriFasilitasStep control={form.control} />,
    },
  ];

  return (
    <StepForm
      form={form}
      title={id ? "Ubah Jurusan" : "Tambah Jurusan Baru"}
      savedLabel="Jurusan"
      subtitle="Lengkapi seluruh data untuk card & halaman detail jurusan"
      steps={steps}
      backHref="/admin/jurusan"
      draftLabel="Simpan sebagai draf"
      saveLabel="Simpan Jurusan"
      loading={Boolean(id) && record.isPending}
      onSubmit={(formValues, { draft }) => save.mutateAsync(toJurusanPayload(formValues, draft))}
    />
  );
}
