import type { GuestMessageFormValues, GuestVisitFormValues } from "../validation/buku-tamu.schema";
import type { GuestMessageRequest, GuestVisitRequest } from "../types/buku-tamu.type";

const orNull = (value: string) => value.trim() || null;

export const toGuestMessagePayload = (values: GuestMessageFormValues): GuestMessageRequest => ({
  name: values.name.trim(),
  email: orNull(values.email),
  phone: orNull(values.phone),
  subject: values.subject.trim(),
  message: values.message.trim(),
});

export const toGuestVisitPayload = (values: GuestVisitFormValues): GuestVisitRequest => ({
  visitor_name: values.visitor_name.trim(),
  institution: values.institution.trim(),
  phone: orNull(values.phone),
  purpose: values.purpose.trim(),
  visit_date: values.visit_date,
  visit_time: values.visit_time || null,
  participants: values.participants ? Number(values.participants) : null,
  person_to_meet: orNull(values.person_to_meet),
});

const DATE_FORMAT = new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "2026-11-20" + "09:00" -> "Jum, 20 Nov 2026 · 09.00". */
export function formatVisitSchedule(date: string | null, time: string | null): string {
  if (!date) return "-";
  const parsed = new Date(`${date}T00:00:00Z`);
  const day = Number.isNaN(parsed.getTime()) ? date : DATE_FORMAT.format(parsed);
  return time ? `${day} · ${time.replace(":", ".")}` : day;
}
