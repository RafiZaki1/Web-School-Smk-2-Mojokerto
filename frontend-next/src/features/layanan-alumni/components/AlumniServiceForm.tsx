"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormSelect } from "@/shared/components/form/FormSelect";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { SCHOOL_CLASSES } from "@/shared/constants/school-classes";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import { useSubmitAlumniService } from "../hooks/useAlumniServicePublic";
import { ALUMNI_SERVICE_EMPTY, alumniServiceSchema, type AlumniServiceFormValues } from "../validation/alumni-service.schema";
import { PushNotificationToggle } from "./PushNotificationToggle";
import { ServiceTypeField } from "./ServiceTypeField";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** Form pengajuan layanan berkas untuk alumni, tanpa login. */
export function AlumniServiceForm() {
  const submit = useSubmitAlumniService();
  const form = useForm<AlumniServiceFormValues>({ resolver: zodResolver(alumniServiceSchema), defaultValues: ALUMNI_SERVICE_EMPTY });

  const onSubmit = form.handleSubmit((values) =>
    submit.mutate(
      {
        nisn: values.nisn.trim(),
        full_name: values.full_name.trim(),
        graduation_year: Number(values.graduation_year),
        class_name: values.class_name,
        service_type: values.service_type,
        purpose: values.purpose.trim(),
        phone: values.phone.trim() || null,
      },
      { onError: (error) => applyFieldErrors(form.setError, error) },
    ),
  );

  if (submit.data) {
    return (
      <section className="svc-card px-5 py-6 sm:px-6" aria-live="polite">
        <p className="text-[13px] font-medium text-muted">Pengajuan terkirim</p>
        <h2 className="mt-1 text-[22px] font-bold text-heading">
          Kode tiket <span className="svc-code">{submit.data.ticket_code}</span>
        </h2>
        <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-body">
          {submit.data.service_type_label} atas nama {submit.data.full_name} masuk antrean TU. Simpan kode tiket ini. Status pengajuan tampil di ikon lonceng pada perangkat ini.
        </p>
        <div className="mt-5 rounded-md border border-line px-4 py-4">
          <h3 className="mb-2 text-[15px] font-semibold text-heading">Terima kabar di HP</h3>
          <PushNotificationToggle />
        </div>
        <button
          type="button"
          className="svc-link mt-5 text-[14px]"
          onClick={() => {
            submit.reset();
            form.reset(ALUMNI_SERVICE_EMPTY);
          }}
        >
          Ajukan layanan lain
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="svc-card svc-form grid gap-5 px-5 py-6 sm:px-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormText control={form.control} name="nisn" label="NISN" placeholder="10 digit angka" maxLength={20} transform={digitsOnly} autoComplete="off" />
        <FormText control={form.control} name="full_name" label="Nama lengkap" placeholder="Sesuai ijazah" autoComplete="name" />
        <FormText control={form.control} name="graduation_year" label="Tahun lulus" placeholder="Contoh: 2024" maxLength={4} transform={digitsOnly} />
        <FormSelect control={form.control} name="class_name" label="Kelas terakhir" options={SCHOOL_CLASSES} placeholder="Pilih kelas" />
      </div>
      <ServiceTypeField control={form.control} />
      <FormTextarea control={form.control} name="purpose" label="Keperluan" rows={3} placeholder="Contoh: melamar kerja di perusahaan BUMN, butuh 5 lembar legalisir" />
      <FormText control={form.control} name="phone" type="tel" label="Nomor HP/WhatsApp (opsional)" placeholder="08xxxxxxxxxx" autoComplete="tel" hint="Dipakai TU bila perlu menghubungi Anda." />

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="svc-btn svc-btn--primary" disabled={submit.isPending}>
          {submit.isPending ? "Mengirim..." : "Kirim pengajuan"}
        </button>
        <p className="text-[13px] text-muted">Bawa KTP dan fotokopi ijazah saat datang ke ruang TU.</p>
      </div>
    </form>
  );
}
