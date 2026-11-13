"use client";

import { useState } from "react";
import { GuestMessageForm } from "./GuestMessageForm";
import { GuestVisitForm } from "./GuestVisitForm";

const TABS = [
  { id: "pesan", label: "Kirim pesan", hint: "Pertanyaan, saran, atau keperluan lain untuk sekolah. TU membalas lewat email atau WhatsApp." },
  { id: "kunjungan", label: "Jadwalkan kunjungan", hint: "Untuk tamu dari instansi atau perusahaan yang akan datang ke sekolah." },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Isi halaman /buku-tamu: pilih kirim pesan atau jadwalkan kunjungan, lalu isi form-nya. */
export function BukuTamuView() {
  const [tab, setTab] = useState<TabId>("pesan");
  const active = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <>
      <header className="max-w-[760px]">
        <h1 className="text-3xl font-bold text-heading sm:text-[34px]">Buku Tamu</h1>
        <p className="mt-3 text-base leading-relaxed text-body">Kirim pesan ke Tata Usaha SMKN 2 Kota Mojokerto atau ajukan jadwal kunjungan instansi.</p>
      </header>

      <div className="mt-8 max-w-[860px]">
        <div role="group" aria-label="Jenis buku tamu" className="flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="svc-chip"
              aria-pressed={tab === item.id}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <section aria-label={active.label} className="mt-4 rounded-2xl border border-line bg-card px-5 py-6 sm:px-8 sm:py-8">
          <p className="mb-6 text-[15px] leading-relaxed text-muted">{active.hint}</p>
          {active.id === "pesan" ? <GuestMessageForm /> : <GuestVisitForm />}
        </section>
      </div>
    </>
  );
}
