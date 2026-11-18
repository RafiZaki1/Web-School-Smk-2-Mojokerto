'use client';

import { useEffect, useRef, useState } from 'react';
import { useCampusStore } from '../store/useCampusStore';

export function MobileControls() {
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const setJoystickVector = useCampusStore((s) => s.setJoystickVector);

  const [knobPos, setKnobPos] = useState<[number, number]>([0, 0]);
  const [isTouchOrSmall, setIsTouchOrSmall] = useState(false);
  const joyOriginRef = useRef<{ x: number; y: number } | null>(null);
  const lookLastRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const check = () => {
      const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
      setIsTouchOrSmall(coarse || window.innerWidth < 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (cameraMode === 'drone' || !isTouchOrSmall) return null;

  const MAX_RADIUS = 32;

  const handleJoyStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    joyOriginRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const handleJoyMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!joyOriginRef.current) return;
    const dx = e.clientX - joyOriginRef.current.x;
    const dy = e.clientY - joyOriginRef.current.y;
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(dist, MAX_RADIUS);
    const angle = Math.atan2(dy, dx);
    const kx = Math.cos(angle) * clamped;
    const ky = Math.sin(angle) * clamped;

    setKnobPos([kx, ky]);
    setJoystickVector([kx / MAX_RADIUS, -ky / MAX_RADIUS]);
  };

  const handleJoyEnd = () => {
    joyOriginRef.current = null;
    setKnobPos([0, 0]);
    setJoystickVector([0, 0]);
  };

  const handleLookStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    lookLastRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleLookMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!lookLastRef.current) return;
    const dx = e.clientX - lookLastRef.current.x;
    const dy = e.clientY - lookLastRef.current.y;
    lookLastRef.current = { x: e.clientX, y: e.clientY };

    const state = useCampusStore.getState();
    const factor = 0.005 * state.sensitivity;
    const ySign = state.invertY ? -1 : 1;
    const nextYaw = state.avatarYaw - dx * factor;
    const nextPitch = Math.max(-0.55, Math.min(0.65, state.avatarPitch - dy * factor * ySign));
    state.setAvatarTransform(state.avatarPos, nextYaw, nextPitch);
  };

  const handleLookEnd = () => {
    lookLastRef.current = null;
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-36 z-15 flex items-end justify-between px-4">
      {/* Joystick virtual di pojok kiri bawah (lingkaran besar + titik hijau di tengah) */}
      <div
        role="application"
        aria-label="Joystick gerak avatar"
        onPointerDown={handleJoyStart}
        onPointerMove={handleJoyMove}
        onPointerUp={handleJoyEnd}
        onPointerCancel={handleJoyEnd}
        className="pointer-events-auto relative flex h-24 w-24 touch-none items-center justify-center rounded-full border-2 border-white/60 bg-slate-900/50 shadow-xl backdrop-blur-xs"
      >
        <div
          className="h-9 w-9 rounded-full border-2 border-white bg-lime-400 shadow-md"
          style={{
            transform: `translate(${knobPos[0]}px, ${knobPos[1]}px)`,
          }}
        />
      </div>

      {/* Area geser sisi kanan untuk melihat sekitar */}
      <div
        role="application"
        aria-label="Area geser arah pandangan"
        onPointerDown={handleLookStart}
        onPointerMove={handleLookMove}
        onPointerUp={handleLookEnd}
        onPointerCancel={handleLookEnd}
        className="pointer-events-auto flex h-24 w-32 touch-none items-center justify-center rounded-2xl border border-white/30 bg-slate-900/35 text-[11px] font-medium text-white/90 backdrop-blur-xs"
      >
        Geser untuk lihat
      </div>
    </div>
  );
}
