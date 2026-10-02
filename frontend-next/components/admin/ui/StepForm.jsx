"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, X } from "lucide-react";
import AdminButton from "./AdminButton";

/**
 * Kartu form bertahap (pola modal form dealtech-ui): header, tab langkah,
 * isi per langkah, dan footer "Langkah x dari n".
 * steps: [{ label, title, description, content: ReactNode, validate?: () => string|null }]
 * onSave({ draft }) boleh async; galat yang dilempar ditampilkan di form, sukses kembali ke backHref.
 * loading: data lama sedang dimuat (mode ubah).
 */
export default function StepForm({ title, subtitle, steps, backHref, saveLabel = "Simpan", draftLabel, onSave, loading = false, savedLabel }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const step = steps[current];
  const isLast = current === steps.length - 1;

  const go = (index) => {
    setError(null);
    setCurrent(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (draft) => {
    // Semua langkah divalidasi sebelum dikirim, lompat ke langkah yang bermasalah
    const invalid = steps.findIndex((item) => item.validate?.());
    if (invalid !== -1) {
      if (invalid !== current) go(invalid);
      setError(steps[invalid].validate());
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave?.({ draft });
      setToast(draft ? "Disimpan sebagai draf." : `${savedLabel ?? title.replace(/^(Tambah|Ubah) /, "")} berhasil disimpan.`);
      setTimeout(() => router.push(backHref), 1000);
    } catch (err) {
      setSaving(false);
      setError(err.message || "Gagal menyimpan data.");
    }
  };

  const next = () => {
    const message = step.validate?.();
    if (message) {
      setError(message);
      return;
    }
    if (!isLast) {
      go(current + 1);
      return;
    }
    save(false);
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
          {step.title ? (
            <div>
              <h2 className="stepform__section-title">{step.title}</h2>
              {step.description ? <p className="stepform__section-desc">{step.description}</p> : null}
            </div>
          ) : null}
          {loading ? (
            <p className="flex items-center gap-2 py-10 text-[15px] text-[#64748b]" role="status">
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              Memuat data...
            </p>
          ) : (
            step.content
          )}
          {error ? (
            <p role="alert" className="rounded-[10px] bg-[#fee2e2] px-4 py-3 text-[14px] font-medium text-[#b91c1c]">
              {error}
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
