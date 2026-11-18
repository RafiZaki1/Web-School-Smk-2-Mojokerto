'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CAMPUS_BUILDINGS, JURUSAN_LABELS } from '../data/campus';
import { useMultiplayerSync } from '../services/multiplayer';
import { DEFAULT_CAMERA, useCampusStore } from '../store/useCampusStore';
import { Avatar } from './Avatar';
import { Campus } from './Campus';
import { Environment } from './Environment';
import { CameraRig } from './CameraRig';
import { MobileControls } from './MobileControls';
import { NpcVisitors } from './NpcVisitors';
import { UIOverlay } from './UIOverlay';

function SceneLoader() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-sky-100 text-slate-700">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
      <p className="text-sm font-semibold">Memuat Peta 3D SMK Negeri 2 Mojokerto...</p>
    </div>
  );
}

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

function MultiplayerDemandInvalidator() {
  const { invalidate } = useThree();
  const remotePlayers = useCampusStore((s) => s.remotePlayers);
  const cameraMode = useCampusStore((s) => s.cameraMode);

  useEffect(() => {
    if (cameraMode === 'drone') {
      invalidate();
    }
  }, [remotePlayers, cameraMode, invalidate]);

  return null;
}

export function CampusScene() {
  useMultiplayerSync();

  const webglAvailable = useMemo(() => detectWebGL(), []);
  const [showTextList, setShowTextList] = useState(false);

  const cameraMode = useCampusStore((s) => s.cameraMode);
  const setCameraMode = useCampusStore((s) => s.setCameraMode);
  const togglePanel = useCampusStore((s) => s.togglePanel);
  const selectBuildingById = useCampusStore((s) => s.selectBuildingById);

  // Pintasan keyboard: 1, 2, 3, V, E, Esc (abaikan jika fokus di input/select/textarea)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
        return;
      }

      if (e.key === '1') {
        setCameraMode('drone');
      } else if (e.key === '2') {
        setCameraMode('third');
      } else if (e.key === '3') {
        setCameraMode('first');
      } else if (e.key === 'v' || e.key === 'V') {
        togglePanel();
      } else if (e.key === 'e' || e.key === 'E') {
        const nearId = useCampusStore.getState().nearBuildingId;
        if (nearId) {
          selectBuildingById(nearId, true);
        }
      } else if (e.key === 'Escape') {
        if (document.pointerLockElement) {
          document.exitPointerLock?.();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setCameraMode, togglePanel, selectBuildingById]);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-sky-100 select-none">
      {/* Daftar gedung untuk screen reader (visually hidden) */}
      <section aria-label="Daftar gedung dan ruangan SMKN 2 Mojokerto" className="sr-only">
        <h2>Daftar Gedung dan Ruangan</h2>
        <ul>
          {CAMPUS_BUILDINGS.map((b) => (
            <li key={b.id}>
              {b.nama} — {JURUSAN_LABELS[b.jurusan]} ({b.kelas})
            </li>
          ))}
        </ul>
      </section>

      {!webglAvailable ? (
        <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto p-6 pb-24 text-center">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h1 className="text-lg font-bold text-slate-900">
              Peta 3D Tidak Dapat Ditampilkan
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Perangkat atau browser Anda belum mendukung WebGL. Anda tetap dapat melihat
              seluruh daftar gedung dan ruangan dalam bentuk teks di bawah ini.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowTextList((prev) => !prev)}
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                {showTextList ? 'Kembali ke Ringkasan' : 'Lihat Daftar Gedung (Teks)'}
              </button>
            </div>

            {showTextList && (
              <ul className="mt-5 grid max-h-[50vh] grid-cols-1 gap-2 overflow-y-auto text-left sm:grid-cols-2">
                {CAMPUS_BUILDINGS.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                  >
                    <p className="font-bold text-slate-900">{b.nama}</p>
                    <p className="text-slate-600">
                      {b.jurusan} · {b.kelas}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <>
          <UIOverlay />
          <MobileControls />
          <div
            role="region"
            aria-label="Peta 3D denah SMKN 2 Mojokerto, gunakan dropdown Cari ruangan untuk navigasi keyboard"
            className="h-full w-full"
          >
            <Suspense fallback={<SceneLoader />}>
              <Canvas
                shadows
                dpr={[1, 2]}
                frameloop={cameraMode === 'drone' ? 'demand' : 'always'}
                aria-label="Peta 3D denah SMKN 2 Mojokerto, gunakan dropdown Cari ruangan untuk navigasi keyboard"
                camera={{
                  position: DEFAULT_CAMERA.position,
                  fov: 38,
                  near: 0.1,
                  far: 450,
                }}
              >
                <Environment />
                <Campus />
                <Avatar />
                <NpcVisitors />
                <CameraRig />
                <MultiplayerDemandInvalidator />
              </Canvas>
            </Suspense>
          </div>
        </>
      )}
    </main>
  );
}
