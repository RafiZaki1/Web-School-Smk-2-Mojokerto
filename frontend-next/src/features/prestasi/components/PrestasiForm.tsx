"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LoadErrorNotice from "@/shared/components/admin/LoadErrorNotice";
import { FormChoiceChips } from "@/shared/components/form/FormChoiceChips";
import { FormGalleryUpload } from "@/shared/components/form/FormGalleryUpload";
import { FormImageUpload } from "@/shared/components/form/FormImageUpload";
import { FormSelect } from "@/shared/components/form/FormSelect";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { StepForm, type FormStep } from "@/shared/components/form/StepForm";
import { loadErrorMessage } from "@/features/admin";
import { usePrestasiRecord, useSavePrestasi } from "../hooks/usePrestasiAdmin";
import { KATEGORI, PRESTASI_FORM_EMPTY, PREDIKAT, TINGKAT, toPrestasiFormValues, toPrestasiPayload } from "../services/prestasi-form.service";
import { prestasiSchema, type PrestasiFormValues } from "../validation/prestasi.schema";

interface PrestasiFormProps {
  id?: string;
}

export function PrestasiForm({ id }: PrestasiFormProps) {
  const record = usePrestasiRecord(id);
  const save = useSavePrestasi(id);
  const values = useMemo(() => (record.data ? toPrestasiFormValues(record.data) : undefined), [record.data]);

  const form = useForm<PrestasiFormValues>({
    resolver: zodResolver(prestasiSchema),
    defaultValues: PRESTASI_FORM_EMPTY,
    values,
  });

  if (record.isError) return <LoadErrorNotice message={loadErrorMessage(record.error)} backHref="/admin/prestasi" />;

  const steps: FormStep<PrestasiFormValues>[] = [
    {
      label: "Info Dasar",
      title: "Info dasar prestasi",
      description: "Judul, predikat, dan profil siswa yang tampil di bagian atas (hero) halaman detail.",
      fields: ["judul", "predikat", "tingkat", "kategori", "siswa", "kelas", "fotoProfil", "sampul"],
      content: (
        <>
          <FormText control={form.control} name="judul" label="Judul prestasi" placeholder="Contoh: Duta Koperasi Provinsi" />
          <div className="grid gap-5 lg:grid-cols-2">
            <FormChoiceChips control={form.control} name="predikat" label="Predikat" options={PREDIKAT} />
            <FormSelect control={form.control} name="tingkat" label="Tingkat" options={TINGKAT} />
          </div>
          <FormChoiceChips control={form.control} name="kategori" label="Kategori" options={KATEGORI} />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormText control={form.control} name="siswa" label="Nama siswa" placeholder="Contoh: Carla Nur Parawansa" />
            <FormText control={form.control} name="kelas" label="Kelas" placeholder="Contoh: XII LPS 2" />
          </div>
          <FormImageUpload
            control={form.control}
            name="fotoProfil"
            variant="inline"
            label="Foto profil siswa"
            title="Unggah foto profil"
            hint="Foto bulat kecil di sebelah nama siswa"
          />
          <FormImageUpload control={form.control} name="sampul" label="Foto sampul (hero)" title="Unggah foto sampul" hint="Landscape, disarankan 1600×700px, maks 5MB" />
        </>
      ),
    },
    {
      label: "Detail Acara",
      title: "Detail acara",
      description: "Informasi ini tampil sebagai kartu-kartu kecil di sisi kanan hero halaman detail.",
      fields: ["mulai", "selesai", "lokasi", "penyelenggara"],
      content: (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormText control={form.control} name="mulai" type="date" label="Tanggal mulai" />
            <FormText control={form.control} name="selesai" type="date" label="Tanggal selesai" />
          </div>
          <FormText control={form.control} name="lokasi" label="Lokasi" placeholder="Contoh: Gedung Negara Grahadi, Surabaya" />
          <FormText control={form.control} name="penyelenggara" label="Penyelenggara" placeholder="Contoh: Dinas Koperasi dan UKM Prov. Jatim" />
        </>
      ),
    },
    {
      label: "Konten & Testimoni",
      title: "Konten & testimoni",
      description: "Ringkasan, deskripsi lengkap, dokumen resmi, dan kutipan testimoni yang tampil di bagian isi halaman detail.",
      fields: ["ringkasan", "deskripsi", "dokumen", "testimoni", "testiNama", "testiJabatan"],
      content: (
        <>
          <FormTextarea control={form.control} name="ringkasan" label="Ringkasan singkat (highlight)" rows={3} placeholder="Satu-dua kalimat inti tentang prestasi ini..." />
          <FormTextarea
            control={form.control}
            name="deskripsi"
            label="Deskripsi lengkap"
            hint="Pisahkan paragraf dengan baris kosong."
            rows={6}
            placeholder="Ceritakan proses dan makna prestasi ini..."
          />
          <FormImageUpload
            control={form.control}
            name="dokumen"
            label="Dokumen resmi (opsional)"
            title="Unggah dokumen/sertifikat"
            hint="PDF/JPG/PNG, maks 5MB"
            accept="application/pdf,image/*"
          />
          <div className="space-y-4 rounded-[14px] border border-[#e2e8f0] bg-[#f8fafc] p-5">
            <FormTextarea control={form.control} name="testimoni" label="Testimoni" rows={3} placeholder="Kutipan dari kepala sekolah atau pembina..." />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormText control={form.control} name="testiNama" placeholder="Nama, mis: Bapak Iswahyudi, S.ST." />
              <FormText control={form.control} name="testiJabatan" placeholder="Jabatan, mis: Kepala SMKN 2 Kota Mojokerto" />
            </div>
          </div>
        </>
      ),
    },
    {
      label: "Galeri Momen",
      title: "Galeri momen",
      description: "Kumpulan foto dokumentasi yang tampil di bagian bawah halaman detail.",
      fields: ["galeriJudul", "galeriDesc", "galeri"],
      content: (
        <>
          <FormText control={form.control} name="galeriJudul" label="Judul galeri" />
          <FormTextarea control={form.control} name="galeriDesc" label="Deskripsi singkat" rows={2} placeholder="Kumpulan dokumentasi selama proses seleksi..." />
          <FormGalleryUpload control={form.control} name="galeri" label="Foto-foto" />
        </>
      ),
    },
  ];

  return (
    <StepForm
      form={form}
      title={id ? "Ubah Prestasi" : "Tambah Prestasi"}
      subtitle="Lengkapi data untuk halaman detail prestasi"
      steps={steps}
      backHref="/admin/prestasi"
      draftLabel="Simpan sebagai draf"
      saveLabel="Simpan Prestasi"
      loading={Boolean(id) && record.isPending}
      onSubmit={(formValues, { draft }) => save.mutateAsync(toPrestasiPayload(formValues, draft))}
    />
  );
}
