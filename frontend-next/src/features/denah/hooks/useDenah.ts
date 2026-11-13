"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi, getRoomDetailApi, getRoomsApi, searchRoomsApi } from "../api/room.api";
import { getRouteApi } from "../api/getRoute.api";
import { denahKeys } from "../constants/query-keys";
import { DEFAULT_DEST_SLUG, DEFAULT_ORIGIN_SLUG, QUICK_SLUGS, roomKey } from "../constants/meta";
import type { DenahRoute, MapRouteRecord, Room, RoomCategory } from "../types/denah.type";

const EMPTY_ROUTE: DenahRoute = { points: [], steps: [], via: [], origin: null, dest: null, originName: null, destName: null, info: null };

// Ubah respons rute menjadi bentuk yang dipakai komponen denah.
function toDenahRoute(data: MapRouteRecord | undefined): DenahRoute {
  if (!data?.path?.length) return EMPTY_ROUTE;
  return {
    points: data.path as DenahRoute["points"],
    steps: data.steps ?? [],
    via: data.via ?? [],
    origin: data.origin?.point ?? data.path[0],
    dest: data.destination?.point ?? data.path[data.path.length - 1],
    originName: data.origin?.name,
    destName: data.destination?.name,
    info: { distance: data.distance, minutes: data.estimated_minutes },
  };
}

/**
 * State & aksi denah interaktif (data ruangan, pilihan, rute + petunjuk arah, zoom).
 * `active`: data baru diambil setelah denah mendekati layar, agar tidak membebani pembukaan halaman.
 */
