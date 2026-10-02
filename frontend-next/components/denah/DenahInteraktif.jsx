"use client";

import { useCallback, useMemo, useRef } from "react";
import { AlertTriangle, MessageCircleQuestion } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { roomKey } from "@/lib/denah/meta";
import CategoryFilter from "./CategoryFilter";
import MapCanvas from "./MapCanvas";
import MapSearch from "./MapSearch";
import QuickLocations from "./QuickLocations";
import RoomDetailPanel from "./RoomDetailPanel";
import RouteSelector from "./RouteSelector";
import useDenah from "./useDenah";

const openChatbot = () => window.dispatchEvent(new CustomEvent("sada:toggle-chatbot", { detail: { open: true } }));

export default function DenahInteraktif() {
  const denah = useDenah();
  const { status, setActiveStep } = denah;
  const mapRef = useRef(null);

  // Pilih langkah: sorot di peta, dan gulir ke peta bila sedang tidak terlihat (mobile)
  const focusStep = useCallback(
    (index) => {
      setActiveStep(index);
      const rect = mapRef.current?.getBoundingClientRect();
      if (rect && (rect.bottom < 80 || rect.top > window.innerHeight - 120)) {
        mapRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [setActiveStep],
  );

  const highlightKeys = useMemo(
    () => (denah.activeCategory === "semua" ? null : new Set(denah.filteredRooms.map(roomKey))),
    [denah.activeCategory, denah.filteredRooms],
  );

  return (
    <section id="denah" className="scroll-mt-24 pb-[72px] sm:pb-24">
      <div className="page-container">
        <div className="rounded-3xl bg-surface px-4 py-10 sm:px-8 sm:py-14 lg:rounded-[36px] lg:px-[42px] lg:py-[72px]">
          <SectionHeader
            title="Denah Interaktif"
            description="Jelajahi denah sekolah kami dan temukan berbagai ruang serta fasilitas dengan mudah."
          />

          {status.error ? (
            <p role="alert" className="mb-5 flex items-center gap-2 rounded-xl bg-[#fff7ed] px-4 py-3 text-sm text-[#9a3412]">
              <AlertTriangle size={16} className="shrink-0" aria-hidden="true" />
              {status.error}
            </p>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-2xl bg-white p-4 sm:p-5">
              <div className="grid gap-4 lg:grid-cols-[132px_minmax(0,1fr)] lg:gap-5">
                <CategoryFilter categories={denah.categories} active={denah.activeCategory} onChange={denah.setActiveCategory} />
                <div ref={mapRef} className="min-w-0 space-y-3">
                  <MapSearch onSearch={denah.search} onSelect={denah.selectRoom} />
                  <MapCanvas
                    rooms={denah.rooms}
                    highlightRooms={highlightKeys}
                    selectedRoom={denah.selectedRoom}
                    originKey={denah.routeFrom}
                    onSelect={denah.selectRoom}
                    route={denah.route}
                    activeStep={denah.activeStep}
                    onStepClick={focusStep}
                    scale={denah.scale}
                    onZoomIn={denah.zoomIn}
                    onZoomOut={denah.zoomOut}
                    onResetZoom={denah.resetZoom}
                    loading={status.loading}
                  />
                </div>
              </div>
            </div>

            <RoomDetailPanel key={roomKey(denah.selectedRoom)} room={denah.selectedRoom} />
          </div>

          <div className="mt-4">
            <RouteSelector
              rooms={denah.rooms}
              from={denah.routeFrom}
              to={denah.routeTo}
              onChange={denah.changeRoute}
              onSubmit={denah.showRoute}
              onSwap={denah.swapRoute}
              onClear={denah.clearRoute}
              route={denah.route}
              routing={status.routing}
              error={status.routeError}
              activeStep={denah.activeStep}
              onStepSelect={focusStep}
              onPrevStep={() => focusStep(denah.activeStep === null ? 0 : Math.max(0, denah.activeStep - 1))}
              onNextStep={() => focusStep(denah.activeStep === null ? 0 : Math.min(denah.route.steps.length - 1, denah.activeStep + 1))}
            />
          </div>

          {denah.quickRooms.length ? (
            <div className="mt-4">
              <QuickLocations
                rooms={denah.quickRooms}
                selectedKey={roomKey(denah.selectedRoom)}
                onSelect={denah.selectRoom}
                onShowAll={() => {
                  denah.setActiveCategory("semua");
                  document.getElementById("denah")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white/70 px-4 py-3.5 text-sm text-[#475569] sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-ink">Butuh bantuan menemukan lokasi?</span> Kami siap membantumu menemukan ruang atau
              fasilitas yang kamu cari.
            </p>
            <button
              type="button"
              onClick={openChatbot}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2 font-semibold text-[#0b3b8c] transition-colors hover:bg-[#eff6ff]"
            >
              <MessageCircleQuestion size={16} aria-hidden="true" />
              Tanya SADA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
