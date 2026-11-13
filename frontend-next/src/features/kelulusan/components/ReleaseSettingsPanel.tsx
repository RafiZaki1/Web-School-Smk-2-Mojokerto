"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import { ErrorState, SkeletonBlock } from "@/shared/components/feedback/StatusState";
import { FormText } from "@/shared/components/form/FormText";
import { FormTextarea } from "@/shared/components/form/FormTextarea";
import { toast } from "@/shared/lib/toast";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import { RELEASE_MODE_OPTIONS } from "../constants/kelulusan-keys";
import { useGraduationSettings, useSaveGraduationSettings } from "../hooks/useGraduationAdmin";
import { toSettingFormValues, toSettingPayload } from "../services/graduation-form.service";
import { formatReleaseAt } from "../utils/countdown";
import { graduationSettingSchema, type GraduationSettingValues } from "../validation/kelulusan.schema";
import type { GraduationPublicStatus } from "../types/kelulusan.type";

/** Pengaturan rilis pengumuman: Draft, Timer (tanggal + jam WIB), atau Buka Langsung. */
export function ReleaseSettingsPanel() {
  const settings = useGraduationSettings();

  if (settings.isPending) return <SkeletonBlock className="h-64" />;
  if (settings.isError) return <ErrorState title="Pengaturan kelulusan gagal dimuat" />;

  return <ReleaseSettingsForm key={settings.data.setting.updated_at ?? "baru"} values={toSettingFormValues(settings.data.setting)} status={settings.data.public_status} />;
}

function ReleaseSettingsForm({ values, status }: { values: GraduationSettingValues; status: GraduationPublicStatus }) {
  const save = useSaveGraduationSettings();
  const form = useForm<GraduationSettingValues>({ resolver: zodResolver(graduationSettingSchema), defaultValues: values });
  const mode = useWatch({ control: form.control, name: "release_mode" });

  const submit = form.handleSubmit((formValues) =>
    save.mutate(toSettingPayload(formValues), {
      onSuccess: () => toast.success("Pengaturan pengumuman disimpan."),
      onError: (error) => applyFieldErrors(form.setError, error),
    }),
  );

  return (
    <form onSubmit={submit} noValidate className="app-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-semibold text-[#0f172a]">Pengumuman di /cek-kelulusan</h2>
          <p className="mt-1 text-[14px] text-[#475569]">{describeStatus(status)}</p>
        </div>
        <span className={`svc-tag ${status.is_open ? "svc-tag--ok" : "svc-tag--neutral"}`}>{status.is_open ? "Form terbuka" : "Form tertutup"}</span>
      </div>

      <Controller
        control={form.control}
        name="release_mode"
        render={({ field }) => (
          <fieldset className="mt-5 grid gap-3 md:grid-cols-3">
            <legend className="mb-2 text-[14px] font-semibold text-[#0f172a]">Mode rilis</legend>
            {RELEASE_MODE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer gap-3 rounded-md border px-4 py-3 ${field.value === option.value ? "border-[#1d4ed8] bg-[#eff6ff]" : "border-[#e5e7eb] bg-white"}`}
              >
                <input type="radio" name={field.name} value={option.value} checked={field.value === option.value} onChange={() => field.onChange(option.value)} className="mt-1 accent-[#1d4ed8]" />
                <span>
                  <span className="block text-[15px] font-semibold text-[#0f172a]">{option.label}</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-[#475569]">{option.hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}
      />

      <div className="mt-5 grid gap-5 md:grid-cols-[160px_260px_minmax(0,1fr)]">
        <FormText control={form.control} name="active_year" label="Tahun angkatan aktif" maxLength={4} transform={(value) => value.replace(/\D/g, "")} />
        <ReleaseAtField control={form.control} disabled={mode !== "timer"} />
        <FormTextarea control={form.control} name="closed_message" label="Pesan saat belum dibuka" rows={2} hint="Tampil pada mode Draft. Kosongkan untuk memakai pesan bawaan." />
      </div>

      <div className="mt-5 flex justify-end">
        <AdminButton type="submit" loading={save.isPending} disabled={!form.formState.isDirty}>
          Simpan pengaturan
        </AdminButton>
      </div>
    </form>
  );
}

function ReleaseAtField({ control, disabled }: { control: Control<GraduationSettingValues>; disabled: boolean }) {
  return (
    <Controller
      control={control}
      name="release_at"
      render={({ field, fieldState }) => (
        <div className="field">
          <label htmlFor="release-at" className="field__label">
            Tanggal & jam rilis (WIB)
          </label>
          <input
            {...field}
            id="release-at"
            type="datetime-local"
            disabled={disabled}
            aria-invalid={fieldState.error ? true : undefined}
            className={`inputtext__field${fieldState.error ? " inputtext__field--error" : ""}`}
          />
          {fieldState.error ? (
            <p className="field__error" role="alert">
              {fieldState.error.message}
            </p>
          ) : (
            <p className="field__hint">{disabled ? "Dipakai pada mode Gunakan Timer." : "Form terbuka otomatis pada waktu ini."}</p>
          )}
        </div>
      )}
    />
  );
}

function describeStatus(status: GraduationPublicStatus): string {
  if (status.mode === "draft") return `Angkatan ${status.active_year}. Siswa melihat pesan bahwa pengumuman belum dibuka.`;
  if (status.mode === "timer" && !status.is_open) return `Angkatan ${status.active_year}. Hitung mundur berjalan sampai ${formatReleaseAt(status.release_at)}.`;
  return `Angkatan ${status.active_year}. Siswa bisa langsung mengecek hasil kelulusan.`;
}
