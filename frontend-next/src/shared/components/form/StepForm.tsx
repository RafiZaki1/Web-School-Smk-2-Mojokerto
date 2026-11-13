"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, X } from "lucide-react";
import { get, type FieldErrors, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";
import AdminButton from "@/shared/components/admin/AdminButton";
import { ApiError } from "@/shared/lib/http/api-error";
import { handleApiError } from "@/shared/utils/error-handler";

export interface FormStep<T extends FieldValues> {
  label: string;
  title: string;
  description?: string;
  // Field yang divalidasi saat langkah ini ditinggalkan
  fields: Path<T>[];
  content: ReactNode;
}

interface StepFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  title: string;
  subtitle?: string;
  steps: FormStep<T>[];
  backHref: string;
  saveLabel?: string;
  draftLabel?: string;
  savedLabel?: string;
  loading?: boolean;
  // Nama field di backend -> nama field di form (mis. "title" -> "judul")
  serverFieldMap?: Partial<Record<string, Path<T>>>;
  onSubmit: (values: T, options: { draft: boolean }) => Promise<unknown>;
}

// Kartu form bertahap: header, tab langkah, isi per langkah, dan footer "Langkah x dari n".
// Validasi dijalankan oleh React Hook Form; galat di langkah lain membuat form lompat ke langkah itu.
export function StepForm<T extends FieldValues>({
  form,
  title,
  subtitle,
  steps,
  backHref,
  saveLabel = "Simpan",
  draftLabel,
  savedLabel,
  loading = false,
  serverFieldMap = {},
  onSubmit,
}: StepFormProps<T>) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const step = steps[current];
  const isLast = current === steps.length - 1;

  const go = (index: number) => {
    setSubmitError(null);
    setCurrent(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const firstStepWith = (names: string[]) => steps.findIndex((item) => item.fields.some((field) => names.includes(field)));

  const goToFirstInvalid = (errors: FieldErrors<T>) => {
    const index = steps.findIndex((item) => item.fields.some((field) => get(errors, field)));
    if (index !== -1 && index !== current) go(index);
  };

  const handleSubmitError = (error: unknown) => {
    setSaving(false);

    if (error instanceof ApiError && error.fieldErrors) {
      const names: string[] = [];
      Object.entries(error.fieldErrors).forEach(([key, messages]) => {
        const name = (serverFieldMap[key] ?? key) as Path<T>;
        names.push(name);
        form.setError(name, { type: "server", message: messages[0] });
      });
      const index = firstStepWith(names);
      if (index !== -1 && index !== current) go(index);
    }

    if (error instanceof ApiError && (error.status === 401 || error.status === 403 || error.status === 0 || error.status >= 500)) {
      handleApiError(error);
      return;
    }
    setSubmitError(error instanceof Error && error.message ? error.message : "Gagal menyimpan data.");
  };

  const save = (draft: boolean) =>
    form.handleSubmit(
      async (values) => {
        setSaving(true);
        setSubmitError(null);
        try {
          await onSubmit(values, { draft });
          setToast(draft ? "Disimpan sebagai draf." : `${savedLabel ?? title.replace(/^(Tambah|Ubah) /, "")} berhasil disimpan.`);
          setTimeout(() => router.push(backHref), 1000);
        } catch (error) {
          handleSubmitError(error);
        }
      },
      (errors) => goToFirstInvalid(errors),
    )();

  const next = async () => {
    const valid = await form.trigger(step.fields);
    if (!valid) return;
    if (!isLast) {
      go(current + 1);
      return;
    }
    await save(false);
  };

  return (
    <>
      <button type="button" onClick={() => router.push(backHref)} className="adm-btn adm-btn--text mb-4 px-0">
        <ArrowLeft aria-hidden="true" />
        <span>Kembali</span>
      </button>

      <section className="app-card stepform">
        <header className="stepform__header">
          <div>
            <h1 className="stepform__title">{title}</h1>
            {subtitle ? <p className="stepform__subtitle">{subtitle}</p> : null}
          </div>
          <button type="button" className="adm-icon-btn" onClick={() => router.push(backHref)} aria-label="Tutup form">
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="stepform__tabs" role="tablist" aria-label="Langkah pengisian">
          {steps.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={index === current}
              className={`stepform__tab${index < current ? " is-done" : ""}`}
              onClick={() => (index < current ? go(index) : undefined)}
              disabled={index > current}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="stepform__body" role="tabpanel" aria-label={step.label}>
          <div>
            <h2 className="stepform__section-title">{step.title}</h2>
            {step.description ? <p className="stepform__section-desc">{step.description}</p> : null}
          </div>
          {loading ? (
            <p className="flex items-center gap-2 py-10 text-[15px] text-[#64748b]" role="status">
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              Memuat data...
            </p>
          ) : (
            step.content
          )}
          {submitError ? (
            <p role="alert" className="rounded-[10px] bg-[#fee2e2] px-4 py-3 text-[14px] font-medium text-[#b91c1c]">
              {submitError}
            </p>
          ) : null}
        </div>

        <footer className="stepform__footer">
          <span className="stepform__step">
            Langkah {current + 1} dari {steps.length}
          </span>
          <div className="flex flex-wrap gap-3">
            {current === 0 ? (
              draftLabel ? (
                <AdminButton variant="ghost" onClick={() => save(true)} disabled={saving || loading}>
                  {draftLabel}
                </AdminButton>
              ) : (
                <AdminButton variant="ghost" onClick={() => router.push(backHref)}>
                  Batal
                </AdminButton>
              )
            ) : (
              <AdminButton variant="ghost" onClick={() => go(current - 1)}>
                Kembali
              </AdminButton>
            )}
            <AdminButton icon={isLast ? undefined : ArrowRight} iconPosition="right" onClick={next} loading={saving} disabled={saving || loading}>
              {isLast ? saveLabel : "Lanjut"}
            </AdminButton>
          </div>
        </footer>
      </section>

      {toast ? (
        <div className="toast" role="status">
          <CheckCircle2 size={20} className="text-[#4ade80]" aria-hidden="true" />
          {toast}
        </div>
      ) : null}
    </>
  );
}
