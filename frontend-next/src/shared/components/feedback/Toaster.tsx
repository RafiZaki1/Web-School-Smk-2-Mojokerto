"use client";

import { useToastStore, type ToastItem, type ToastVariant } from "@/shared/stores/toast.store";

const VARIANT_CLASS: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  return (
    <div
      role={item.variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${VARIANT_CLASS[item.variant]}`}
    >
      <p className="flex-1">{item.message}</p>
      <button type="button" onClick={() => onDismiss(item.id)} className="font-semibold opacity-70 hover:opacity-100" aria-label="Tutup notifikasi">
        ×
      </button>
    </div>
  );
}

// Penampil notifikasi global. Dipasang sekali di AppProviders.
export function Toaster() {
  const items = useToastStore((state) => state.items);
  const dismiss = useToastStore((state) => state.dismiss);

  if (items.length === 0) return null;

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-2 sm:left-auto sm:right-4 sm:w-96">
      {items.map((item) => (
        <div key={item.id} className="pointer-events-auto">
          <ToastCard item={item} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
}
