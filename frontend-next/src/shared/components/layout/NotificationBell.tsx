"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useDeviceInbox, useMarkDeviceInboxRead } from "@/shared/hooks/useDeviceInbox";
import { useDeviceToken } from "@/shared/hooks/useDeviceToken";
import { formatServiceTime, SERVICE_STATUS_TONE } from "@/shared/utils/service-status";

/**
 * Lonceng di pojok kanan navbar. Isinya hanya notifikasi dan status pengajuan layanan alumni
 * milik perangkat ini (token di localStorage). Ikon lonceng dipakai karena memang tempat notifikasi.
 */
export default function NotificationBell({ tone }: { tone: "light" | "transparent" }) {
  const id = useId();
  const token = useDeviceToken();
  const inbox = useDeviceInbox();
  const markRead = useMarkDeviceInboxRead();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const unread = inbox.data?.unread ?? 0;

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event: PointerEvent) => !wrapRef.current?.contains(event.target as Node) && setOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0 && !markRead.isPending) markRead.mutate();
  };

  const label = unread > 0 ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi";

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        aria-label={label}
        className={`relative inline-flex size-11 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          tone === "light" ? "text-heading hover:bg-tint" : "text-white hover:bg-white/15"
        }`}
      >
        <Bell size={21} aria-hidden="true" />
        {unread > 0 ? (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] rounded-full bg-[#b91c1c] px-1 text-center text-[11px] leading-[18px] font-bold text-white" aria-hidden="true">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={`${id}-panel`}
          role="region"
          aria-label="Notifikasi layanan TU"
          className="svc-card fixed inset-x-4 top-[76px] z-50 max-h-[70vh] overflow-y-auto sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-[380px]"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="text-[15px] font-semibold text-heading">Notifikasi layanan TU</p>
            <p className="text-[13px] text-muted">Hanya pengajuan dari perangkat ini.</p>
          </div>
          <BellBody hasToken={Boolean(token)} inbox={inbox} onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}

function BellBody({ hasToken, inbox, onNavigate }: { hasToken: boolean; inbox: ReturnType<typeof useDeviceInbox>; onNavigate: () => void }) {
  if (!hasToken) {
    return (
      <div className="px-4 py-5 text-[14px] text-body">
        <p>Belum ada pengajuan dari perangkat ini.</p>
        <Link href="/layanan-alumni" onClick={onNavigate} className="svc-link mt-2 inline-block">
          Ajukan layanan berkas alumni
        </Link>
      </div>
    );
  }

  if (inbox.isPending) return <p className="px-4 py-5 text-[14px] text-muted" role="status">Memuat notifikasi...</p>;
  if (inbox.isError) {
    return (
      <div className="px-4 py-5 text-[14px] text-body" role="alert">
        <p>Notifikasi gagal dimuat.</p>
        <button type="button" className="svc-link mt-2" onClick={() => void inbox.refetch()}>
          Coba lagi
        </button>
      </div>
    );
  }

  const { notifications, requests } = inbox.data;

  return (
    <>
      {requests.length > 0 ? (
        <ul className="divide-y divide-line border-b border-line">
          {requests.slice(0, 3).map((request) => (
            <li key={request.ticket_code} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[14px]">
              <span className="min-w-0">
                <span className="svc-code block font-semibold text-heading">{request.ticket_code}</span>
                <span className="block truncate text-[13px] text-muted">{request.service_type_label}</span>
              </span>
              <span className={`svc-tag ${SERVICE_STATUS_TONE[request.status]}`}>{request.status_label}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {notifications.length === 0 ? (
        <p className="px-4 py-5 text-[14px] text-body">Belum ada notifikasi.</p>
      ) : (
        <ul className="divide-y divide-line">
          {notifications.map((item) => (
            <li key={item.id} className="px-4 py-3">
              <p className="text-[14px] font-semibold text-heading">{item.title}</p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-body">{item.body}</p>
              <p className="mt-1 text-[12px] text-muted">{formatServiceTime(item.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="border-t border-line px-4 py-3">
        <Link href="/layanan-alumni" onClick={onNavigate} className="svc-link text-[14px]">
          Lihat semua pengajuan
        </Link>
      </div>
    </>
  );
}
