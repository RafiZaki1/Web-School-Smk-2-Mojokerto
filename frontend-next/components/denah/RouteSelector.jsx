"use client";

import { useId, useMemo } from "react";
import { ArrowLeftRight, Footprints, Loader2, MapPin, Navigation, Square, X } from "lucide-react";
import Select from "@/components/ui/Select";
import { CATEGORY_ORDER, roomKey } from "@/lib/denah/meta";
import RouteDirections from "./RouteDirections";

function RoomPicker({ label, icon, value, onChange, options }) {
  const labelId = useId();
  return (
    <div className="block min-w-0 flex-1">
      <span id={labelId} className="mb-1.5 block text-xs text-[#64748b]">
        {label}
      </span>
      <Select
        aria-labelledby={labelId}
        icon={icon}
        value={value}
        onChange={onChange}
        options={options}
        placeholder="Pilih lokasi"
        searchable
        searchPlaceholder="Cari ruangan..."
        emptyText="Ruangan tidak ditemukan."
        className="[--select-h:48px] [--select-radius:12px]"
      />
    </div>
  );
}

/** Bar "Cari rute ke ruangan": asal, tujuan, tombol, lalu petunjuk arah langkah demi langkah. */
export default function RouteSelector({
  rooms,
  from,
  to,
  onChange,
  onSubmit,
  onSwap,
  onClear,
  route,
  routing,
  error,
  activeStep,
  onStepSelect,
  onPrevStep,
  onNextStep,
}) {
  // Opsi dikelompokkan per kategori ruangan agar mudah dicari
  const options = useMemo(() => {
    const rank = (room) => {
      const index = CATEGORY_ORDER.indexOf(room.category?.slug);
      return index === -1 ? CATEGORY_ORDER.length : index;
    };
    return [...rooms]
      .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, "id"))
      .map((room) => ({
        value: roomKey(room),
        label: room.name,
        description: room.building_name,
        group: room.category?.name ?? "Lainnya",
      }));
  }, [rooms]);

  return (
    <section className="rounded-2xl bg-white p-4 sm:p-5 lg:px-6">
      <div className="grid gap-4 lg:grid-cols-[180px_1fr_auto] lg:items-end lg:gap-5">
        <h3 className="flex items-center gap-2 text-base font-semibold text-ink lg:pb-3.5">
          <Navigation size={16} className="text-blue" aria-hidden="true" />
          Cari rute ke ruangan
        </h3>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
          <RoomPicker label="Dari" icon={Square} value={from} onChange={(value) => onChange("from", value)} options={options} />
          <button
            type="button"
            onClick={onSwap}
            disabled={!from && !to}
            aria-label="Tukar lokasi asal dan tujuan"
            title="Tukar asal & tujuan"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center self-center rounded-full border border-[#e2e8f0] text-[#475569] transition-colors hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-40 sm:mb-1 sm:self-end"
          >
            <ArrowLeftRight size={16} className="rotate-90 sm:rotate-0" aria-hidden="true" />
          </button>
          <RoomPicker label="Tujuan" icon={MapPin} value={to} onChange={(value) => onChange("to", value)} options={options} />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={routing || !from || !to}
            className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0b3b8c] px-6 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#0a3278] disabled:cursor-not-allowed disabled:opacity-60 lg:flex-none"
          >
            {routing ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Navigation size={16} aria-hidden="true" />}
            {routing ? "Menghitung..." : "Tampilkan Rute"}
          </button>
          {route.points.length ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Hapus rute"
              title="Hapus rute"
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#e2e8f0] text-[#475569] transition-colors hover:bg-[#f1f5f9]"
            >
              <X size={18} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-[#fef2f2] px-4 py-2.5 text-sm text-[#b91c1c]">
          <Footprints size={16} className="shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {route.info && route.steps.length ? (
        <RouteDirections route={route} activeStep={activeStep} onSelect={onStepSelect} onPrev={onPrevStep} onNext={onNextStep} />
      ) : null}
    </section>
  );
}
