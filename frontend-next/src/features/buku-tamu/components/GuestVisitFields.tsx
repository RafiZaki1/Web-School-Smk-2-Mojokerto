"use client";

import type { Control } from "react-hook-form";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import type { GuestVisitFormValues } from "../validation/buku-tamu.schema";

/** Kolom jadwal kunjungan instansi; dipakai form publik dan form pencatatan TU. */
export function GuestVisitFields({ control }: { control: Control<GuestVisitFormValues> }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormText control={control} name="visitor_name" label="Nama tamu" autoComplete="name" />
        <FormText control={control} name="institution" label="Instansi" placeholder="Contoh: Dinas Pendidikan Kota Mojokerto" />
        <FormText control={control} name="phone" type="tel" label="Nomor HP/WhatsApp" autoComplete="tel" />
        <FormText control={control} name="person_to_meet" label="Ingin bertemu (opsional)" placeholder="Contoh: Kepala Sekolah" />
        <FormText control={control} name="visit_date" type="date" label="Tanggal kunjungan" />
        <div className="grid grid-cols-2 gap-5">
          <FormText control={control} name="visit_time" type="text" label="Jam (opsional)" placeholder="09:00" maxLength={5} />
          <FormText control={control} name="participants" label="Jumlah orang" maxLength={3} transform={(value) => value.replace(/\D/g, "")} />
        </div>
      </div>
      <FormTextarea control={control} name="purpose" label="Tujuan kunjungan" rows={3} />
    </>
  );
}
