"use client";

import { useDeviceInbox } from "@/shared/hooks/useDeviceInbox";
import { useDeviceToken } from "@/shared/hooks/useDeviceToken";
import { formatServiceTime, SERVICE_STATUS_TONE } from "@/shared/utils/service-status";
import { PushNotificationToggle } from "./PushNotificationToggle";

/** Pengajuan dari perangkat ini saja (token localStorage), diperbarui tiap 30 detik. */
export function MyServiceRequests() {
  const token = useDeviceToken();
  const inbox = useDeviceInbox();

  return (
    <section className="svc-card" aria-labelledby="judul-pengajuan-saya">
      <div className="border-b border-line px-5 py-4">
        <h2 id="judul-pengajuan-saya" className="text-[17px] font-semibold text-heading">
          Pengajuan dari perangkat ini
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">Tidak perlu login. Status tersimpan di browser HP ini.</p>
      </div>

      <div className="px-5 py-4">
        <RequestList hasToken={Boolean(token)} inbox={inbox} />
      </div>

      <div className="border-t border-line px-5 py-4">
        <h3 className="mb-2 text-[15px] font-semibold text-heading">Notifikasi HP</h3>
        <PushNotificationToggle />
      </div>
    </section>
  );
}

function RequestList({ hasToken, inbox }: { hasToken: boolean; inbox: ReturnType<typeof useDeviceInbox> }) {
  if (!hasToken) return <p className="text-[14px] text-body">Belum ada pengajuan dari perangkat ini.</p>;
  if (inbox.isPending) return <p className="text-[14px] text-muted" role="status">Memuat pengajuan...</p>;
  if (inbox.isError) {
    return (
      <div role="alert" className="text-[14px] text-body">
        <p>Daftar pengajuan gagal dimuat.</p>
        <button type="button" className="svc-link mt-1" onClick={() => void inbox.refetch()}>
          Coba lagi
        </button>
      </div>
    );
  }

  const requests = inbox.data.requests;
  if (requests.length === 0) return <p className="text-[14px] text-body">Belum ada pengajuan dari perangkat ini.</p>;

  return (
    <ul className="grid gap-3">
      {requests.map((request) => (
        <li key={request.ticket_code} className="rounded-md border border-line px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="svc-code font-semibold text-heading">{request.ticket_code}</span>
            <span className={`svc-tag ${SERVICE_STATUS_TONE[request.status]}`}>{request.status_label}</span>
          </div>
          <p className="mt-1 text-[14px] text-body">
            {request.service_type_label} · {request.class_name}
          </p>
          {request.admin_note ? <p className="mt-1.5 text-[14px] leading-relaxed text-body">Catatan TU: {request.admin_note}</p> : null}
          <p className="mt-1 text-[12px] text-muted">Diajukan {formatServiceTime(request.created_at)}</p>
        </li>
      ))}
    </ul>
  );
}
