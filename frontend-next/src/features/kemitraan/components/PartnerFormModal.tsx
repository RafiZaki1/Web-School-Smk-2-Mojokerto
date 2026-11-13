"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import Modal from "@/shared/components/admin/Modal";
import { FormCheckbox, FormCheckboxGroup } from "@/shared/components/form/FormCheckbox";
import { FormImageUpload } from "@/shared/components/form/FormImageUpload";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { MAJORS } from "@/shared/constants/school-classes";
import { toast } from "@/shared/lib/toast";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import { useSaveIndustryPartner } from "../hooks/useKemitraanAdmin";
import { toPartnerFormValues, toPartnerPayload } from "../services/kemitraan-form.service";
import { partnerSchema, type PartnerFormValues } from "../validation/kemitraan.schema";
import type { IndustryPartner } from "../types/kemitraan.type";

const FORM_ID = "form-mitra";
const MAJOR_OPTIONS = MAJORS.map((major) => ({ value: major.code, label: major.code === "KULINER" ? "Kuliner" : major.code }));

/** Tambah atau ubah perusahaan mitra DU/DI beserta logo dan jurusan terkait. */
export function PartnerFormModal({ partner, onClose }: { partner: IndustryPartner | null; onClose: () => void }) {
  const save = useSaveIndustryPartner(partner?.id ?? null);
  const form = useForm<PartnerFormValues>({ resolver: zodResolver(partnerSchema), defaultValues: toPartnerFormValues(partner) });

  const submit = form.handleSubmit((values) =>
    save.mutate(toPartnerPayload(values), {
      onSuccess: () => {
        toast.success(partner ? "Mitra diperbarui." : "Mitra ditambahkan.");
        onClose();
      },
      onError: (error) => applyFieldErrors(form.setError, error),
    }),
  );

  return (
    <Modal
      open
      onClose={onClose}
      title={partner ? `Ubah ${partner.name}` : "Tambah mitra DU/DI"}
      maxWidth="max-w-[760px]"
      footer={
        <>
          <AdminButton variant="ghost" onClick={onClose}>
            Batal
          </AdminButton>
          <AdminButton type="submit" form={FORM_ID} loading={save.isPending}>
            Simpan
          </AdminButton>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormText control={form.control} name="name" label="Nama perusahaan" />
          <FormText control={form.control} name="city" label="Kota" placeholder="Contoh: Surabaya" />
        </div>
        <FormCheckboxGroup control={form.control} name="major_codes" label="Jurusan yang bermitra" options={MAJOR_OPTIONS} />
        <FormImageUpload control={form.control} name="logo" variant="inline" label="Logo" title="Unggah logo" hint="PNG/JPG/WebP, maks 2 MB" />
        <FormText control={form.control} name="website" type="url" label="Situs web (opsional)" placeholder="https://" />
        <FormTextarea control={form.control} name="description" label="Keterangan (opsional)" rows={3} />
        <div className="grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-end">
          <FormText control={form.control} name="sort_order" label="Urutan" maxLength={4} transform={(value) => value.replace(/\D/g, "")} />
          <FormCheckbox control={form.control} name="is_active" label="Tampilkan di website" hint="Mitra nonaktif tetap tersimpan, tapi tidak tampil di halaman Kemitraan." />
        </div>
      </form>
    </Modal>
  );
}
