"use client";

import { useEffect, useMemo, useRef } from "react";
import { Loader2, Move } from "lucide-react";
import { roomKey } from "@/lib/denah/meta";
import HotspotLayer from "./HotspotLayer";
import MarkerLayer from "./MarkerLayer";
import MapZoomControls from "./MapZoomControls";
import RouteLayer, { stepSegment } from "./RouteLayer";

/** Geser pandangan ke titik (persen) bila peta lebih besar dari kotak pandang. */
function scrollToPoint(viewport, canvas, x, y) {
  if (!viewport || !canvas) return;
  if (canvas.offsetWidth <= viewport.clientWidth && canvas.offsetHeight <= viewport.clientHeight) return;
  viewport.scrollTo({
    left: (x / 100) * canvas.offsetWidth - viewport.clientWidth / 2,
    top: (y / 100) * canvas.offsetHeight - viewport.clientHeight / 2,
    behavior: "smooth",
  });
}

/**
 * Peta denah: kotak pandang tetap (rasio 1024:584), isi bisa diperbesar
 * dan digeser. Di mobile peta selebar 640px agar ruangan tetap bisa diklik.
 */
export default function MapCanvas({
  rooms,
  highlightRooms,
  selectedRoom,
  originKey,
  onSelect,
  route,
  activeStep,
  onStepClick,
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  loading,
}) {
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);

  const activeSegment = useMemo(
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
      <div className="relative">
        <div
          ref={viewportRef}
          className="relative h-[366px] overflow-auto overscroll-contain rounded-2xl border border-[#e2e8f0] bg-[#f1f5f9] [scrollbar-width:thin] sm:h-auto sm:aspect-[1024/584]"
        >
          <div
            ref={canvasRef}
            className="relative aspect-[1024/584] w-[calc(var(--z)*100%)] min-w-[calc(var(--z)*640px)] transition-[width,min-width] duration-300 sm:min-w-0"
            style={{ "--z": scale }}
          >
            <img
              src="/denah-map.webp"
              alt="Denah SMK Negeri 2 Kota Mojokerto"
              draggable={false}
              fetchPriority="high"
              decoding="async"
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
            />
            <RouteLayer points={route.points} activeSegment={activeSegment} />
            <HotspotLayer
              rooms={rooms}
              highlightKeys={highlightRooms}
              selectedKey={roomKey(selectedRoom)}
              originKey={route.points.length ? originKey : null}
              onSelect={onSelect}
            />
            <MarkerLayer origin={route.origin} dest={route.dest} steps={route.steps} activeStep={activeStep} onStepClick={onStepClick} />
          </div>
        </div>

        <MapZoomControls scale={scale} onZoomIn={onZoomIn} onZoomOut={onZoomOut} onReset={onResetZoom} />

        {route.info ? (
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
            className="pointer-events-none absolute bottom-3 left-3 z-30 flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white/95 px-3 py-1.5 text-xs font-medium text-ink shadow-sm"
          >
            <Loader2 size={14} className="animate-spin text-blue" aria-hidden="true" />
            Memuat data ruangan...
          </span>
        ) : null}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-[#64748b] sm:hidden">
        <Move size={13} aria-hidden="true" />
        Geser peta untuk melihat area lain, ketuk ruangan untuk detailnya.
      </p>
    </div>
  );
}
