"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { roomApi } from "@/lib/api/roomApi";
import { routeApi } from "@/lib/api/routeApi";
import { DEFAULT_DEST_SLUG, DEFAULT_ORIGIN_SLUG, QUICK_SLUGS, roomKey } from "@/lib/denah/meta";

const EMPTY_ROUTE = { points: [], steps: [], via: [], origin: null, dest: null, info: null };

/** State & aksi denah interaktif (data ruangan, pilihan, rute + petunjuk arah, zoom). */
export default function useDenah() {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("semua");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [route, setRoute] = useState(EMPTY_ROUTE);
  const [activeStep, setActiveStep] = useState(null);
  const [scale, setScale] = useState(1);
  const [status, setStatus] = useState({ loading: true, routing: false, error: null, routeError: null });
  const requestRef = useRef(0);

  const resetRoute = useCallback(() => {
    setRoute(EMPTY_ROUTE);
    setActiveStep(null);
  }, []);

  const calculateRoute = useCallback(
    async (from, to) => {
      if (!from || !to) return;
      if (from === to) {
        resetRoute();
        setStatus((prev) => ({ ...prev, routeError: "Lokasi asal dan tujuan tidak boleh sama." }));
        return;
      }

      const requestId = ++requestRef.current;
      setStatus((prev) => ({ ...prev, routing: true, routeError: null }));
      try {
        const data = await routeApi.getRoute(from, to);
        if (requestId !== requestRef.current) return;
        if (data?.path?.length) {
          setRoute({
            points: data.path,
            steps: data.steps ?? [],
            via: data.via ?? [],
            origin: data.origin?.point ?? data.path[0],
            dest: data.destination?.point ?? data.path[data.path.length - 1],
            originName: data.origin?.name,
            destName: data.destination?.name,
            info: { distance: data.distance, minutes: data.estimated_minutes },
          });
          setActiveStep(null);
        } else {
          resetRoute();
          setStatus((prev) => ({ ...prev, routeError: "Rute tidak ditemukan." }));
        }
      } catch (error) {
        if (requestId !== requestRef.current) return;
        resetRoute();
        setStatus((prev) => ({ ...prev, routeError: error.message || "Gagal menghitung rute." }));
      } finally {
        if (requestId === requestRef.current) setStatus((prev) => ({ ...prev, routing: false }));
      }
    },
    [resetRoute],
  );

  const loadDetail = useCallback(async (room) => {
    try {
      const detail = await roomApi.getRoomDetail(roomKey(room));
      if (detail) setSelectedRoom((current) => (roomKey(current) === roomKey(detail) ? detail : current));
    } catch {
      // detail opsional; data ringkas sudah cukup
    }
  }, []);

  // Pilih ruangan: jadikan tujuan dan hitung rute dari lokasi asal
  const selectRoom = useCallback(
    (room, { withRoute = true } = {}) => {
      if (!room) return;
      const key = roomKey(room);
      setSelectedRoom(room);
      setRouteTo(key);
      loadDetail(room);
      if (!withRoute) return;
      if (routeFrom && routeFrom !== key) calculateRoute(routeFrom, key);
      else resetRoute();
    },
    [routeFrom, calculateRoute, loadDetail, resetRoute],
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [cats, list] = await Promise.all([roomApi.getCategories().catch(() => []), roomApi.getRooms()]);
        if (!active) return;
        setCategories(cats);
        setRooms(list);
        const origin = list.find((room) => room.slug === DEFAULT_ORIGIN_SLUG) ?? list[0];
        const dest = list.find((room) => room.slug === DEFAULT_DEST_SLUG) ?? list[1] ?? list[0];
        if (origin && dest) {
          setRouteFrom(roomKey(origin));
          setSelectedRoom(dest);
          setRouteTo(roomKey(dest));
          loadDetail(dest);
          calculateRoute(roomKey(origin), roomKey(dest));
        }
        setStatus((prev) => ({ ...prev, loading: false, error: list.length ? null : "Data denah belum tersedia." }));
      } catch {
        if (active) setStatus((prev) => ({ ...prev, loading: false, error: "Gagal memuat data denah. Pastikan server API berjalan." }));
      }
    })();
    return () => {
      active = false;
    };
  }, [calculateRoute, loadDetail]);

  // Integrasi dengan SADA chatbot
  useEffect(() => {
    const scrollToMap = () => document.getElementById("denah")?.scrollIntoView({ behavior: "smooth", block: "start" });
    const onSelect = (event) => {
      const slug = event.detail?.slug;
      const found = rooms.find((room) => room.slug === slug || String(room.id) === String(slug));
      if (found) {
        selectRoom(found);
        scrollToMap();
      }
    };
    const onRoute = (event) => {
      const { from, to } = event.detail || {};
      if (!from || !to) return;
      setRouteFrom(from);
      setRouteTo(to);
      const dest = rooms.find((room) => room.slug === to);
      if (dest) {
        setSelectedRoom(dest);
        loadDetail(dest);
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
  }, [rooms, selectRoom, calculateRoute, loadDetail]);

  const changeRoute = useCallback(
    (type, value) => {
      if (type === "from") setRouteFrom(value);
      else setRouteTo(value);
      resetRoute();
      setStatus((prev) => ({ ...prev, routeError: null }));
    },
    [resetRoute],
  );

  const showRoute = useCallback(() => {
    const dest = rooms.find((room) => roomKey(room) === routeTo);
    if (dest && roomKey(dest) !== roomKey(selectedRoom)) {
      setSelectedRoom(dest);
      loadDetail(dest);
    }
    calculateRoute(routeFrom, routeTo);
  }, [rooms, routeFrom, routeTo, selectedRoom, calculateRoute, loadDetail]);

  // Tukar asal & tujuan, lalu hitung ulang bila keduanya terisi
  const swapRoute = useCallback(() => {
    const from = routeTo;
    const to = routeFrom;
    setRouteFrom(from);
    setRouteTo(to);
    const dest = rooms.find((room) => roomKey(room) === to);
    if (dest) {
      setSelectedRoom(dest);
      loadDetail(dest);
    }
    if (from && to) calculateRoute(from, to);
    else resetRoute();
  }, [rooms, routeFrom, routeTo, calculateRoute, loadDetail, resetRoute]);

  const search = useCallback(
    async (query) => {
      const term = query.trim().toLowerCase();
      if (!term) return [];
      try {
        return await roomApi.searchRooms(term);
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
        .filter(Boolean)
        .slice(0, 6),
    [rooms],
  );

  return {
    rooms,
    categories,
    activeCategory,
    setActiveCategory,
    filteredRooms,
    quickRooms,
    selectedRoom,
    selectRoom,
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
    status,
  };
}
