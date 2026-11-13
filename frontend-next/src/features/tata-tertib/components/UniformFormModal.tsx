"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import Modal from "@/shared/components/admin/Modal";
import { FormImageUpload } from "@/shared/components/form/FormImageUpload";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { toast } from "@/shared/lib/toast";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import { useSaveUniform } from "../hooks/useTataTertibAdmin";
import { toUniformFormValues, toUniformPayload } from "../services/tata-tertib.service";
import { uniformSchema, type UniformFormValues } from "../validation/tata-tertib.schema";
import type { PracticeUniform, UniformSchedule } from "../types/tata-tertib.type";

const FORM_ID = "form-seragam";

interface UniformFormModalProps {
  kind: "schedule" | "practice";
  uniform: UniformSchedule | PracticeUniform;
  label: string;
  onClose: () => void;
}

/** Ubah nama, keterangan, dan foto seragam satu hari atau satu jurusan. */
export function UniformFormModal({ kind, uniform, label, onClose }: UniformFormModalProps) {
  const save = useSaveUniform(kind, uniform.id);
  const form = useForm<UniformFormValues>({ resolver: zodResolver(uniformSchema), defaultValues: toUniformFormValues(uniform) });

  const submit = form.handleSubmit((values) =>
    save.mutate(toUniformPayload(values), {
      onSuccess: () => {
        toast.success(`Seragam ${label} diperbarui.`);
        onClose();
      },
      onError: (error) => applyFieldErrors(form.setError, error),
    }),
  );

  return (
    <Modal
      open
      onClose={onClose}
      title={`Seragam ${label}`}
      maxWidth="max-w-[640px]"
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
        <FormText control={form.control} name="name" label="Nama seragam" placeholder="Contoh: Putih abu-abu" />
        <FormTextarea control={form.control} name="description" label="Keterangan" rows={3} placeholder="Contoh: Dasi, ikat pinggang hitam, sepatu hitam" />
        <FormImageUpload control={form.control} name="image" label="Foto seragam" hint="Foto potret, maks 4 MB" previewClassName="aspect-[3/4] w-full max-w-[240px]" />
      </form>
    </Modal>
  );
}
