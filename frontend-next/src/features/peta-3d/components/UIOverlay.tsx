'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  Camera,
  ChevronDown,
  Clock,
  Compass,
  Eye,
  EyeOff,
  GraduationCap,
  Hand,
  Home,
  Lock,
  MapPin,
  Minus,
  Moon,
  Navigation,
  Palette,
  Plane,
  Plus,
  RotateCcw,
  Route,
  Search,
  ShieldCheck,
  Square,
  Sun,
  Trash2,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  CAMPUS_BOUNDS,
  CAMPUS_BUILDINGS,
  JURUSAN_COLORS,
  JURUSAN_LABELS,
  getZoneForPosition,
  type JurusanKey,
} from '../data/campus';
import { type CameraMode, useCampusStore } from '../store/useCampusStore';
import { CameraModePanel } from './CameraModePanel';

const SHIRT_SWATCHES = ['#0284c7', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0f172a'];
const HAIR_SWATCHES = ['#0f172a', '#451a03', '#78350f', '#ca8a04', '#475569'];

const CAMERA_MODE_LABEL: Record<CameraMode, string> = {
  drone: 'Drone View',
  third: 'Third Person',
  first: 'First Person',
};

function JurusanIcon({ jurusan, className }: { jurusan: JurusanKey; className?: string }) {
  switch (jurusan) {
    case 'RPL':
    case 'LPS':
    case 'DKV':
    case 'APHP':
    case 'KUL':
      return <GraduationCap className={className} />;
    case 'UMUM':
      return <Building2 className={className} />;
    default:
      return <MapPin className={className} />;
  }
}

function hitungRingkasanRute(rute?: [number, number, number][]) {
  if (!rute || rute.length < 2) return null;
  let total = 0;
  for (let i = 0; i < rute.length - 1; i++) {
    const [x1, , z1] = rute[i];
    const [x2, , z2] = rute[i + 1];
    total += Math.hypot(x2 - x1, z2 - z1);
  }
  return {
    jarakMeter: Math.round(total),
    belokan: Math.max(0, rute.length - 2),
  };
}

function formatWibClock(): { timeText: string; periodText: string } {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const hour = now.getHours();
  const periodText = hour >= 6 && hour < 18 ? 'Siang' : 'Malam';
  return { timeText: `${hh}:${mm} WIB`, periodText };
}

const LEGEND_KEYS: JurusanKey[] = ['RPL', 'LPS', 'DKV', 'APHP', 'KUL', 'UMUM'];

export function UIOverlay() {
  const selectedId = useCampusStore((s) => s.selectedId);
  const showLabels = useCampusStore((s) => s.showLabels);
  const isNight = useCampusStore((s) => s.isNight);
  const routeActive = useCampusStore((s) => s.routeActive);
  const routeFollowActive = useCampusStore((s) => s.routeFollowActive);
  const routeNotice = useCampusStore((s) => s.routeNotice);
  const isPanelOpen = useCampusStore((s) => s.isPanelOpen);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const liveCameraPosition = useCampusStore((s) => s.liveCameraPosition);
  const avatarPos = useCampusStore((s) => s.avatarPos);
  const playerName = useCampusStore((s) => s.playerName);
  const shirtColor = useCampusStore((s) => s.shirtColor);
  const hairColor = useCampusStore((s) => s.hairColor);
  const remotePlayers = useCampusStore((s) => s.remotePlayers);
  const nearBuildingId = useCampusStore((s) => s.nearBuildingId);
  const characterOpen = useCampusStore((s) => s.characterOpen);
  const soundMuted = useCampusStore((s) => s.soundMuted);
  const cityAudioMuted = useCampusStore((s) => s.cityAudioMuted);
  const connectionStatus = useCampusStore((s) => s.connectionStatus);
  const isObserver = useCampusStore((s) => s.isObserver);
  const playerListOpen = useCampusStore((s) => s.playerListOpen);
  const teleportFade = useCampusStore((s) => s.teleportFade);

  const selectBuildingById = useCampusStore((s) => s.selectBuildingById);
  const teleportToBuilding = useCampusStore((s) => s.teleportToBuilding);
  const focusOnPosition = useCampusStore((s) => s.focusOnPosition);
  const toggleLabels = useCampusStore((s) => s.toggleLabels);
  const toggleNight = useCampusStore((s) => s.toggleNight);
  const goDroneView = useCampusStore((s) => s.goDroneView);
  const resetCamera = useCampusStore((s) => s.resetCamera);
  const requestZoom = useCampusStore((s) => s.requestZoom);
  const toggleRoute = useCampusStore((s) => s.toggleRoute);
  const clearRoute = useCampusStore((s) => s.clearRoute);
  const clearRouteNotice = useCampusStore((s) => s.clearRouteNotice);
  const stopRouteFollow = useCampusStore((s) => s.stopRouteFollow);
  const togglePanel = useCampusStore((s) => s.togglePanel);
  const toggleCharacterModal = useCampusStore((s) => s.toggleCharacterModal);
  const setAvatarColors = useCampusStore((s) => s.setAvatarColors);
  const triggerWave = useCampusStore((s) => s.triggerWave);
  const toggleSoundMuted = useCampusStore((s) => s.toggleSoundMuted);
  const toggleCityAudioMuted = useCampusStore((s) => s.toggleCityAudioMuted);
  const togglePlayerList = useCampusStore((s) => s.togglePlayerList);

  const [mobileMinimapOpen, setMobileMinimapOpen] = useState(false);
  const [clock, setClock] = useState<{ timeText: string; periodText: string }>({
    timeText: '12:55 WIB',
    periodText: 'Siang',
  });

  useEffect(() => {
    const syncClock = () => setClock(formatWibClock());
    syncClock();
    const timer = window.setInterval(syncClock, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedBuilding = useMemo(
    () => CAMPUS_BUILDINGS.find((b) => b.id === selectedId) ?? null,
    [selectedId],
  );

  const nearBuilding = useMemo(
    () => CAMPUS_BUILDINGS.find((b) => b.id === nearBuildingId) ?? null,
    [nearBuildingId],
  );

  const zoneInfo = useMemo(
    () => getZoneForPosition(avatarPos[0], avatarPos[2]),
    [avatarPos],
  );

  const onlineStats = useMemo(() => {
    const selfCount = isObserver || connectionStatus === 'unavailable' || connectionStatus === 'offline' ? 0 : 1;
    const totalOnline = selfCount + remotePlayers.length;
    const nearbyCount =
      selfCount +
      remotePlayers.filter(
        (p) => Math.hypot(p.pos[0] - avatarPos[0], p.pos[2] - avatarPos[2]) <= 60,
      ).length;
    return { totalOnline, sameAreaCount: nearbyCount };
  }, [remotePlayers, avatarPos, isObserver, connectionStatus]);

  const routeSummary = useMemo(
    () => hitungRingkasanRute(selectedBuilding?.rute),
    [selectedBuilding],
  );

  const sortedBuildings = useMemo(
    () => [...CAMPUS_BUILDINGS].sort((a, b) => a.nama.localeCompare(b.nama, 'id')),
    [],
  );

  const camMapX = Math.min(
    96,
    Math.max(4, ((liveCameraPosition[0] + CAMPUS_BOUNDS.width / 2) / CAMPUS_BOUNDS.width) * 100),
  );
  const camMapY = Math.min(
    96,
    Math.max(4, ((liveCameraPosition[2] + CAMPUS_BOUNDS.depth / 2) / CAMPUS_BOUNDS.depth) * 100),
  );

  const hasRouteData = Boolean(selectedBuilding?.rute && selectedBuilding.rute.length >= 2);
  const routeTooltip = !selectedBuilding
    ? 'Pilih gedung dulu untuk melihat rute'
    : hasRouteData
      ? 'Tampilkan rute dari Gerbang Utama'
      : 'Rute belum tersedia untuk gedung ini';

  const handleSapa = () => {
    const nearbyPeer = remotePlayers.some(
      (p) => Math.hypot(p.pos[0] - avatarPos[0], p.pos[2] - avatarPos[2]) <= 10,
    );
    triggerWave(nearbyPeer ? 'Halo, teman!' : 'Halo!');
  };

  const renderControlButtons = (compactOnMobile: boolean) => (
    <>
      <button
        type="button"
        onClick={goDroneView}
        title="Sudut Drone"
        aria-label="Sudut Drone"
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-2 text-xs font-semibold text-slate-800 transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <Plane className="h-3.5 w-3.5 text-sky-600" />
        <span className={compactOnMobile ? 'inline' : 'hidden xl:inline'}>Drone</span>
      </button>

      <button
        type="button"
        onClick={toggleRoute}
        title={routeTooltip}
        aria-label="Rute"
        aria-pressed={routeActive}
        className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
          routeActive
            ? 'bg-blue-600 text-white shadow-xs'
            : hasRouteData
              ? 'text-slate-800 hover:bg-blue-50'
              : 'text-slate-500 hover:bg-slate-100'
        }`}
      >
        <Route className="h-3.5 w-3.5" />
        <span className={compactOnMobile ? 'inline' : 'hidden xl:inline'}>Rute</span>
      </button>

      <button
        type="button"
        onClick={toggleLabels}
        title={showLabels ? 'Sembunyikan Label' : 'Tampilkan Label'}
        aria-label="Label"
        aria-pressed={showLabels}
        className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
          showLabels ? 'bg-emerald-50 text-emerald-700' : 'text-slate-800 hover:bg-slate-100'
        }`}
      >
        {showLabels ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        <span className={compactOnMobile ? 'inline' : 'hidden xl:inline'}>Label</span>
      </button>

      <button
        type="button"
        onClick={toggleNight}
        title={isNight ? 'Mode Siang' : 'Mode Malam'}
        aria-label="Siang/Malam"
        aria-pressed={isNight}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        {isNight ? (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-indigo-600" />
        )}
        <span className={compactOnMobile ? 'inline' : 'hidden xl:inline'}>
          {isNight ? 'Siang' : 'Malam'}
        </span>
      </button>
    </>
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-3 pb-20 sm:p-4 sm:pb-24">
      {/* Overlay transisi fade saat Teleport */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-50 bg-slate-950 transition-opacity duration-200 ${
          teleportFade ? 'opacity-65' : 'opacity-0'
        }`}
      />

      {/* BARIS ATAS HUD: Kiri (Identitas, Online, Waktu) · Tengah (Lokasi, Zona, Suara) · Kanan (Teleport, Karakter, Sapa, User, Beranda) */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          {/* Kiri Atas */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/92 px-3 py-1.5 shadow-lg backdrop-blur-md">
              <Image
                src="/images/brand/emblem-smkn2.png"
                alt="Logo SMK Negeri 2 Mojokerto"
                width={28}
                height={28}
                className="h-7 w-7 shrink-0 rounded-lg object-contain"
              />
              <h1 className="text-xs font-bold text-slate-900 sm:text-sm">
                Peta 3D SMKN 2 Mojokerto
              </h1>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => togglePlayerList()}
                aria-expanded={playerListOpen}
                title="Klik untuk melihat daftar pemain online"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-md backdrop-blur-md hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    connectionStatus === 'connected'
                      ? 'bg-emerald-500'
                      : connectionStatus === 'full'
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                  }`}
                />
                <Users className="h-3.5 w-3.5 text-emerald-600" />
                <span>
                  {connectionStatus === 'unavailable'
                    ? 'Online: tidak tersedia'
                    : connectionStatus === 'offline'
                      ? 'Online: offline'
                      : `${onlineStats.totalOnline} Online (${onlineStats.sameAreaCount} di sini)`}
                </span>
              </button>

              {playerListOpen && (
                <div className="absolute top-9 left-0 z-40 w-64 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Pemain Online ({onlineStats.totalOnline})
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePlayerList(false)}
                      aria-label="Tutup daftar pemain"
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-xs">
                    <li>
                      <button
                        type="button"
                        onClick={() => focusOnPosition(avatarPos)}
                        className="flex w-full items-center justify-between rounded-lg bg-sky-50 px-2.5 py-1.5 text-left font-semibold text-sky-900 hover:bg-sky-100"
                      >
                        <span>@{playerName} (Anda)</span>
                        <span className="text-[10px] text-sky-600">0 m</span>
                      </button>
                    </li>
                    {remotePlayers.map((peer) => {
                      const dist = Math.round(
                        Math.hypot(peer.pos[0] - avatarPos[0], peer.pos[2] - avatarPos[2]),
                      );
                      return (
                        <li key={peer.id}>
                          <button
                            type="button"
                            onClick={() => focusOnPosition(peer.pos)}
                            className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-medium text-slate-800 hover:bg-slate-100"
                          >
                            <span>@{peer.name}</span>
                            <span className="text-[10px] text-slate-500">{dist} m</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {connectionStatus === 'reconnecting' && (
              <span
                role="status"
                className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-900 shadow"
              >
                Menyambung ulang...
              </span>
            )}

            {connectionStatus === 'full' && (
              <span
                role="status"
                className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow"
              >
                Dunia penuh, coba lagi nanti
              </span>
            )}

            <div className="hidden items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-md backdrop-blur-md sm:inline-flex">
              <Clock className="h-3.5 w-3.5 text-sky-600" />
              <span>
                {clock.timeText} · {isNight ? 'Malam' : clock.periodText}
              </span>
            </div>
          </div>

          {/* Tengah Atas: Lokasi, Akses Zona, Suara */}
          <div className="pointer-events-auto hidden flex-wrap items-center gap-1.5 lg:flex">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/92 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow-md backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-sky-600" />
              <span>{zoneInfo.areaLabel}</span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold shadow-md backdrop-blur-md ${
                zoneInfo.akses === 'privat'
                  ? 'border-red-300 bg-red-600 text-white'
                  : 'border-emerald-300 bg-emerald-600 text-white'
              }`}
            >
              {zoneInfo.akses === 'privat' ? (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span>Kawasan Privat</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Akses: {zoneInfo.zona}</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={toggleSoundMuted}
              aria-pressed={!soundMuted}
              title="Toggle Suara"
              className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-md backdrop-blur-md hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {soundMuted ? (
                <VolumeX className="h-3.5 w-3.5 text-slate-500" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-sky-600" />
              )}
              <span>Suara</span>
            </button>

            <button
              type="button"
              onClick={toggleCityAudioMuted}
              aria-pressed={!cityAudioMuted}
              title="Toggle Suara Kota"
              className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-md backdrop-blur-md hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {cityAudioMuted ? (
                <VolumeX className="h-3.5 w-3.5 text-slate-500" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-emerald-600" />
              )}
              <span>Suara Kota</span>
            </button>
          </div>

          {/* Kanan Atas: Teleport, Karakter, Sapa, User, Beranda Web */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
            <label className="relative flex items-center">
              <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
              <select
                aria-label="Cari ruangan"
                value=""
                onChange={(e) => {
                  const targetId = e.target.value;
                  if (targetId) {
                    teleportToBuilding(targetId);
                  }
                }}
                className="h-9 w-36 rounded-xl border border-white/70 bg-white/92 pr-5 pl-7 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:w-44"
              >
                <option value="">Teleport...</option>
                {sortedBuildings.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} ({item.jurusan})
                  </option>
                ))}
              </select>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => toggleCharacterModal()}
                aria-expanded={characterOpen}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/70 bg-white/92 px-2.5 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-md hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Palette className="h-3.5 w-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Karakter</span>
              </button>

              {characterOpen && (
                <div className="absolute top-11 right-0 z-40 w-60 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Kustomisasi Karakter</span>
                    <button
                      type="button"
                      onClick={() => toggleCharacterModal(false)}
                      aria-label="Tutup pemilih karakter"
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] font-semibold text-slate-600">Warna Baju</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {SHIRT_SWATCHES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Warna baju ${c}`}
                        onClick={() => setAvatarColors(c, hairColor)}
                        className={`h-6 w-6 rounded-full border-2 ${
                          shirtColor === c ? 'border-slate-900 scale-110' : 'border-white'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <p className="mt-2.5 text-[11px] font-semibold text-slate-600">Warna Rambut</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {HAIR_SWATCHES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Warna rambut ${c}`}
                        onClick={() => setAvatarColors(shirtColor, c)}
                        className={`h-6 w-6 rounded-full border-2 ${
                          hairColor === c ? 'border-sky-500 scale-110' : 'border-white'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSapa}
              title="Kirim sapaan ke pemain sekitar"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/70 bg-white/92 px-2.5 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-md hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Hand className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden sm:inline">Sapa</span>
            </button>

            <span className="hidden h-9 items-center rounded-xl border border-white/70 bg-slate-900/85 px-2.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md md:inline-flex">
              {playerName}
            </span>

            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/70 bg-white/92 px-2.5 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-md hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Home className="h-3.5 w-3.5 text-sky-600" />
              <span className="hidden lg:inline">Beranda Web</span>
            </Link>
          </div>
        </div>

        {/* Baris Sub-kontrol Desktop: Rute, Label, Siang/Malam, Notice */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Lokasi & Zona versi mobile (< lg) */}
          <div className="pointer-events-auto flex items-center gap-1.5 lg:hidden">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-slate-800 shadow">
              <MapPin className="h-3 w-3 text-sky-600" />
              {zoneInfo.areaLabel}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow ${
                zoneInfo.akses === 'privat' ? 'bg-red-600' : 'bg-emerald-600'
              }`}
            >
              {zoneInfo.akses === 'privat' ? (
                <Lock className="h-3 w-3" />
              ) : (
                <ShieldCheck className="h-3 w-3" />
              )}
              {zoneInfo.akses === 'privat' ? 'Kawasan Privat' : `Akses: ${zoneInfo.zona}`}
            </span>
          </div>

          <div className="pointer-events-auto ml-auto flex flex-wrap items-center gap-1.5">
            <div className="hidden items-center gap-1 rounded-2xl border border-white/70 bg-white/90 p-1 shadow-md backdrop-blur-md md:inline-flex">
              {renderControlButtons(false)}
            </div>

            {routeNotice && (
              <div
                role="status"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/95 px-3 py-1.5 text-xs font-medium text-amber-900 shadow-md backdrop-blur-md"
              >
                <span>{routeNotice}</span>
                <button
                  type="button"
                  onClick={clearRouteNotice}
                  aria-label="Tutup pesan rute"
                  className="rounded p-0.5 text-amber-700 hover:bg-amber-200/60"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {routeActive && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white/95 px-2.5 py-1 text-xs shadow-md backdrop-blur-md">
                {routeFollowActive && (
                  <button
                    type="button"
                    onClick={stopRouteFollow}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 font-semibold text-amber-900 hover:bg-amber-200"
                  >
                    <Square className="h-3 w-3 fill-current" />
                    Stop
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearRoute}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 font-semibold text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus Rute
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prompt Interaksi Dekat Pintu Gedung (Tekan E untuk masuk) */}
      {nearBuilding && cameraMode !== 'drone' && (
        <div className="pointer-events-auto self-center">
          <button
            type="button"
            onClick={() => selectBuildingById(nearBuilding.id, true)}
            className="inline-flex items-center gap-2 rounded-full border border-lime-300 bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition hover:bg-slate-800"
          >
            <span className="rounded bg-lime-400 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
              E
            </span>
            <span>Tekan E untuk masuk · {nearBuilding.nama}</span>
          </button>
        </div>
      )}

      {/* BARIS BAWAH HUD */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        {/* Kiri Bawah: Panel Info Gedung + Bottom Bar Mobile + Legenda */}
        <div className="flex w-full flex-col gap-2 md:w-auto">
          {selectedBuilding && (
            <div className="pointer-events-auto max-h-[30vh] w-full overflow-y-auto rounded-2xl border border-white/70 bg-white/95 p-3 shadow-2xl backdrop-blur-md sm:max-h-[36vh] sm:w-96 sm:p-4">
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-xs sm:h-10 sm:w-10"
                    style={{ backgroundColor: selectedBuilding.warna }}
                  >
                    <JurusanIcon
                      jurusan={selectedBuilding.jurusan}
                      className="h-5 w-5 text-slate-900"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                      {selectedBuilding.nama}
                    </h2>
                    <p className="truncate text-[11px] font-medium text-slate-500 sm:text-xs">
                      {JURUSAN_LABELS[selectedBuilding.jurusan]}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => selectBuildingById(null)}
                  aria-label="Tutup panel info"
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2 text-xs">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                    Kelompok
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-black/15"
                      style={{ backgroundColor: JURUSAN_COLORS[selectedBuilding.jurusan] }}
                    />
                    {selectedBuilding.jurusan}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                    Tingkat / Fungsi
                  </span>
                  <span className="font-semibold text-slate-800">{selectedBuilding.kelas}</span>
                </div>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {selectedBuilding.deskripsi?.trim()
                  ? selectedBuilding.deskripsi
                  : 'Informasi akan diperbarui'}
              </p>

              <div className="mt-2.5 rounded-xl border border-blue-100 bg-blue-50/70 p-2.5 text-xs">
                {routeSummary ? (
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-blue-950">Rute dari Gerbang Utama</p>
                      <p className="text-[11px] text-blue-700">
                        Jarak perkiraan ~{routeSummary.jarakMeter} m · {routeSummary.belokan} belokan
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={routeActive ? clearRoute : toggleRoute}
                      className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        routeActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Navigation className="h-3 w-3" />
                      {routeActive ? 'Hapus Rute' : 'Lihat Rute'}
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-600">Rute belum tersedia</p>
                )}
              </div>
            </div>
          )}

          {/* Bottom bar mobile (< 768px) */}
          <div className="pointer-events-auto flex items-center gap-1 overflow-x-auto rounded-2xl border border-white/70 bg-white/92 p-1 shadow-lg backdrop-blur-md md:hidden">
            {renderControlButtons(true)}
            <button
              type="button"
              onClick={() => togglePanel()}
              aria-label="Sudut Pandang Kamera"
              className={`inline-flex h-8 shrink-0 items-center gap-1 rounded-xl px-2.5 text-xs font-semibold ${
                isPanelOpen ? 'bg-slate-900 text-lime-400' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>{CAMERA_MODE_LABEL[cameraMode]}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMinimapOpen((prev) => !prev)}
              aria-label="Minimap"
              className={`inline-flex h-8 shrink-0 items-center gap-1 rounded-xl px-2.5 text-xs font-semibold ${
                mobileMinimapOpen ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-sky-600" />
              <span>Minimap</span>
            </button>
          </div>

          {/* Legenda Jurusan */}
          <div
            aria-label="Legenda warna jurusan"
            className="pointer-events-auto flex max-w-full items-center gap-3 overflow-x-auto rounded-2xl border border-white/70 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-lg backdrop-blur-md sm:flex-wrap sm:py-2"
          >
            {LEGEND_KEYS.map((key) => (
              <span key={key} className="inline-flex shrink-0 items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-black/15"
                  style={{ backgroundColor: JURUSAN_COLORS[key] }}
                />
                {key}
              </span>
            ))}
          </div>
        </div>

        {/* Bawah Tengah Desktop: Bar Petunjuk */}
        <div className="pointer-events-none hidden self-end rounded-full border border-white/20 bg-slate-900/75 px-3.5 py-1.5 text-[11px] font-medium text-slate-100 shadow-lg backdrop-blur-md xl:block">
          WASD / Panah: Gerak · Spasi: Lompat · E: Interaksi · V: Kamera · Scroll: Zoom
        </div>

        {/* Kanan Bawah: Panel Sudut Pandang Kamera + Zoom/Selector Mode + Minimap 2D */}
        <div className="flex flex-col items-end gap-2">
          <CameraModePanel />

          {/* Kontrol Zoom In, Reset, Zoom Out & Selector Mode Kamera */}
          <div className="pointer-events-auto hidden items-center gap-1.5 md:flex">
            <div className="inline-flex items-center gap-0.5 rounded-xl border border-white/70 bg-white/92 p-1 shadow-lg backdrop-blur-md">
              <button
                type="button"
                onClick={() => requestZoom(-14)}
                title="Zoom In"
                aria-label="Zoom In"
                className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={resetCamera}
                title="Reset Kamera"
                aria-label="Reset Kamera"
                className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => requestZoom(14)}
                title="Zoom Out"
                aria-label="Zoom Out"
                className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => togglePanel()}
              aria-expanded={isPanelOpen}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/20 bg-slate-900/90 px-3 text-xs font-semibold text-white shadow-lg backdrop-blur-md hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
            >
              <Camera className="h-3.5 w-3.5 text-lime-400" />
              <span>{CAMERA_MODE_LABEL[cameraMode]}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>

          {/* Minimap 2D (menampilkan gedung, posisi kamera, & titik pemain lain) */}
          <div
            className={`pointer-events-auto self-end rounded-2xl border border-white/70 bg-white/92 p-2.5 shadow-xl backdrop-blur-md ${
              mobileMinimapOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Compass className="h-3 w-3 text-sky-600" />
                Minimap (Utara ↑)
              </span>
            </div>
            <div className="relative h-24 w-44 overflow-hidden rounded-xl border border-slate-200 bg-lime-100/80 sm:h-28 sm:w-52">
              {CAMPUS_BUILDINGS.map((b) => {
                const left = ((b.posisi[0] + CAMPUS_BOUNDS.width / 2) / CAMPUS_BOUNDS.width) * 100;
                const top = ((b.posisi[2] + CAMPUS_BOUNDS.depth / 2) / CAMPUS_BOUNDS.depth) * 100;
                const wPct = Math.max(2.5, (b.ukuran[0] / CAMPUS_BOUNDS.width) * 100);
                const hPct = Math.max(3, (b.ukuran[2] / CAMPUS_BOUNDS.depth) * 100);
                const active = b.id === selectedId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    title={b.nama}
                    aria-label={`Fokus ke ${b.nama}`}
                    onClick={() => selectBuildingById(b.id)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[2px] border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      active ? 'z-10 border-amber-500 ring-2 ring-amber-400' : 'border-black/15'
                    }`}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${wPct}%`,
                      height: `${hPct}%`,
                      backgroundColor: b.warna,
                    }}
                  />
                );
              })}

              {/* Titik pemain lain di minimap */}
              {remotePlayers.map((peer) => {
                const px = ((peer.pos[0] + CAMPUS_BOUNDS.width / 2) / CAMPUS_BOUNDS.width) * 100;
                const py = ((peer.pos[2] + CAMPUS_BOUNDS.depth / 2) / CAMPUS_BOUNDS.depth) * 100;
                return (
                  <span
                    key={peer.id}
                    title={`@${peer.name}`}
                    className="pointer-events-none absolute z-15 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-emerald-500"
                    style={{ left: `${px}%`, top: `${py}%` }}
                  />
                );
              })}

              {/* Indikator posisi kamera */}
              <span
                className="pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sky-600 shadow"
                style={{ left: `${camMapX}%`, top: `${camMapY}%` }}
                title="Posisi Kamera"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