export default function useDenah({ active = true }: { active?: boolean } = {}) {
  // Permintaan dari SADA bisa datang sebelum denah terlihat; saat itu data langsung dimuat
  const [requested, setRequested] = useState(false);
  const pendingEvent = useRef<{ type: string; detail: unknown } | null>(null);
  const enabled = active || requested;

  // Data dari server dikelola TanStack Query
  const roomsQuery = useQuery({ queryKey: denahKeys.rooms(), queryFn: getRoomsApi, enabled });
  const categoriesQuery = useQuery({
    queryKey: denahKeys.categories(),
    queryFn: () => getCategoriesApi().catch((): RoomCategory[] => []),
    enabled,
  });
  const rooms = useMemo(() => roomsQuery.data ?? [], [roomsQuery.data]);
  const categories = categoriesQuery.data ?? [];

  // Pilihan pengguna (UI state)
  const [activeCategory, setActiveCategory] = useState("semua");
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedSummary, setSelectedSummary] = useState<Room | null>(null);
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  // Pasangan asal-tujuan yang sudah dihitung; rute diambil dari query berdasarkan pasangan ini
  const [committed, setCommitted] = useState<{ from: string; to: string } | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  // Peran klik ruangan di peta: "to" = jadikan tujuan (bawaan), "from" = jadikan titik awal
  const [pickMode, setPickMode] = useState<"from" | "to">("to");
  const [scale, setScale] = useState(1);
  const [initialized, setInitialized] = useState(false);

  const detailQuery = useQuery({
    queryKey: denahKeys.room(selectedKey),
    queryFn: () => getRoomDetailApi(selectedKey),
    enabled: Boolean(selectedKey),
    retry: false,
  });
  // Detail opsional; bila gagal, data ringkas sudah cukup
  const selectedRoom: Room | null =
    detailQuery.data && roomKey(detailQuery.data) === selectedKey ? detailQuery.data : selectedSummary;

  const routeQuery = useQuery({
    queryKey: denahKeys.route(committed?.from ?? "", committed?.to ?? ""),
    queryFn: () => getRouteApi(committed?.from ?? "", committed?.to ?? ""),
    enabled: Boolean(committed),
    retry: false,
  });
  const route = useMemo(() => (committed ? toDenahRoute(routeQuery.data) : EMPTY_ROUTE), [committed, routeQuery.data]);

  const resetRoute = useCallback(() => {
    setCommitted(null);
    setActiveStep(null);
  }, []);

  const calculateRoute = useCallback(
    (from: string, to: string) => {
      if (!from || !to) return;
      if (from === to) {
        resetRoute();
        setRouteError("Lokasi asal dan tujuan tidak boleh sama.");
        return;
      }
      setRouteError(null);
      setActiveStep(null);
      setCommitted({ from, to });
    },
    [resetRoute],
  );

  // Pilih ruangan: jadikan tujuan dan hitung rute dari lokasi asal
  const selectRoom = useCallback(
    (room: Room | null, { withRoute = true }: { withRoute?: boolean } = {}) => {
      if (!room) return;
      const key = roomKey(room);
      setSelectedSummary(room);
      setSelectedKey(key);
      setRouteTo(key);
      if (!withRoute) return;
      if (routeFrom && routeFrom !== key) calculateRoute(routeFrom, key);
      else resetRoute();
    },
    [routeFrom, calculateRoute, resetRoute],
  );

  // Jadikan ruangan titik awal; bila ia sedang jadi tujuan, tujuan dikosongkan agar pengguna memilih yang baru
  const setOrigin = useCallback(
    (room: Room | null) => {
      if (!room) return;
      const key = roomKey(room);
      setPickMode("to");
      setRouteFrom(key);
      setRouteError(null);
      if (routeTo && routeTo !== key) {
        calculateRoute(key, routeTo);
        return;
      }
      setRouteTo("");
      resetRoute();
    },
    [routeTo, calculateRoute, resetRoute],
  );

  // Klik ruangan di peta atau hasil pencarian mengikuti mode pilih yang aktif
  const pickRoom = useCallback(
    (room: Room | null) => {
      if (pickMode === "from") setOrigin(room);
      else selectRoom(room);
    },
    [pickMode, setOrigin, selectRoom],
  );

  // Inisialisasi sekali: asal & tujuan default setelah data ruangan tersedia.
  // Dihitung saat render (bukan di effect) agar tidak memicu render ulang berantai.
  if (!initialized && rooms.length > 0) {
    setInitialized(true);
    const origin = rooms.find((room) => room.slug === DEFAULT_ORIGIN_SLUG) ?? rooms[0];
    const dest = rooms.find((room) => room.slug === DEFAULT_DEST_SLUG) ?? rooms[1] ?? rooms[0];
    if (origin && dest) {
      setRouteFrom(roomKey(origin));
      setSelectedSummary(dest);
      setSelectedKey(roomKey(dest));
      setRouteTo(roomKey(dest));
      calculateRoute(roomKey(origin), roomKey(dest));
    }
  }

  // Integrasi dengan SADA chatbot
  useEffect(() => {
    const scrollToMap = () => document.getElementById("denah")?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Data denah belum dimuat: muat sekarang, permintaan diproses ulang setelah datanya tiba
    const deferUntilLoaded = (event: Event) => {
      if (!roomsQuery.isPending) return false;
      setRequested(true);
      pendingEvent.current = { type: event.type, detail: (event as CustomEvent).detail };
      scrollToMap();
      return true;
    };
    const onSelect = (event: Event) => {
      if (deferUntilLoaded(event)) return;
      const slug = (event as CustomEvent<{ slug?: string }>).detail?.slug;
      const found = rooms.find((room) => room.slug === slug || String(room.id) === String(slug));
      if (found) {
        selectRoom(found);
        scrollToMap();
      }
    };
    const onRoute = (event: Event) => {
      if (deferUntilLoaded(event)) return;
      const { from, to } = (event as CustomEvent<{ from?: string; to?: string }>).detail ?? {};
      if (!from || !to) return;
      setRouteFrom(from);
      setRouteTo(to);
      const dest = rooms.find((room) => room.slug === to);
      if (dest) {
        setSelectedSummary(dest);
        setSelectedKey(roomKey(dest));
      }
      calculateRoute(from, to);
      scrollToMap();
    };
    window.addEventListener("sada:select-room", onSelect);
    window.addEventListener("sada:show-route", onRoute);
    return () => {
      window.removeEventListener("sada:select-room", onSelect);
      window.removeEventListener("sada:show-route", onRoute);
    };
  }, [rooms, roomsQuery.isPending, selectRoom, calculateRoute]);

  // Kirim ulang permintaan SADA yang tertunda setelah data denah tiba (listener di atas sudah memakai data terbaru)
  useEffect(() => {
    const pending = pendingEvent.current;
    if (!pending || roomsQuery.isPending) return;
    pendingEvent.current = null;
    window.dispatchEvent(new CustomEvent(pending.type, { detail: pending.detail }));
  }, [roomsQuery.isPending]);

  const changeRoute = useCallback(
    (type: "from" | "to", value: string) => {
      if (type === "from") {
        setRouteFrom(value);
        setPickMode("to");
      } else setRouteTo(value);
      resetRoute();
      setRouteError(null);
    },
    [resetRoute],
  );

  const showRoute = useCallback(() => {
    const dest = rooms.find((room) => roomKey(room) === routeTo);
    if (dest && roomKey(dest) !== roomKey(selectedRoom)) {
      setSelectedSummary(dest);
      setSelectedKey(roomKey(dest));
    }
    calculateRoute(routeFrom, routeTo);
  }, [rooms, routeFrom, routeTo, selectedRoom, calculateRoute]);

  // Tukar asal & tujuan, lalu hitung ulang bila keduanya terisi
  const swapRoute = useCallback(() => {
    const from = routeTo;
    const to = routeFrom;
    setRouteFrom(from);
    setRouteTo(to);
    const dest = rooms.find((room) => roomKey(room) === to);
    if (dest) {
      setSelectedSummary(dest);
      setSelectedKey(roomKey(dest));
    }
    if (from && to) calculateRoute(from, to);
    else resetRoute();
  }, [rooms, routeFrom, routeTo, calculateRoute, resetRoute]);

  const search = useCallback(
    async (query: string): Promise<Room[]> => {
      const term = query.trim().toLowerCase();
      if (!term) return [];
      try {
        return await searchRoomsApi(term);
      } catch {
        return rooms.filter((room) => room.name.toLowerCase().includes(term));
      }
    },
    [rooms],
  );

  const filteredRooms = useMemo(
    () => (activeCategory === "semua" ? rooms : rooms.filter((room) => room.category?.slug === activeCategory)),
    [rooms, activeCategory],
  );

  const quickRooms = useMemo(
    () =>
      QUICK_SLUGS.map((slug) => rooms.find((room) => room.slug === slug))
        .filter((room): room is Room => Boolean(room))
        .slice(0, 6),
    [rooms],
  );

  const routeErrorMessage =
    routeError ??
    (committed && routeQuery.isError
      ? routeQuery.error instanceof Error && routeQuery.error.message
        ? routeQuery.error.message
        : "Gagal menghitung rute."
      : committed && routeQuery.isSuccess && !routeQuery.data?.path?.length
        ? "Rute tidak ditemukan."
        : null);

  const roomsError = roomsQuery.isError ? "Gagal memuat data denah. Pastikan server API berjalan." : roomsQuery.isSuccess && rooms.length === 0 ? "Data denah belum tersedia." : null;

  return {
    rooms,
    categories,
    activeCategory,
    setActiveCategory,
    filteredRooms,
    quickRooms,
    selectedRoom,
    selectRoom,
    setOrigin,
    pickRoom,
    pickMode,
    setPickMode,
    routeFrom,
    routeTo,
    route,
    changeRoute,
    showRoute,
    swapRoute,
    clearRoute: resetRoute,
    activeStep,
    setActiveStep,
    search,
    scale,
    zoomIn: () => setScale((value) => Math.min(2.5, +(value + 0.25).toFixed(2))),
    zoomOut: () => setScale((value) => Math.max(1, +(value - 0.25).toFixed(2))),
    resetZoom: () => setScale(1),
    status: {
      loading: roomsQuery.isPending,
      routing: committed !== null && routeQuery.isFetching,
      error: roomsError,
      routeError: routeErrorMessage,
    },
  };
}
