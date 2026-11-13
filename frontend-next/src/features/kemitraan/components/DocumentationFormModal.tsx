"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import Modal from "@/shared/components/admin/Modal";
import { FormCheckbox } from "@/shared/components/form/FormCheckbox";
import { FormImageUpload } from "@/shared/components/form/FormImageUpload";
import { FormSelect } from "@/shared/components/form/FormSelect";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { MAJORS } from "@/shared/constants/school-classes";
import { toast } from "@/shared/lib/toast";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import { useIndustryPartnersAdmin, useSaveDocumentation } from "../hooks/useKemitraanAdmin";
import { toDocumentationFormValues, toDocumentationPayload } from "../services/kemitraan-form.service";
import { documentationSchema, type DocumentationFormValues } from "../validation/kemitraan.schema";
import type { InternshipDocumentation } from "../types/kemitraan.type";

const FORM_ID = "form-dokumentasi-pkl";
const MAJOR_OPTIONS = [{ value: "", label: "Tanpa jurusan" }, ...MAJORS.map((major) => ({ value: major.code, label: major.label }))];

/** Tambah atau ubah satu foto dokumentasi kegiatan PKL. */
export function DocumentationFormModal({ documentation, onClose }: { documentation: InternshipDocumentation | null; onClose: () => void }) {
  const save = useSaveDocumentation(documentation?.id ?? null);
  const partners = useIndustryPartnersAdmin();
  const form = useForm<DocumentationFormValues>({ resolver: zodResolver(documentationSchema), defaultValues: toDocumentationFormValues(documentation) });
  const partnerOptions = [{ value: "", label: "Tanpa mitra" }, ...(partners.data ?? []).map((partner) => ({ value: String(partner.id), label: partner.name }))];

  const submit = form.handleSubmit((values) =>
    save.mutate(toDocumentationPayload(values), {
      onSuccess: () => {
        toast.success(documentation ? "Dokumentasi diperbarui." : "Dokumentasi ditambahkan.");
        onClose();
      },
      onError: (error) => applyFieldErrors(form.setError, error),
    }),
  );

  return (
    <Modal
      open
      onClose={onClose}
      title={documentation ? "Ubah dokumentasi PKL" : "Tambah dokumentasi PKL"}
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
        <FormText control={form.control} name="title" label="Judul kegiatan" placeholder="Contoh: Siswa RPL PKL di PT Telkom Indonesia" />
        <FormImageUpload control={form.control} name="image" label="Foto kegiatan" hint="JPG/PNG/WebP, maks 4 MB" />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormSelect control={form.control} name="major_code" label="Jurusan" options={MAJOR_OPTIONS} />
          <FormSelect control={form.control} name="industry_partner_id" label="Mitra DU/DI" options={partnerOptions} searchable />
          <FormText control={form.control} name="activity_date" type="date" label="Tanggal kegiatan" />
          <FormText control={form.control} name="sort_order" label="Urutan" maxLength={4} transform={(value) => value.replace(/\D/g, "")} />
        </div>
        <FormTextarea control={form.control} name="description" label="Keterangan (opsional)" rows={3} />
        <FormCheckbox control={form.control} name="is_published" label="Tampilkan di website" hint="Foto yang tampil muncul di halaman Kemitraan & PKL dan beranda." />
      </form>
    </Modal>
  );
}
