"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormText } from "@/shared/components/form/FormText";
import { ApiError } from "@/shared/lib/http/api-error";
import { applyFieldErrors } from "@/shared/utils/apply-field-errors";
import type { useCheckGraduation } from "../hooks/useGraduationPublic";
import { graduationCheckSchema, type GraduationCheckValues } from "../validation/kelulusan.schema";

interface GraduationCheckFormProps {
  check: ReturnType<typeof useCheckGraduation>;
  // Dipanggil saat server menyatakan pengumuman ditutup (mis. TU baru mengubah mode)
  onClosed: () => void;
}

const EMPTY: GraduationCheckValues = { full_name: "", nisn: "" };

/** Form nama lengkap + NISN di dalam kartu Cek Kelulusan. */
export function GraduationCheckForm({ check, onClosed }: GraduationCheckFormProps) {
  const form = useForm<GraduationCheckValues>({ resolver: zodResolver(graduationCheckSchema), defaultValues: EMPTY });

  const submit = form.handleSubmit((values) =>
    check.mutate(graduationCheckSchema.parse(values), {
      onError: (error) => {
        if (error instanceof ApiError && error.status === 403) onClosed();
        if (error instanceof ApiError && [403, 404, 429].includes(error.status)) return;
        applyFieldErrors(form.setError, error);
      },
    }),
  );

  const notice = noticeFor(check.error);

  return (
    <form onSubmit={submit} noValidate className="svc-form mx-auto max-w-[560px] text-left">
      <fieldset disabled={check.isPending} className="grid gap-4">
        <legend className="sr-only">Data siswa</legend>
        <FormText control={form.control} name="full_name" label="Nama lengkap" placeholder="Sesuai rapor" autoComplete="name" maxLength={255} />
        <FormText control={form.control} name="nisn" label="NISN" placeholder="10 digit angka" autoComplete="off" maxLength={20} transform={(value) => value.replace(/\D/g, "")} />
      </fieldset>

      {notice ? (
        <p role="alert" className="svc-error mt-4 text-center">
          {notice}
        </p>
      ) : null}

      <div className="mt-6 flex justify-center">
        <button type="submit" className="btn btn--primary" disabled={check.isPending}>
          <span>{check.isPending ? "Memeriksa..." : "Lihat hasil kelulusan"}</span>
        </button>
      </div>
    </form>
  );
}

function noticeFor(error: unknown): string | null {
  if (!(error instanceof ApiError)) return null;
  if (error.status === 404 || error.status === 403) return error.message;
  if (error.status === 429) return "Terlalu banyak percobaan. Tunggu satu menit, lalu coba lagi.";
  return null;
}
