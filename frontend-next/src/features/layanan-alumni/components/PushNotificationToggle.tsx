"use client";

import { usePushState, useTogglePush } from "../hooks/useAlumniServicePublic";

/**
 * Tombol izin notifikasi HP. Saat TU menyetujui pengajuan, pesan muncul di bar notifikasi
 * HP walau situs tidak sedang dibuka. Butuh HTTPS dan browser yang mendukung Web Push.
 */
export function PushNotificationToggle() {
  const state = usePushState();
  const toggle = useTogglePush();
  const current = toggle.data ?? state.data;
  const failure = toggle.error instanceof Error ? toggle.error.message : null;

  if (state.isPending) return <p className="text-[14px] text-muted">Memeriksa dukungan notifikasi...</p>;

  if (current === "unsupported") {
    return <p className="text-[14px] leading-relaxed text-body">Browser ini belum mendukung notifikasi HP. Status tetap bisa dilihat lewat ikon lonceng di pojok kanan atas.</p>;
  }

  if (current === "denied") {
    return (
      <p className="text-[14px] leading-relaxed text-body">
        Izin notifikasi diblokir. Buka pengaturan situs di browser, izinkan notifikasi, lalu muat ulang halaman ini.
      </p>
    );
  }

  const on = current === "on";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={`svc-btn ${on ? "" : "svc-btn--primary"}`} onClick={() => toggle.mutate(!on)} disabled={toggle.isPending}>
          {toggle.isPending ? "Memproses..." : on ? "Matikan notifikasi HP" : "Aktifkan notifikasi HP"}
        </button>
        {on ? <span className="svc-tag svc-tag--ok">Notifikasi aktif</span> : null}
      </div>
      <p className="mt-2 text-[13px] text-muted">{on ? "Pesan dari TU akan muncul di bar notifikasi HP ini." : "Dapatkan pemberitahuan di HP saat pengajuan disetujui."}</p>
      {failure ? (
        <p role="alert" className="svc-error">
          {failure}
        </p>
      ) : null}
    </div>
  );
}
