"use client";

import type { ReactNode } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";

// Tampilan standar untuk status halaman: loading, kosong, dan error.
// Dipakai agar setiap halaman punya tiga status yang konsisten.

interface StatusStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

function StatusShell({ title, description, action, tone }: StatusStateProps & { tone: "neutral" | "error" }) {
  const { t } = useTranslation();
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`mx-auto flex max-w-xl flex-col items-center gap-3 rounded-2xl border px-6 py-10 text-center ${
        tone === "error" ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200" : "border-line bg-surface-alt text-body"
      }`}
    >
      <p className="text-base font-semibold">{t(title)}</p>
      {description && <p className="text-sm opacity-80">{t(description)}</p>}
      {action}
    </div>
  );
}

export function EmptyState(props: StatusStateProps) {
  return <StatusShell {...props} tone="neutral" />;
}

export function ErrorState({ title = "Data gagal dimuat", description = "Periksa koneksi Anda, lalu coba lagi.", action }: Partial<StatusStateProps>) {
  return <StatusShell title={title} description={description} action={action} tone="error" />;
}

// Spinner untuk tabel dan daftar; skeleton dipakai untuk blok konten lain.
export function LoadingState({ label = "Memuat data..." }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-12 text-sm text-muted">
      <span className="size-5 animate-spin rounded-full border-2 border-line border-t-current" aria-hidden="true" />
      <span>{t(label)}</span>
    </div>
  );
}

export function SkeletonBlock({ className = "h-40" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-2xl bg-surface ${className}`} />;
}
