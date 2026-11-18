"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";
import { AlertTriangle, ArrowUpRight, Box, MessageCircleQuestion } from "lucide-react";
import SectionHeader from "@/shared/components/ui/SectionHeader";
import { useNearViewport } from "@/shared/hooks/useNearViewport";
import { roomKey } from "../constants/meta";
import useDenah from "../hooks/useDenah";
import CategoryFilter from "./CategoryFilter";
import MapCanvas from "./MapCanvas";
import MapSearch from "./MapSearch";
import QuickLocations from "./QuickLocations";
import RoomDetailPanel from "./RoomDetailPanel";
import RouteSelector from "./RouteSelector";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { OrnamentRoute } from "@/shared/components/ui/Ornaments";

const openChatbot = () => window.dispatchEvent(new CustomEvent("sada:toggle-chatbot", { detail: { open: true } }));

export default function DenahInteraktif() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  // Data denah diambil saat pengguna menggulir mendekati section ini, bukan saat halaman dibuka
  const denah = useDenah({ active: useNearViewport(sectionRef) });
  const { status, setActiveStep, pickMode, setPickMode } = denah;
  const mapRef = useRef<HTMLDivElement>(null);

  // Gulir ke peta bila sedang tidak terlihat (mobile)
  const revealMap = useCallback(() => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect && mapRef.current && (rect.bottom < 80 || rect.top > window.innerHeight - 120)) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // Pilih langkah: sorot di peta
  const focusStep = useCallback(
    (index: number) => {
      setActiveStep(index);
      revealMap();
    },
    [setActiveStep, revealMap],
  );

  // "Pilih di peta" pada kolom Dari: klik ruangan berikutnya menjadi titik awal
  const togglePickFrom = useCallback(() => {
    if (pickMode === "from") {
      setPickMode("to");
      return;
    }
    setPickMode("from");
    revealMap();
  }, [pickMode, setPickMode, revealMap]);

  const highlightKeys = useMemo(
    () => (denah.activeCategory === "semua" ? null : new Set(denah.filteredRooms.map(roomKey))),
    [denah.activeCategory, denah.filteredRooms],
  );

  return (
    <section ref={sectionRef} id="denah" className="scroll-mt-24 pb-[72px] sm:pb-24">
      <div className="page-container">
        <div className="relative rounded-3xl bg-surface px-4 py-10 sm:px-8 sm:py-14 lg:rounded-[36px] lg:px-[42px] lg:py-[72px]">
          <SectionHeader title="Denah Interaktif" description="Jelajahi denah sekolah kami dan temukan berbagai ruang serta fasilitas dengan mudah." />
          <OrnamentRoute className="absolute top-12 left-10 hidden w-36 text-tint-strong lg:block xl:left-14 xl:w-40" />

          {status.error ? (
            <p role="alert" className="mb-5 flex items-center gap-2 rounded-xl bg-[#fff7ed] px-4 py-3 text-sm text-[#9a3412] dark:bg-orange-400/15 dark:text-orange-200">
              <AlertTriangle size={16} className="shrink-0" aria-hidden="true" />
              {t(status.error)}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* Kategori & pencarian di atas peta agar peta memakai seluruh lebar kartu */}
            <div className="min-w-0 space-y-3 rounded-2xl bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--color-tint)] px-4 py-3">
                <p className="flex items-center gap-2 text-sm text-ink">
                  <Box size={16} className="shrink-0 text-navy-ink" aria-hidden="true" />
                  {t("Coba jelajahi sekolah dalam tampilan 3D.")}
                </p>
                <Link
                  href="/kota"
                  className="flex shrink-0 items-center gap-1.5 rounded-xl bg-navy-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {t("Buka Peta 3D")}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <CategoryFilter categories={denah.categories} active={denah.activeCategory} onChange={denah.setActiveCategory} />
              <div ref={mapRef} className="space-y-3">
                <MapSearch onSearch={denah.search} onSelect={denah.pickRoom} />
                <MapCanvas
                  rooms={denah.rooms}
                  highlightRooms={highlightKeys}
                  selectedRoom={denah.selectedRoom}
                  originKey={denah.routeFrom}
                  pickMode={pickMode}
                  awaitingDest={Boolean(denah.routeFrom) && !denah.routeTo}
                  onCancelPick={() => setPickMode("to")}
                  onSelect={denah.pickRoom}
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

            <RoomDetailPanel
              key={roomKey(denah.selectedRoom)}
              room={denah.selectedRoom}
              isOrigin={Boolean(denah.routeFrom) && roomKey(denah.selectedRoom) === denah.routeFrom}
              onSetOrigin={denah.setOrigin}
            />
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
              pickingFrom={pickMode === "from"}
              onPickFrom={togglePickFrom}
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

          <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-card/70 px-4 py-3.5 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-ink">{t("Butuh bantuan menemukan lokasi?")}</span>{" "}
              {t("Kami siap membantumu menemukan ruang atau fasilitas yang kamu cari.")}
            </p>
            <button
              type="button"
              onClick={openChatbot}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] bg-card px-4 py-2 font-semibold text-navy-ink transition-colors hover:bg-[var(--color-tint)]"
            >
              <MessageCircleQuestion size={16} aria-hidden="true" />
              {t("Tanya SADA")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
