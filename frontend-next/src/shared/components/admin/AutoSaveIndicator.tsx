"use client";

import { useIsMutating, useMutationState } from "@tanstack/react-query";
import { autoSaveKey } from "@/shared/hooks/useAutoSave";

const TIME = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });

/**
 * Teks kecil di pojok tabel: "Menyimpan...", "Tersimpan 09.41", atau "Gagal menyimpan".
 * Dibaca dari cache mutasi auto-save, jadi berlaku untuk semua sel di tabel yang sama.
 */
export default function AutoSaveIndicator({ scope, syncedAt }: { scope: string; syncedAt?: number }) {
  const saving = useIsMutating({ mutationKey: autoSaveKey(scope) });
  const states = useMutationState({
    filters: { mutationKey: autoSaveKey(scope) },
    select: (mutation) => ({ status: mutation.state.status, at: mutation.state.submittedAt }),
  });
  const latest = states.filter((state) => state.status !== "pending").at(-1);

  let text = "Perubahan tersimpan otomatis";
  let tone = "text-[#64748b]";
  if (saving > 0) {
    text = "Menyimpan...";
  } else if (latest?.status === "error") {
    text = "Gagal menyimpan. Periksa isian lalu ulangi.";
    tone = "text-[#b91c1c]";
  } else if (latest?.status === "success") {
    text = `Tersimpan ${TIME.format(latest.at)}`;
    tone = "text-[#166534]";
  }

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]" aria-live="polite">
      <span className={`font-semibold ${tone}`}>{text}</span>
      {syncedAt ? <span className="text-[#64748b]">Sinkron {TIME.format(syncedAt)}</span> : null}
    </p>
  );
}
