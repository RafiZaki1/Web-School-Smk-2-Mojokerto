'use client';

import { Compass, Eye, RotateCcw, User, X } from 'lucide-react';
import {
  type CameraMode,
  type CameraSensitivity,
  useCampusStore,
} from '../store/useCampusStore';

const MODE_OPTIONS: Array<{
  mode: CameraMode;
  title: string;
  subtitle: string;
  shortcut: string;
  icon: 'compass' | 'user' | 'eye';
}> = [
  {
    mode: 'drone',
    title: 'Drone View',
    subtitle: 'Isometrik 3D',
    shortcut: '1',
    icon: 'compass',
  },
  {
    mode: 'third',
    title: 'Third Person',
    subtitle: 'Di Belakang Avatar',
    shortcut: '2',
    icon: 'user',
  },
  {
    mode: 'first',
    title: 'First Person',
    subtitle: 'Perspektif Mata',
    shortcut: '3',
    icon: 'eye',
  },
];

const SENSITIVITY_OPTIONS: Array<{ value: CameraSensitivity; label: string }> = [
  { value: 0.75, label: '0,75x' },
  { value: 1, label: '1x' },
  { value: 1.5, label: '1,5x' },
];

function ModeIcon({ kind, active }: { kind: 'compass' | 'user' | 'eye'; active: boolean }) {
  const cls = `h-4 w-4 ${active ? 'text-lime-400' : 'text-slate-300'}`;
  if (kind === 'compass') return <Compass className={cls} />;
  if (kind === 'user') return <User className={cls} />;
  return <Eye className={cls} />;
}

export function CameraModePanel() {
  const isPanelOpen = useCampusStore((s) => s.isPanelOpen);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const invertY = useCampusStore((s) => s.invertY);
  const sensitivity = useCampusStore((s) => s.sensitivity);
  const isPointerLocked = useCampusStore((s) => s.isPointerLocked);

  const setCameraMode = useCampusStore((s) => s.setCameraMode);
  const toggleInvertY = useCampusStore((s) => s.toggleInvertY);
  const setSensitivity = useCampusStore((s) => s.setSensitivity);
  const togglePanel = useCampusStore((s) => s.togglePanel);
  const resetCameraSettings = useCampusStore((s) => s.resetCameraSettings);

  if (!isPanelOpen) return null;

  return (
    <aside
      aria-label="Sudut Pandang Kamera"
      className="pointer-events-auto fixed inset-x-3 bottom-24 z-30 max-h-[65vh] overflow-y-auto rounded-2xl border border-white/15 bg-slate-900/90 p-4 text-slate-100 shadow-2xl backdrop-blur-md md:static md:w-80"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
          SUDUT PANDANG KAMERA
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-200">
            Pintasan [V]
          </span>
          <button
            type="button"
            onClick={() => togglePanel(false)}
            aria-label="Tutup panel sudut pandang kamera"
            className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tiga kartu mode vertikal */}
      <div className="mt-3 flex flex-col gap-2">
        {MODE_OPTIONS.map((opt) => {
          const active = cameraMode === opt.mode;
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => setCameraMode(opt.mode)}
              className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${
                active
                  ? 'border-lime-400 bg-lime-400/12 text-white'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/25 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    active ? 'bg-lime-400/20' : 'bg-white/10'
                  }`}
                >
                  <ModeIcon kind={opt.icon} active={active} />
                </div>
                <div>
                  <p className="text-xs font-bold">{opt.title}</p>
                  <p className="text-[11px] text-slate-400">{opt.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded border border-white/15 bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">
                  {opt.shortcut}
                </span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.9)]"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Petunjuk mouse look */}
      <p className="mt-2.5 text-center text-[11px] text-slate-400">
        {isPointerLocked
          ? 'Mouselook aktif · Tekan Esc untuk melepas'
          : 'Klik layar untuk mouselook bebas · Esc lepas'}
      </p>

      {/* Invert Sumbu Y */}
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-xs font-medium text-slate-200">Invert Sumbu Y</span>
        <button
          type="button"
          onClick={toggleInvertY}
          aria-pressed={invertY}
          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${
            invertY
              ? 'bg-lime-400 text-slate-950'
              : 'border border-white/15 bg-white/10 text-slate-300 hover:bg-white/15'
          }`}
        >
          {invertY ? 'AKTIF' : 'NONAKTIF'}
        </button>
      </div>

      {/* Sensitivitas */}
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-200">Sensitivitas</span>
        <div className="inline-flex items-center gap-1">
          {SENSITIVITY_OPTIONS.map((opt) => {
            const active = sensitivity === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSensitivity(opt.value)}
                aria-pressed={active}
                className={`rounded-lg px-2 py-1 text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${
                  active
                    ? 'bg-lime-400 text-slate-950'
                    : 'border border-white/15 bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Sudut Kamera */}
      <button
        type="button"
        onClick={resetCameraSettings}
        className="mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset Sudut Kamera
      </button>
    </aside>
  );
}
