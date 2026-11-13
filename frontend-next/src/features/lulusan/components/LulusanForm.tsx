"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import LoadErrorNotice from "@/shared/components/admin/LoadErrorNotice";
import { FormChoiceChips } from "@/shared/components/form/FormChoiceChips";
import { FormImageUpload } from "@/shared/components/form/FormImageUpload";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { StepForm, type FormStep } from "@/shared/components/form/StepForm";
import { loadErrorMessage } from "@/features/admin";
import { useLulusanRecord, useSaveLulusan } from "../hooks/useLulusanAdmin";
import { JURUSAN_LULUSAN, LULUSAN_FORM_EMPTY, RATING_OPTIONS, TAMPIL, toLulusanFormValues, toLulusanPayload } from "../services/lulusan-form.service";
import { lulusanSchema, type LulusanFormValues } from "../validation/lulusan.schema";

interface LulusanFormProps {
  id?: string;
}

export function LulusanForm({ id }: LulusanFormProps) {
  const record = useLulusanRecord(id);
  const save = useSaveLulusan(id);
  const values = useMemo(() => (record.data ? toLulusanFormValues(record.data) : undefined), [record.data]);

  const form = useForm<LulusanFormValues>({
    resolver: zodResolver(lulusanSchema),
    defaultValues: LULUSAN_FORM_EMPTY,
    values,
  });
  const testimoni = useWatch({ control: form.control, name: "testimoni" });

  if (record.isError) return <LoadErrorNotice message={loadErrorMessage(record.error)} backHref="/admin/lulusan" />;

  const steps: FormStep<LulusanFormValues>[] = [
    {
      label: "Profil",
      title: "Profil lulusan",
      description: "Data yang tampil di kartu lulusan terbaik dan direktori /lulusan.",
      fields: ["nama", "angkatan", "jurusan", "karier", "lokasi", "foto", "unggulan"],
      content: (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormText control={form.control} name="nama" label="Nama lengkap" placeholder="Nama sesuai ijazah" />
            <FormText control={form.control} name="angkatan" label="Tahun lulus" placeholder="Contoh: 2021" />
          </div>
          <FormChoiceChips control={form.control} name="jurusan" label="Jurusan" options={JURUSAN_LULUSAN} />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormText control={form.control} name="karier" label="Pekerjaan / studi saat ini" placeholder="Contoh: Welder, Hitachi Zosen" />
            <FormText control={form.control} name="lokasi" label="Lokasi kerja" placeholder="Contoh: Osaka, Jepang" />
          </div>
          <FormImageUpload control={form.control} name="foto" variant="inline" label="Foto" title="Unggah foto lulusan" hint="Potret, maks 2MB" />
          <FormChoiceChips control={form.control} name="unggulan" label="Tampilkan di 'Lulusan terbaik' beranda?" options={TAMPIL} />
        </>
      ),
    },
    {
      label: "Testimoni",
      title: "Testimoni alumni",
      description:
        "Isi dengan kata-kata asli dari alumni (mis. dari wawancara atau formulir). Kosongkan bila belum ada; section testimoni di beranda hanya menampilkan alumni yang mengisi.",
      fields: ["testimoni", "rating"],
      content: (
        <>
          <FormTextarea
            control={form.control}
            name="testimoni"
            label="Testimoni"
            hint={`${testimoni.length}/600 karakter. Pastikan alumni sudah setuju testimoninya dipublikasikan.`}
            rows={6}
            placeholder="Ceritakan pengalaman belajar di SMKN 2 dan bagaimana itu membantu karier sekarang..."
          />
          <FormChoiceChips control={form.control} name="rating" label="Rating bintang dari alumni" options={RATING_OPTIONS} />
        </>
      ),
    },
  ];

  return (
    <StepForm
      form={form}
      title={id ? "Ubah Lulusan" : "Tambah Lulusan"}
      subtitle="Profil lulusan dan testimoni alumni"
      steps={steps}
      backHref="/admin/lulusan"
      saveLabel="Simpan Lulusan"
      loading={Boolean(id) && record.isPending}
      onSubmit={(formValues) => save.mutateAsync(toLulusanPayload(formValues))}
    />
  );
}
