"use client";

import { useId, useMemo, type ReactNode } from "react";
import { ArrowLeftRight, Crosshair, Footprints, Loader2, MapPin, Navigation, Square, X, type LucideIcon } from "lucide-react";
import Select, { type SelectOption } from "@/shared/components/ui/Select";
import { CATEGORY_ORDER, roomKey } from "../constants/meta";
import type { DenahRoute, Room } from "../types/denah.type";
import RouteDirections from "./RouteDirections";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { roomText } from "../utils/room-text";

interface RoomPickerProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  action?: ReactNode;
}

function RoomPicker({ label, icon, value, onChange, options, action }: RoomPickerProps): ReactNode {
  const labelId = useId();
  return (
    <div className="block min-w-0 flex-1">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span id={labelId} className="text-xs text-[var(--color-muted)]">
          {label}
        </span>
        {action}
      </div>
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

interface RouteSelectorProps {
  rooms: Room[];
  from: string;
  to: string;
  onChange: (type: "from" | "to", value: string) => void;
  onSubmit: () => void;
  onSwap: () => void;
  onClear: () => void;
  pickingFrom: boolean;
  onPickFrom: () => void;
  route: DenahRoute;
  routing: boolean;
  error: string | null;
  activeStep: number | null;
  onStepSelect: (index: number) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
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
  pickingFrom,
  onPickFrom,
  route,
  routing,
  error,
  activeStep,
  onStepSelect,
  onPrevStep,
  onNextStep,
}: RouteSelectorProps) {
  const { t } = useTranslation();
  // Opsi dikelompokkan per kategori ruangan agar mudah dicari
  const options = useMemo<SelectOption[]>(() => {
    const rank = (room: Room) => {
      const index = CATEGORY_ORDER.indexOf(room.category?.slug ?? "");
      return index === -1 ? CATEGORY_ORDER.length : index;
    };
    return [...rooms]
      .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, "id"))
      .map((room) => ({
        value: roomKey(room),
        label: roomText(t, room.name),
        description: room.building_name ?? undefined,
        group: room.category?.name ?? "Lainnya",
      }));
  }, [rooms, t]);

  return (
    <section className="rounded-2xl bg-card p-4 sm:p-5 lg:px-6">
      <div className="grid gap-4 lg:grid-cols-[180px_1fr_auto] lg:items-end lg:gap-5">
        <h3 className="flex items-center gap-2 text-base font-semibold text-ink lg:pb-3.5">
          <Navigation size={16} className="text-blue" aria-hidden="true" />
          {t("Cari rute ke ruangan")}
        </h3>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
          <RoomPicker
            label={t("Dari")}
            icon={Square}
            value={from}
            onChange={(value) => onChange("from", value)}
            options={options}
            action={
              <button
                type="button"
                onClick={onPickFrom}
                aria-pressed={pickingFrom}
                className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue hover:underline"
              >
                <Crosshair size={13} aria-hidden="true" />
                {t(pickingFrom ? "Batal pilih" : "Pilih di peta")}
              </button>
            }
          />
          <button
            type="button"
            onClick={onSwap}
            disabled={!from && !to}
            aria-label={t("Tukar lokasi asal dan tujuan")}
            title={t("Tukar asal & tujuan")}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center self-center rounded-full border border-[var(--color-line)] text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-40 sm:mb-1 sm:self-end"
          >
            <ArrowLeftRight size={16} className="rotate-90 sm:rotate-0" aria-hidden="true" />
          </button>
          <RoomPicker label={t("Tujuan")} icon={MapPin} value={to} onChange={(value) => onChange("to", value)} options={options} />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={routing || !from || !to}
            className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-navy)] px-6 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[var(--color-navy)] disabled:cursor-not-allowed disabled:opacity-60 lg:flex-none"
          >
            {routing ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Navigation size={16} aria-hidden="true" />}
            {t(routing ? "Menghitung..." : "Tampilkan Rute")}
          </button>
          {route.points.length ? (
            <button
              type="button"
              onClick={onClear}
              aria-label={t("Hapus rute")}
              title={t("Hapus rute")}
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[var(--color-line)] text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-alt)]"
            >
              <X size={18} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-[#fef2f2] px-4 py-2.5 text-sm text-[#b91c1c] dark:bg-red-950/40 dark:text-red-200">
          <Footprints size={16} className="shrink-0" aria-hidden="true" />
          {t(error)}
        </p>
      ) : null}

      {route.info && route.steps.length ? (
        <RouteDirections route={route} activeStep={activeStep} onSelect={onStepSelect} onPrev={onPrevStep} onNext={onNextStep} />
      ) : null}
    </section>
  );
}
