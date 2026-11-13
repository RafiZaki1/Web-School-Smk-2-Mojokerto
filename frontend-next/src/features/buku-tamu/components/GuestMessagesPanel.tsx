"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AutoSaveSelect, AutoSaveText } from "@/shared/components/admin/AutoSaveField";
import AutoSaveIndicator from "@/shared/components/admin/AutoSaveIndicator";
import SearchInput from "@/shared/components/admin/SearchInput";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/feedback/StatusState";
import Select from "@/shared/components/ui/Select";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { formatServiceTime } from "@/shared/utils/service-status";
import { MESSAGE_SCOPE, MESSAGE_STATUS_OPTIONS } from "../constants/buku-tamu-keys";
import { useAutoSaveGuestMessage, useDeleteGuestEntry, useGuestMessages } from "../hooks/useGuestBookAdmin";
import type { GuestMessage, GuestMessageStatus } from "../types/buku-tamu.type";

const STATUS = [{ value: "", label: "Semua status" }, ...MESSAGE_STATUS_OPTIONS];

/** Kotak pesan pengunjung website. Status dan catatan tersimpan otomatis. */
export function GuestMessagesPanel() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search.trim(), 350);
  const messages = useGuestMessages({ status, search: debounced });

  return (
    <section className="app-card p-5 sm:p-6" aria-labelledby="judul-pesan-tamu">
      <h2 id="judul-pesan-tamu" className="text-[18px] font-semibold text-[#0f172a]">
        Kotak pesan
      </h2>
      <AutoSaveIndicator scope={MESSAGE_SCOPE} syncedAt={messages.dataUpdatedAt || undefined} />
      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari nama, perihal, atau isi pesan..." />
        <Select value={status} onChange={setStatus} options={STATUS} label="Status" />
      </div>
      <div className="mt-4">
        <MessagesBody messages={messages} filtered={Boolean(status || debounced)} />
      </div>
    </section>
  );
}

function MessagesBody({ messages, filtered }: { messages: ReturnType<typeof useGuestMessages>; filtered: boolean }) {
  const autoSave = useAutoSaveGuestMessage();
  const remove = useDeleteGuestEntry("message");

  if (messages.isPending) return <LoadingState label="Memuat pesan..." />;
  if (messages.isError) return <ErrorState />;
  if (messages.data.length === 0) return <EmptyState title={filtered ? "Tidak ada pesan yang cocok" : "Belum ada pesan masuk"} />;

  const confirmRemove = (row: GuestMessage) => {
    if (window.confirm(`Hapus pesan dari ${row.name}?`)) remove.mutate(row.id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="svc-table min-w-[980px]">
        <thead>
          <tr>
            <th scope="col">Pengirim</th>
            <th scope="col">Pesan</th>
            <th scope="col" className="w-[140px]">
              Status
            </th>
            <th scope="col">Catatan TU</th>
            <th scope="col" className="w-[56px]">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {messages.data.map((row) => (
            <tr key={row.id}>
              <td className="min-w-[200px]">
                <span className="block font-semibold text-[#0f172a]">{row.name}</span>
                {row.email ? (
                  <a href={`mailto:${row.email}`} className="svc-link block text-[13px]">
                    {row.email}
                  </a>
                ) : null}
                {row.phone ? <span className="block text-[13px] text-[#64748b]">{row.phone}</span> : null}
                <span className="block text-[12px] text-[#94a3b8]">{formatServiceTime(row.created_at)}</span>
              </td>
              <td className="max-w-[360px]">
                <span className="block font-medium text-[#0f172a]">{row.subject}</span>
                <span className="block text-[14px] leading-relaxed whitespace-pre-line text-[#334155]">{row.message}</span>
              </td>
              <td>
                <AutoSaveSelect label={`Status pesan ${row.name}`} value={row.status} options={MESSAGE_STATUS_OPTIONS} onSave={(value) => autoSave.mutateAsync({ id: row.id, payload: { status: value as GuestMessageStatus } })} />
              </td>
              <td className="min-w-[220px]">
                <AutoSaveText label={`Catatan pesan ${row.name}`} value={row.admin_note} multiline maxLength={2000} placeholder="Mis. sudah dibalas via WA" onSave={(note) => autoSave.mutateAsync({ id: row.id, payload: { admin_note: note.trim() || null } })} />
              </td>
              <td>
                <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => confirmRemove(row)} aria-label={`Hapus pesan dari ${row.name}`} disabled={remove.isPending}>
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
