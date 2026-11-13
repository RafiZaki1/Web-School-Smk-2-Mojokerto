"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import Modal from "@/shared/components/admin/Modal";
import { FormSelect } from "@/shared/components/form/FormSelect";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { SCHOOL_CLASSES } from "@/shared/constants/school-classes";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import { ADMINISTRATION_OPTIONS, GRADUATION_STATUS_OPTIONS } from "../constants/kelulusan-keys";
import { useSaveGraduate } from "../hooks/useGraduationAdmin";
import { toGraduateFormValues, toGraduatePayload } from "../services/graduation-form.service";
import { graduateSchema, type GraduateFormValues } from "../validation/kelulusan.schema";
import type { Graduate } from "../types/kelulusan.type";

interface GraduateFormModalProps {
  // null = tambah siswa baru
  graduate: Graduate | null;
  defaultYear: number;
  onClose: () => void;
}

const FORM_ID = "form-siswa-kelulusan";

/** Tambah atau revisi satu siswa secara manual, di luar impor file. */
export function GraduateFormModal({ graduate, defaultYear, onClose }: GraduateFormModalProps) {
  const save = useSaveGraduate(graduate?.id ?? null);
  const form = useForm<GraduateFormValues>({ resolver: zodResolver(graduateSchema), defaultValues: toGraduateFormValues(graduate, defaultYear) });

  const submit = form.handleSubmit((values) =>
    save.mutate(toGraduatePayload(values), {
      onSuccess: onClose,
      onError: (error) => applyFieldErrors(form.setError, error),
    }),
  );

  return (
    <Modal
      open
      onClose={onClose}
      title={graduate ? `Ubah data ${graduate.full_name}` : "Tambah siswa"}
      maxWidth="max-w-[720px]"
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
      <form id={FORM_ID} onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
        <FormText control={form.control} name="nisn" label="NISN" maxLength={20} transform={(value) => value.replace(/\D/g, "")} />
        <FormText control={form.control} name="full_name" label="Nama lengkap" />
        <FormText control={form.control} name="birth_date" type="date" label="Tanggal lahir" />
        <FormSelect control={form.control} name="class_name" label="Kelas" options={SCHOOL_CLASSES} />
        <FormText control={form.control} name="graduation_year" label="Tahun lulus" maxLength={4} transform={(value) => value.replace(/\D/g, "")} />
        <FormSelect control={form.control} name="status" label="Status kelulusan" options={GRADUATION_STATUS_OPTIONS} />
        <FormSelect control={form.control} name="administration_status" label="Status administrasi" options={ADMINISTRATION_OPTIONS} />
        <FormTextarea control={form.control} name="note" label="Catatan untuk siswa" rows={3} className="sm:col-span-2" />
      </form>
    </Modal>
  );
}
