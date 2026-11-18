'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CAMPUS_BUILDINGS } from '../data/campus';
import {
  type AvatarAnimState,
  type RemotePlayerState,
  useCampusStore,
} from '../store/useCampusStore';
import {
  getStepSurfaceY,
  resolveAvatarMovement,
} from '../utils/collision';

const BASE_SPEED = 12;
const JUMP_VELOCITY = 7.6;
const GRAVITY = 22;

function isFormElementFocused() {
  if (typeof document === 'undefined') return false;
  const tag = document.activeElement?.tagName;
  return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
}

interface RobloxCharacterProps {
  name: string;
  shirtColor: string;
  hairColor: string;
  anim: AvatarAnimState;
  hideBody?: boolean;
  showNameplate?: boolean;
  waveText?: string | null;
  /** Warga NPC: label tanpa "@" dan diberi penanda NPC agar tidak dikira pemain. */
  npc?: boolean;
}

export function RobloxCharacterMesh({
  name,
  shirtColor,
  hairColor,
  anim,
  hideBody = false,
  showNameplate = true,
  waveText = null,
  npc = false,
}: RobloxCharacterProps) {
  const bodyGroupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!bodyGroupRef.current) return;

    if (anim === 'walk' || anim === 'run') {
      const freq = anim === 'run' ? 13 : 8.5;
      const amp = anim === 'run' ? 0.72 : 0.48;
      const swing = Math.sin(t * freq) * amp;
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.85;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.85;
      bodyGroupRef.current.position.y = Math.abs(Math.sin(t * freq)) * 0.05;
    } else if (anim === 'jump') {
      if (leftLegRef.current) leftLegRef.current.rotation.x = -0.35;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0.25;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.7;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.7;
      bodyGroupRef.current.position.y = 0;
    } else if (anim === 'wave') {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -2.4;
        rightArmRef.current.rotation.z = Math.sin(t * 10) * 0.35 - 0.2;
      }
      bodyGroupRef.current.position.y = Math.sin(t * 2.5) * 0.02;
    } else {
      // Idle: napas halus
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(t * 2) * 0.04;
        leftArmRef.current.rotation.z = 0;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.sin(t * 2) * 0.04;
        rightArmRef.current.rotation.z = 0;
      }
      bodyGroupRef.current.position.y = Math.sin(t * 2.2) * 0.025;
    }
  });

  return (
    <group>
      {/* Bayangan kaki di tanah (tetap terlihat di First Person) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[0.42, 16]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.28} />
      </mesh>

      <group ref={bodyGroupRef} visible={!hideBody}>
        {/* Kaki kiri + sepatu */}
        <group ref={leftLegRef} position={[-0.14, 0.62, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.22, 0.52, 0.24]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.56, 0.03]} castShadow>
            <boxGeometry args={[0.24, 0.12, 0.3]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>

        {/* Kaki kanan + sepatu */}
        <group ref={rightLegRef} position={[0.14, 0.62, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.22, 0.52, 0.24]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.56, 0.03]} castShadow>
            <boxGeometry args={[0.24, 0.12, 0.3]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>

        {/* Badan kotak */}
        <mesh position={[0, 0.94, 0]} castShadow>
          <boxGeometry args={[0.56, 0.62, 0.3]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>

        {/* Lengan kiri */}
        <group ref={leftArmRef} position={[-0.39, 1.2, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.2, 0.54, 0.22]} />
            <meshStandardMaterial color={shirtColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.56, 0]} castShadow>
            <boxGeometry args={[0.18, 0.12, 0.2]} />
            <meshStandardMaterial color="#fdba74" roughness={0.65} />
          </mesh>
        </group>

        {/* Lengan kanan */}
        <group ref={rightArmRef} position={[0.39, 1.2, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.2, 0.54, 0.22]} />
            <meshStandardMaterial color={shirtColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.56, 0]} castShadow>
            <boxGeometry args={[0.18, 0.12, 0.2]} />
            <meshStandardMaterial color="#fdba74" roughness={0.65} />
          </mesh>
        </group>

        {/* Kepala kotak + wajah sederhana */}
        <group position={[0, 1.48, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.42, 0.42]} />
            <meshStandardMaterial color="#fdba74" roughness={0.65} />
          </mesh>
          {/* Rambut kotak */}
          <mesh position={[0, 0.19, -0.01]} castShadow>
            <boxGeometry args={[0.45, 0.14, 0.45]} />
            <meshStandardMaterial color={hairColor} roughness={0.85} />
          </mesh>
          {/* Mata kiri, mata kanan, dan mulut di sisi depan (+Z) */}
          <mesh position={[-0.09, 0.03, 0.215]}>
            <boxGeometry args={[0.05, 0.06, 0.02]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.09, 0.03, 0.215]}>
            <boxGeometry args={[0.05, 0.06, 0.02]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, -0.07, 0.215]}>
            <boxGeometry args={[0.12, 0.03, 0.02]} />
            <meshBasicMaterial color="#7c2d12" />
          </mesh>
        </group>
      </group>

      {/* Label nama (@Nama) hanya tampil di Drone View & Third Person */}
      {showNameplate && (
        <Html position={[0, 2.15, 0]} center zIndexRange={[8, 0]}>
          <div className="pointer-events-none flex flex-col items-center gap-1">
            {waveText && (
              <span className="whitespace-nowrap rounded-xl border border-amber-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-slate-900 shadow-md">
                {waveText}
              </span>
            )}
            {npc ? (
              <span className="flex items-center gap-1 whitespace-nowrap rounded-full border border-white/40 bg-white/85 py-0.5 pr-2.5 pl-1 text-[11px] font-semibold text-slate-700 shadow-md">
                <span className="rounded-full bg-slate-200 px-1.5 text-[9px] font-bold tracking-wide text-slate-600">NPC</span>
                {name}
              </span>
            ) : (
              <span className="whitespace-nowrap rounded-full border border-white/15 bg-slate-900/85 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md backdrop-blur-xs">
                @{name}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

function RemotePlayerAvatar({ player }: { player: RemotePlayerState }) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraMode = useCampusStore((s) => s.cameraMode);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const alpha = 1 - Math.exp(-12 * Math.min(delta, 0.05));
    groupRef.current.position.lerp(
      new THREE.Vector3(player.pos[0], player.pos[1], player.pos[2]),
      alpha,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      player.yaw,
      alpha,
    );
  });

  return (
    <group ref={groupRef} position={player.pos} rotation={[0, player.yaw, 0]}>
      <RobloxCharacterMesh
        name={player.name}
        shirtColor={player.shirtColor}
        hairColor={player.hairColor}
        anim={player.anim}
        showNameplate={cameraMode !== 'first'}
        waveText={player.waveText ?? null}
      />
    </group>
  );
}

export function Avatar() {
  const keysRef = useRef<Set<string>>(new Set());
  const verticalVelRef = useRef(0);
  const velRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const nearCheckRef = useRef(0);

  const cameraMode = useCampusStore((s) => s.cameraMode);
  const avatarPos = useCampusStore((s) => s.avatarPos);
  const avatarYaw = useCampusStore((s) => s.avatarYaw);
  const avatarAnim = useCampusStore((s) => s.avatarAnim);
  const playerName = useCampusStore((s) => s.playerName);
  const shirtColor = useCampusStore((s) => s.shirtColor);
  const hairColor = useCampusStore((s) => s.hairColor);
  const waveText = useCampusStore((s) => s.waveText);
  const isObserver = useCampusStore((s) => s.isObserver);
  const remotePlayers = useCampusStore((s) => s.remotePlayers);

  const setAvatarTransform = useCampusStore((s) => s.setAvatarTransform);
  const setNearBuildingId = useCampusStore((s) => s.setNearBuildingId);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isFormElementFocused()) return;
      if (e.code === 'Space') {
        const state = useCampusStore.getState();
        if (state.cameraMode !== 'drone' && state.avatarPos[1] <= 0.02) {
          verticalVelRef.current = JUMP_VELOCITY;
        }
      }
      keysRef.current.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };
    const onBlur = () => {
      keysRef.current.clear();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useFrame((frameState, delta) => {
    const state = useCampusStore.getState();
    if (state.cameraMode === 'drone') return;

    const dt = Math.min(delta, 0.05);
    const keys = keysRef.current;
    let moveForward = 0;
    let moveRight = 0;

    if (keys.has('KeyW') || keys.has('ArrowUp')) moveForward += 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) moveForward -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) moveRight += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) moveRight -= 1;

    const [jx, jy] = state.joystickVector;
    if (Math.abs(jx) > 0.05 || Math.abs(jy) > 0.05) {
      moveRight += jx;
      moveForward += jy;
    }

    const isMoving = moveForward !== 0 || moveRight !== 0;
    const isSprinting = keys.has('ShiftLeft') || keys.has('ShiftRight');

    let [curX, curY, curZ] = state.avatarPos;
    const yaw = state.avatarYaw;

    // Step-up trotoar/bangku rendah (< 0.4 / < 0.5) serta tangga & atap Aula
    const groundY = getStepSurfaceY(curX, curZ, curY);

    // Lompat & gravitasi
    if (curY > groundY || verticalVelRef.current > 0) {
      curY += verticalVelRef.current * dt;
      verticalVelRef.current -= GRAVITY * dt;
      if (curY <= groundY) {
        curY = groundY;
        verticalVelRef.current = 0;
      }
    } else if (curY < groundY) {
      curY = groundY;
    }

    // Percepatan halus (menghindari getaran saat mulai/berhenti)
    let targetVx = 0;
    let targetVz = 0;
    if (isMoving) {
      const len = Math.hypot(moveForward, moveRight);
      if (len > 1) {
        moveForward /= len;
        moveRight /= len;
      }
      const speed = BASE_SPEED * (isSprinting ? 2 : 1);
      const fwdX = Math.sin(yaw);
      const fwdZ = Math.cos(yaw);
      const rightX = -Math.cos(yaw);
      const rightZ = Math.sin(yaw);

      targetVx = (fwdX * moveForward + rightX * moveRight) * speed;
      targetVz = (fwdZ * moveForward + rightZ * moveRight) * speed;
    }

    const accelAlpha = 1 - Math.exp(-16 * dt);
    velRef.current.x = THREE.MathUtils.lerp(velRef.current.x, targetVx, accelAlpha);
    velRef.current.z = THREE.MathUtils.lerp(velRef.current.z, targetVz, accelAlpha);

    if (Math.hypot(velRef.current.x, velRef.current.z) > 0.05) {
      const [nextX, nextZ] = resolveAvatarMovement(
        curX,
        curZ,
        curX + velRef.current.x * dt,
        curZ + velRef.current.z * dt,
        0.55,
        curY,
      );
      curX = nextX;
      curZ = nextZ;
    }

    const nextAnim: AvatarAnimState =
      curY > 0.05
        ? 'jump'
        : isMoving
          ? isSprinting
            ? 'run'
            : 'walk'
          : state.waveUntil > Date.now()
            ? 'wave'
            : 'idle';

    if (
      curX !== state.avatarPos[0] ||
      curY !== state.avatarPos[1] ||
      curZ !== state.avatarPos[2] ||
      nextAnim !== state.avatarAnim
    ) {
      setAvatarTransform([curX, curY, curZ], yaw, undefined, nextAnim);
    }

    // Cek gedung terdekat untuk prompt "Tekan E untuk masuk"
    const now = frameState.clock.elapsedTime;
    if (now - nearCheckRef.current > 0.2) {
      nearCheckRef.current = now;
      let nearestId: string | null = null;
      let nearestDist = Infinity;
      for (const b of CAMPUS_BUILDINGS) {
        if (b.id === 'gerbang-utama') continue;
        const dx = Math.max(0, Math.abs(curX - b.posisi[0]) - b.ukuran[0] / 2);
        const dz = Math.max(0, Math.abs(curZ - b.posisi[2]) - b.ukuran[2] / 2);
        const edgeDist = Math.hypot(dx, dz);
        if (edgeDist < 4.5 && edgeDist < nearestDist) {
          nearestDist = edgeDist;
          nearestId = b.id;
        }
      }
      if (nearestId !== state.nearBuildingId) {
        setNearBuildingId(nearestId);
      }
    }
  });

  // Batasi jumlah pemain lain yang dirender penuh ke 30 terdekat
  const visibleRemotePlayers = useMemo(() => {
    if (remotePlayers.length <= 30) return remotePlayers;
    return [...remotePlayers]
      .sort((a, b) => {
        const da = Math.hypot(a.pos[0] - avatarPos[0], a.pos[2] - avatarPos[2]);
        const db = Math.hypot(b.pos[0] - avatarPos[0], b.pos[2] - avatarPos[2]);
        return da - db;
      })
      .slice(0, 30);
  }, [remotePlayers, avatarPos]);

  return (
    <group>
      {!isObserver && (
        <group position={avatarPos} rotation={[0, avatarYaw, 0]}>
          <RobloxCharacterMesh
            name={playerName}
            shirtColor={shirtColor}
            hairColor={hairColor}
            anim={waveText && avatarAnim === 'idle' ? 'wave' : avatarAnim}
            hideBody={cameraMode === 'first'}
            showNameplate={cameraMode !== 'first'}
            waveText={waveText}
          />
        </group>
      )}

      {visibleRemotePlayers.map((peer) => (
        <RemotePlayerAvatar key={peer.id} player={peer} />
      ))}
    </group>
  );
}
