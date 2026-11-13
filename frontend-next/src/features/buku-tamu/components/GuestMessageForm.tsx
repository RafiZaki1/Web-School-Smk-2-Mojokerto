"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import { useSendGuestMessage } from "../hooks/useGuestBookPublic";
import { toGuestMessagePayload } from "../services/buku-tamu-form.service";
import { GUEST_MESSAGE_EMPTY, guestMessageSchema, type GuestMessageFormValues } from "../validation/buku-tamu.schema";
import { GuestBookSent } from "./GuestBookSent";

/** Pesan atau pertanyaan pengunjung untuk TU. Email atau HP wajib salah satu agar bisa dibalas. */
export function GuestMessageForm() {
  const send = useSendGuestMessage();
  const form = useForm<GuestMessageFormValues>({ resolver: zodResolver(guestMessageSchema), defaultValues: GUEST_MESSAGE_EMPTY });

  const submit = form.handleSubmit((values) => send.mutate(toGuestMessagePayload(values), { onError: (error) => applyFieldErrors(form.setError, error) }));

  if (send.data) {
    return (
      <GuestBookSent
        message={send.data}
        againLabel="Kirim pesan lain"
        onAgain={() => {
          send.reset();
          form.reset(GUEST_MESSAGE_EMPTY);
        }}
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="svc-form grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormText control={form.control} name="name" label="Nama" autoComplete="name" />
        <FormText control={form.control} name="subject" label="Perihal" placeholder="Contoh: Informasi pendaftaran" />
        <FormText control={form.control} name="email" type="email" label="Email" autoComplete="email" />
        <FormText control={form.control} name="phone" type="tel" label="Nomor HP/WhatsApp" autoComplete="tel" hint="Isi email atau nomor HP, minimal salah satu." />
      </div>
      <FormTextarea control={form.control} name="message" label="Pesan" rows={5} />
      <div>
        <button type="submit" className="btn btn--primary" disabled={send.isPending}>
          <span>{send.isPending ? "Mengirim..." : "Kirim pesan"}</span>
        </button>
      </div>
    </form>
  );
}
