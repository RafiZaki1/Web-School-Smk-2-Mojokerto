import type { GraduateFormValues, GraduationSettingValues } from "../validation/kelulusan.schema";
import type { Graduate, GraduatePayload, GraduationSetting, GraduationSettingPayload } from "../types/kelulusan.type";

const WIB_OFFSET = "+07:00";

const WIB_PARTS = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Jakarta",
});

/** ISO dari server -> nilai input datetime-local dalam WIB, mis. "2026-12-28T08:00". */
export function isoToWibInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const part = (type: Intl.DateTimeFormatPartTypes) => WIB_PARTS.formatToParts(date).find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

/** Nilai datetime-local (WIB) -> ISO dengan offset +07:00 agar server tidak salah zona. */
export const wibInputToIso = (value: string): string | null => (value ? `${value}:00${WIB_OFFSET}` : null);

export const toSettingFormValues = (setting: GraduationSetting): GraduationSettingValues => ({
  active_year: String(setting.active_year),
  release_mode: setting.release_mode,
  release_at: isoToWibInput(setting.release_at),
  closed_message: setting.closed_message ?? "",
});

export const toSettingPayload = (values: GraduationSettingValues): GraduationSettingPayload => ({
  active_year: Number(values.active_year),
  release_mode: values.release_mode,
  release_at: wibInputToIso(values.release_at),
  closed_message: values.closed_message.trim() || null,
});

export const toGraduateFormValues = (graduate: Graduate | null, defaultYear: number): GraduateFormValues => ({
  nisn: graduate?.nisn ?? "",
  full_name: graduate?.full_name ?? "",
  birth_date: graduate?.birth_date ?? "",
  class_name: (graduate?.class_name ?? "XII RPL 1") as GraduateFormValues["class_name"],
  graduation_year: String(graduate?.graduation_year ?? defaultYear),
  status: graduate?.status ?? "passed",
  administration_status: graduate?.administration_status ?? "cleared",
  note: graduate?.note ?? "",
});

export const toGraduatePayload = (values: GraduateFormValues): GraduatePayload => ({
  nisn: values.nisn.replace(/\D/g, ""),
  full_name: values.full_name.trim(),
  birth_date: values.birth_date,
  class_name: values.class_name,
  graduation_year: Number(values.graduation_year),
  status: values.status,
  administration_status: values.administration_status,
  note: values.note.trim() || null,
});
