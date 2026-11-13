"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import { useRequestGuestVisit } from "../hooks/useGuestBookPublic";
import { toGuestVisitPayload } from "../services/buku-tamu-form.service";
import { GUEST_VISIT_EMPTY, guestVisitSchema, type GuestVisitFormValues } from "../validation/buku-tamu.schema";
import { GuestBookSent } from "./GuestBookSent";
import { GuestVisitFields } from "./GuestVisitFields";

const publicVisitSchema = guestVisitSchema(true);

/** Permohonan jadwal kunjungan tamu instansi; TU mengonfirmasi lewat telepon. */
export function GuestVisitForm() {
  const request = useRequestGuestVisit();
  const form = useForm<GuestVisitFormValues>({ resolver: zodResolver(publicVisitSchema), defaultValues: GUEST_VISIT_EMPTY });

  const submit = form.handleSubmit((values) => request.mutate(toGuestVisitPayload(values), { onError: (error) => applyFieldErrors(form.setError, error) }));

  if (request.data) {
    return (
      <GuestBookSent
        message={request.data}
        againLabel="Ajukan kunjungan lain"
        onAgain={() => {
          request.reset();
          form.reset(GUEST_VISIT_EMPTY);
        }}
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="svc-form grid gap-5">
      <GuestVisitFields control={form.control} />
      <div>
        <button type="submit" className="btn btn--primary" disabled={request.isPending}>
          <span>{request.isPending ? "Mengirim..." : "Ajukan kunjungan"}</span>
        </button>
      </div>
    </form>
  );
}
