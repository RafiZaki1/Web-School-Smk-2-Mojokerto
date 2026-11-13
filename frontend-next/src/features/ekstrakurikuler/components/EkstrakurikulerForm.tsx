"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import LoadErrorNotice from "@/shared/components/admin/LoadErrorNotice";
import { FormGalleryUpload } from "@/shared/components/form/FormGalleryUpload";
import { FormImageUpload } from "@/shared/components/form/FormImageUpload";
import { FormListEditor } from "@/shared/components/form/FormListEditor";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { IconPicker } from "@/shared/components/form/IconPicker";
import { StepForm, type FormStep } from "@/shared/components/form/StepForm";
import { loadErrorMessage } from "@/features/admin";
import { useEkstrakurikulerRecord, useSaveEkstrakurikuler } from "../hooks/useEkstrakurikulerAdmin";
import { EKSTRAKURIKULER_FORM_EMPTY, toEkstrakurikulerFormValues, toEkstrakurikulerPayload } from "../services/ekstrakurikuler-form.service";
import { ekstrakurikulerSchema, type EkstrakurikulerFormValues } from "../validation/ekstrakurikuler.schema";

interface EkstrakurikulerFormProps {
  id?: string;
}

export function EkstrakurikulerForm({ id }: EkstrakurikulerFormProps) {
  const record = useEkstrakurikulerRecord(id);
  const save = useSaveEkstrakurikuler(id);
  const values = useMemo(() => (record.data ? toEkstrakurikulerFormValues(record.data) : undefined), [record.data]);

  const form = useForm<EkstrakurikulerFormValues>({
    resolver: zodResolver(ekstrakurikulerSchema),
    defaultValues: EKSTRAKURIKULER_FORM_EMPTY,
    values,
  });
  const ikon = useWatch({ control: form.control, name: "ikon" });

  const testimoni = useFieldArray({ control: form.control, name: "testimoni" });

  if (record.isError) return <LoadErrorNotice message={loadErrorMessage(record.error)} backHref="/admin/ekstrakurikuler" />;

  const steps: FormStep<EkstrakurikulerFormValues>[] = [
    {
      label: "Info Dasar",
      title: "Info dasar",
      description: "Nama, deskripsi singkat, dan info ringkas yang tampil di bagian hero halaman detail.",
      fields: ["ikon", "nama", "fokus", "deskripsi", "sampul", "jadwal", "lokasi", "anggota"],
      content: (
        <>
          <IconPicker
            label="Ikon ekstrakurikuler"
            value={ikon}
            onChange={(icon) => form.setValue("ikon", icon, { shouldDirty: true })}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormText control={form.control} name="nama" label="Nama ekstrakurikuler" placeholder="Contoh: Paskibra" />
            <FormText control={form.control} name="fokus" label="Fokus kegiatan" placeholder="Contoh: Disiplin & kepemimpinan" />
          </div>
          <FormTextarea control={form.control} name="deskripsi" label="Deskripsi singkat (hero)" rows={3} placeholder="Satu-dua kalimat tentang kegiatan ini..." />
          <FormImageUpload
            control={form.control}
            name="sampul"
            label="Foto sampul (hero)"
            title="Unggah foto sampul"
            hint="Landscape, disarankan 1600×700px, maks 5MB"
          />
          <div>
            <p className="field__label">Info ringkas (3 kartu di bawah hero)</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormText control={form.control} name="jadwal" placeholder="Selasa & Jumat" aria-label="Jadwal latihan" />
              <FormText control={form.control} name="lokasi" placeholder="Lapangan Upacara" />
              <FormText control={form.control} name="anggota" placeholder="45 Siswa" />
            </div>
            <p className="field__hint">Label: Jadwal latihan · Lokasi · Anggota aktif</p>
          </div>
        </>
      ),
    },
    {
      label: "Tentang",
      title: "Tentang",
      description: 'Judul dan deskripsi lengkap yang tampil di bagian "Tentang" halaman detail.',
      fields: ["tentangJudul", "tentang"],
      content: (
        <>
          <FormText
            control={form.control}
            name="tentangJudul"
            label="Judul section"
            placeholder="Contoh: Lebih dari sekadar baris-berbaris"
            hint='Label kecil di atasnya otomatis: "TENTANG [NAMA EKSTRAKURIKULER]"'
          />
          <FormTextarea control={form.control} name="tentang" label="Deskripsi lengkap" rows={6} placeholder="Ceritakan kegiatan dan manfaatnya bagi siswa..." />
        </>
      ),
    },
    {
      label: "Dokumentasi & Prestasi",
      title: "Dokumentasi & prestasi",
      description: "Foto momen latihan/event, dan daftar pencapaian anggota.",
      fields: ["galeriJudul", "galeri", "pencapaian"],
      content: (
        <>
          <FormText control={form.control} name="galeriJudul" label="Judul galeri" />
          <FormGalleryUpload control={form.control} name="galeri" label="Foto dokumentasi" />
          <FormListEditor
            control={form.control}
            name="pencapaian"
            label="Pencapaian anggota"
            placeholder="Contoh: Juara 1 Lomba Baris-Berbaris — 2024"
            addLabel="Tambah Pencapaian"
          />
        </>
      ),
    },
    {
      label: "Testimoni",
      title: "Testimoni",
      description: "Kutipan dari anggota yang tampil di bagian bawah halaman detail.",
      fields: ["testimoni"],
      content: (
        <>
          {testimoni.fields.map((item, index) => (
            <div key={item.id} className="space-y-4 rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] p-5">
              <div className="flex items-start gap-2">
                <FormTextarea
                  control={form.control}
                  name={`testimoni.${index}.kutipan` as const}
                  className="flex-1"
                  label={`Testimoni ${testimoni.fields.length > 1 ? index + 1 : ""}`.trim()}
                  rows={3}
                  placeholder="Masukkan testimoni anggota..."
                />
                {testimoni.fields.length > 1 ? (
                  <button type="button" className="adm-icon-btn adm-icon-btn--danger mt-8" onClick={() => testimoni.remove(index)} aria-label={`Hapus testimoni ${index + 1}`}>
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              <FormText
                control={form.control}
                name={`testimoni.${index}.nama` as const}
                placeholder="Nama anggota (opsional) — misal: Anggota Paskibra, kelas 11"
                hint="Boleh dikosongkan kalau testimoni ditampilkan anonim."
              />
            </div>
          ))}
          <AdminButton variant="ghost" icon={Plus} className="w-fit" onClick={() => testimoni.append({ kutipan: "", nama: "" })}>
            Tambah Testimoni Lainnya
          </AdminButton>
        </>
      ),
    },
  ];

  return (
    <StepForm
      form={form}
      title={id ? "Ubah Ekstrakurikuler" : "Tambah Ekstrakurikuler"}
      subtitle="Lengkapi data untuk halaman detail ekstrakurikuler"
      steps={steps}
      backHref="/admin/ekstrakurikuler"
      draftLabel="Simpan sebagai draf"
      saveLabel="Simpan Ekstrakurikuler"
      loading={Boolean(id) && record.isPending}
      onSubmit={(formValues, { draft }) => save.mutateAsync(toEkstrakurikulerPayload(formValues, draft))}
    />
  );
}
