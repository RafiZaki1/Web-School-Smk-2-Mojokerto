"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import Modal from "@/shared/components/admin/Modal";
import { FormCheckbox } from "@/shared/components/form/FormCheckbox";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { toast } from "@/shared/lib/toast";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import { useSaveSchoolRule } from "../hooks/useTataTertibAdmin";
import { toRuleFormValues, toRulePayload } from "../services/tata-tertib.service";
import { ruleSchema, type RuleFormValues } from "../validation/tata-tertib.schema";
import type { SchoolRule } from "../types/tata-tertib.type";

const FORM_ID = "form-tata-tertib";

interface RuleFormModalProps {
  rule: SchoolRule | null;
  sections: string[];
  onClose: () => void;
}

/** Tambah atau ubah satu poin tata tertib. Bagian baru dibuat cukup dengan mengetik nama bagian. */
export function RuleFormModal({ rule, sections, onClose }: RuleFormModalProps) {
  const save = useSaveSchoolRule(rule?.id ?? null);
  const form = useForm<RuleFormValues>({ resolver: zodResolver(ruleSchema), defaultValues: toRuleFormValues(rule, sections[0] ?? "") });

  const submit = form.handleSubmit((values) =>
    save.mutate(toRulePayload(values), {
      onSuccess: () => {
        toast.success(rule ? "Poin tata tertib diperbarui." : "Poin tata tertib ditambahkan.");
        onClose();
      },
      onError: (error) => applyFieldErrors(form.setError, error),
    }),
  );

  return (
    <Modal
      open
      onClose={onClose}
      title={rule ? "Ubah poin tata tertib" : "Tambah poin tata tertib"}
      maxWidth="max-w-[680px]"
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
        <div>
          <FormText control={form.control} name="section" label="Bagian" placeholder="Contoh: Kehadiran" hint="Ketik nama bagian yang sudah ada, atau nama baru untuk membuat bagian baru." />
          {sections.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {sections.map((section) => (
                <button key={section} type="button" className="svc-chip" onClick={() => form.setValue("section", section, { shouldDirty: true, shouldValidate: true })}>
                  {section}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <FormTextarea control={form.control} name="content" label="Isi aturan" rows={4} />
        <div className="grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-end">
          <FormText control={form.control} name="sort_order" label="Urutan" maxLength={4} transform={(value) => value.replace(/\D/g, "")} />
          <FormCheckbox control={form.control} name="is_active" label="Tampilkan di website" />
        </div>
      </form>
    </Modal>
  );
}
