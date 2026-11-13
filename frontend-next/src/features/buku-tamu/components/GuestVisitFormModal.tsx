"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import Modal from "@/shared/components/admin/Modal";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import { useCreateGuestVisit } from "../hooks/useGuestBookAdmin";
import { toGuestVisitPayload } from "../services/buku-tamu-form.service";
import { GUEST_VISIT_EMPTY, guestVisitSchema, type GuestVisitFormValues } from "../validation/buku-tamu.schema";
import { GuestVisitFields } from "./GuestVisitFields";

const FORM_ID = "form-kunjungan-tu";
const adminVisitSchema = guestVisitSchema(false);

/** TU mencatat kunjungan yang dijadwalkan lewat telepon atau surat. */
export function GuestVisitFormModal({ onClose }: { onClose: () => void }) {
  const create = useCreateGuestVisit();
  const form = useForm<GuestVisitFormValues>({ resolver: zodResolver(adminVisitSchema), defaultValues: GUEST_VISIT_EMPTY });

  const submit = form.handleSubmit((values) =>
    create.mutate(toGuestVisitPayload(values), {
      onSuccess: onClose,
      onError: (error) => applyFieldErrors(form.setError, error),
    }),
  );

  return (
    <Modal
      open
      onClose={onClose}
      title="Catat jadwal kunjungan"
      maxWidth="max-w-[760px]"
      footer={
        <>
          <AdminButton variant="ghost" onClick={onClose}>
            Batal
          </AdminButton>
          <AdminButton type="submit" form={FORM_ID} loading={create.isPending}>
            Simpan
          </AdminButton>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate className="grid gap-5">
        <GuestVisitFields control={form.control} />
      </form>
    </Modal>
  );
}
