"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LoadErrorNotice from "@/shared/components/admin/LoadErrorNotice";
import { FormChoiceChips } from "@/shared/components/form/FormChoiceChips";
import { FormImageUpload } from "@/shared/components/form/FormImageUpload";
import { FormListEditor } from "@/shared/components/form/FormListEditor";
import { FormSelect } from "@/shared/components/form/FormSelect";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { StepForm, type FormStep } from "@/shared/components/form/StepForm";
import { loadErrorMessage } from "@/features/admin";
import { useLokerRecord, useSaveLoker } from "../hooks/useLokerAdmin";
import { BKK_KATEGORI } from "../constants/bkk-data";
import { LOKER_FORM_EMPTY, LOKER_STATUS, LOKER_TIPE, toLokerFormValues, toLokerPayload } from "../services/loker-form.service";
import { lokerSchema, type LokerFormValues } from "../validation/loker.schema";

interface LokerFormProps {
  id?: string;
}

export function LokerForm({ id }: LokerFormProps) {
  const record = useLokerRecord(id);
  const save = useSaveLoker(id);
  const values = useMemo(() => (record.data ? toLokerFormValues(record.data) : undefined), [record.data]);

  const form = useForm<LokerFormValues>({
    resolver: zodResolver(lokerSchema),
    defaultValues: LOKER_FORM_EMPTY,
    values,
  });

  if (record.isError) return <LoadErrorNotice message={loadErrorMessage(record.error)} backHref="/admin/bkk" />;

  const steps: FormStep<LokerFormValues>[] = [
    {
      label: "Info Dasar",
      title: "Info dasar",
      description: "Poster, judul posisi, perusahaan, dan info ringkas yang tampil di kartu lowongan.",
      fields: ["poster", "judul", "perusahaan", "lokasi", "kategori", "tipe", "tutup", "status"],
      content: (
        <>
          <FormImageUpload
            control={form.control}
            name="poster"
            label="Poster lowongan"
            title="Unggah poster lowongan"
            hint="Potret/landscape, disarankan 800x600px, maks 5MB"
            previewClassName="aspect-[4/3] w-full max-w-[420px]"
          />
          <FormText control={form.control} name="judul" label="Judul posisi" placeholder="Contoh: Staff IT Support" />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormText control={form.control} name="perusahaan" label="Nama perusahaan" placeholder="Contoh: PT Kita Lewati Berdua" />
            <FormText control={form.control} name="lokasi" label="Lokasi" placeholder="Contoh: Mojokerto" />
          </div>
          <FormChoiceChips control={form.control} name="kategori" label="Kategori bidang" options={BKK_KATEGORI} />
          <div className="grid gap-5 sm:grid-cols-3">
            <FormSelect control={form.control} name="tipe" label="Tipe kerja" options={LOKER_TIPE} />
            <FormText control={form.control} name="tutup" type="date" label="Tanggal tutup" />
            <FormSelect control={form.control} name="status" label="Status" options={LOKER_STATUS} />
          </div>
        </>
      ),
    },
    {
      label: "Detail Pekerjaan",
      title: "Detail pekerjaan",
      description: "Deskripsi, tanggung jawab, dan kualifikasi yang tampil di halaman detail lowongan.",
      fields: ["deskripsi", "tanggungJawab", "kualifikasi", "kontak", "email"],
      content: (
        <>
          <FormTextarea control={form.control} name="deskripsi" label="Deskripsi pekerjaan" rows={5} placeholder="Gambaran singkat posisi ini..." />
          <FormListEditor control={form.control} name="tanggungJawab" label="Tanggung jawab" />
          <FormListEditor control={form.control} name="kualifikasi" label="Kualifikasi" />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormText control={form.control} name="kontak" label="Kontak pelamar (telepon/WA)" placeholder="0857-3050-2173" />
            <FormText control={form.control} name="email" type="email" label="Email pelamar" placeholder="bkk.smkn2mr@gmail.com" />
          </div>
        </>
      ),
    },
  ];

  return (
    <StepForm
      form={form}
      title={id ? "Ubah Lowongan" : "Tambah Lowongan"}
      subtitle="Lengkapi data untuk kartu dan halaman detail lowongan di BKK"
      steps={steps}
      backHref="/admin/bkk"
      saveLabel="Simpan Lowongan"
      loading={Boolean(id) && record.isPending}
      onSubmit={(formValues) => save.mutateAsync(toLokerPayload(formValues))}
    />
  );
}
