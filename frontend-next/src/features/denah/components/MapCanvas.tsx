"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { Loader2, MousePointerClick, Move, X } from "lucide-react";
import { roomKey } from "../constants/meta";
import type { DenahRoute, Room, RoutePoint } from "../types/denah.type";
import HotspotLayer from "./HotspotLayer";
import MarkerLayer from "./MarkerLayer";
import MapZoomControls from "./MapZoomControls";
import RouteLayer, { stepSegment } from "./RouteLayer";
import { useTranslation } from "@/shared/hooks/useTranslation";

// Gambar denah 1540x752; 104px teratas (judul, logo, kompas) disembunyikan.
// Koordinat hotspot & rute tetap persen gambar utuh.
const MAP_W = 1540;
const MAP_H = 752;
const CROP_TOP = 104;

/** Geser pandangan ke titik (persen gambar utuh) bila peta lebih besar dari kotak pandang. */
function scrollToPoint(viewport: HTMLDivElement | null, canvas: HTMLDivElement | null, x: number, y: number) {
  if (!viewport || !canvas) return;
  if (canvas.offsetWidth <= viewport.clientWidth && canvas.offsetHeight <= viewport.clientHeight) return;
  const px = canvas.offsetWidth / MAP_W;
  viewport.scrollTo({
    left: (x / 100) * canvas.offsetWidth - viewport.clientWidth / 2,
    top: ((y / 100) * MAP_H - CROP_TOP) * px - viewport.clientHeight / 2,
    behavior: "smooth",
  });
}

interface MapCanvasProps {
  rooms: Room[];
  highlightRooms: Set<string> | null;
  selectedRoom: Room | null;
  originKey: string;
  pickMode: "from" | "to";
  awaitingDest: boolean;
  onCancelPick: () => void;
  onSelect: (room: Room) => void;
  route: DenahRoute;
  activeStep: number | null;
  onStepClick: (index: number) => void;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  loading: boolean;
}

/**
 * Peta denah: kotak pandang tetap (rasio 1540:648 setelah header dipotong),
 * isi bisa diperbesar dan digeser. Di mobile peta selebar 750px agar ruangan
 * tetap bisa diklik.
 */
export default function MapCanvas({
  rooms,
  highlightRooms,
  selectedRoom,
  originKey,
  pickMode,
  awaitingDest,
  onCancelPick,
  onSelect,
  route,
  activeStep,
  onStepClick,
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  loading,
}: MapCanvasProps) {
  const { t } = useTranslation();
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const activeSegment = useMemo<RoutePoint[]>(
    () => (activeStep === null ? [] : stepSegment(route.points, route.steps, activeStep)),
    [route.points, route.steps, activeStep],
  );

  useEffect(() => {
    const spot = selectedRoom?.hotspot;
    if (spot) scrollToPoint(viewportRef.current, canvasRef.current, spot.x + spot.width / 2, spot.y + spot.height / 2);
  }, [selectedRoom, scale]);

  useEffect(() => {
    const step = activeStep === null ? null : route.steps[activeStep];
    if (step?.point) scrollToPoint(viewportRef.current, canvasRef.current, step.point.x, step.point.y);
  }, [activeStep, route.steps, scale]);

  return (
    <div>
      {/* Border di pembungkus agar kotak pandang persis seukuran peta (tanpa scrollbar sisa 1px) */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface-alt)]">
        <div
          ref={viewportRef}
          className="relative h-[316px] overflow-auto overscroll-contain [scrollbar-width:thin] sm:h-auto sm:aspect-[1540/648]"
        >
          <div
            ref={canvasRef}
            className="relative aspect-[1540/648] w-[calc(var(--z)*100%)] min-w-[calc(var(--z)*750px)] overflow-hidden transition-[width,min-width] duration-300 sm:min-w-0"
            style={{ "--z": scale } as CSSProperties}
          >
            {/* Margin persen dihitung dari lebar, jadi header terpotong tepat CROP_TOP px gambar */}
            <div className="relative aspect-[1540/752] w-full" style={{ marginTop: `${(-CROP_TOP / MAP_W) * 100}%` }}>
              <Image
                src="/denah-2026.webp"
                alt={t("Denah SMK Negeri 2 Kota Mojokerto")}
                fill
                priority
                sizes="(min-width: 1024px) 760px, 100vw"
                draggable={false}
                className="pointer-events-none select-none object-fill"
              />
              <RouteLayer points={route.points} activeSegment={activeSegment} />
              <HotspotLayer
                rooms={rooms}
                highlightKeys={highlightRooms}
                selectedKey={roomKey(selectedRoom)}
                originKey={originKey}
                onSelect={onSelect}
              />
              <MarkerLayer origin={route.origin} dest={route.dest} steps={route.steps} activeStep={activeStep} onStepClick={onStepClick} />
            </div>
          </div>
        </div>

        <MapZoomControls scale={scale} onZoomIn={onZoomIn} onZoomOut={onZoomOut} onReset={onResetZoom} />

        {/* Petunjuk saat memilih titik awal / tujuan lewat peta; menggantikan legenda sementara */}
        {pickMode === "from" || awaitingDest ? (
          <div
            role="status"
            className={`absolute top-3 left-1/2 z-30 flex max-w-[calc(100%-24px)] -translate-x-1/2 items-center gap-2 rounded-full bg-[var(--color-navy)] py-1.5 pl-3.5 text-xs font-semibold text-white shadow-md ${pickMode === "from" ? "pr-1.5" : "pr-3.5"}`}
          >
            <MousePointerClick size={14} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{t(pickMode === "from" ? "Ketuk ruangan untuk dijadikan titik awal" : "Titik awal dipilih, sekarang ketuk ruangan tujuan")}</span>
            {pickMode === "from" ? (
              <button
                type="button"
                onClick={onCancelPick}
                aria-label={t("Batal pilih titik awal")}
                className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
              >
                <X size={13} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        ) : route.info ? (
          <div className="pointer-events-none absolute top-3 left-3 z-30 flex flex-wrap gap-1.5 text-[11px] font-semibold sm:text-xs">
            <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[#166534] shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-[#16a34a] bg-white" aria-hidden="true" />
              Asal
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[#b91c1c] shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#dc2626]" aria-hidden="true" />
              Tujuan
            </span>
          </div>
        ) : null}

        {/* Peta tetap terlihat; hanya data ruangan yang sedang dimuat */}
        {loading ? (
          <span
            role="status"
            className="pointer-events-none absolute bottom-3 left-3 z-30 flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/95 px-3 py-1.5 text-xs font-medium text-ink shadow-sm"
          >
            <Loader2 size={14} className="animate-spin text-blue" aria-hidden="true" />
            {t("Memuat data ruangan...")}
          </span>
        ) : null}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-muted)] sm:hidden">
        <Move size={13} aria-hidden="true" />
        {t("Geser peta untuk melihat area lain, ketuk ruangan untuk detailnya.")}
      </p>
    </div>
  );
}
