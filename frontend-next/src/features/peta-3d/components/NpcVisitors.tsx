'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMPUS_BUILDINGS } from '../data/campus';
import { type AvatarAnimState, useCampusStore } from '../store/useCampusStore';
import { RobloxCharacterMesh } from './Avatar';

type Point = [number, number, number];

const WALK_SPEED = 3.6;
const PAUSE_SECONDS = 2.5;

// Peran warga NPC. Tidak dihitung sebagai pemain online.
const NPC_ROLES: Array<{ name: string; shirt: string; hair: string }> = [
  { name: 'Siswa RPL', shirt: '#ec4899', hair: '#1f2937' },
  { name: 'Siswa DKV', shirt: '#65a30d', hair: '#3f2a1d' },
  { name: 'Siswa LPS', shirt: '#64748b', hair: '#111827' },
  { name: 'Siswa APHP', shirt: '#f97316', hair: '#292524' },
  { name: 'Siswa Kuliner', shirt: '#eab308', hair: '#1c1917' },
  { name: 'Guru Piket', shirt: '#1d4ed8', hair: '#44403c' },
  { name: 'Staf TU', shirt: '#0f766e', hair: '#27272a' },
  { name: 'Tamu Sekolah', shirt: '#7c3aed', hair: '#3f3f46' },
];

interface NpcPath {
  points: THREE.Vector3[];
  lengths: number[];
  total: number;
}

function buildPath(points: Point[]): NpcPath {
  const vecs = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  const lengths = vecs.slice(1).map((v, i) => v.distanceTo(vecs[i]));
  return { points: vecs, lengths, total: lengths.reduce((a, b) => a + b, 0) };
}

/** Posisi dan arah pada jarak tertentu sepanjang jalur. */
function sampleAt(path: NpcPath, distance: number, out: THREE.Vector3): THREE.Vector3 {
  let remaining = THREE.MathUtils.clamp(distance, 0, path.total);
  for (let i = 0; i < path.lengths.length; i++) {
    const len = path.lengths[i];
    if (remaining <= len || i === path.lengths.length - 1) {
      const t = len === 0 ? 0 : remaining / len;
      return out.lerpVectors(path.points[i], path.points[i + 1], Math.min(t, 1));
    }
    remaining -= len;
  }
  return out.copy(path.points[path.points.length - 1]);
}

function NpcWalker({ path, role, startFraction }: { path: NpcPath; role: (typeof NPC_ROLES)[number]; startFraction: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const [anim, setAnim] = useState<AvatarAnimState>('walk');
  const state = useRef({ dist: path.total * startFraction, dir: 1, pause: 0 });
  const pos = useRef(new THREE.Vector3());
  const ahead = useRef(new THREE.Vector3());

  useFrame(({ invalidate }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(delta, 0.05);
    const s = state.current;

    if (s.pause > 0) {
      s.pause -= dt;
      if (s.pause <= 0) setAnim('walk');
    } else {
      s.dist += s.dir * WALK_SPEED * dt;
      if (s.dist >= path.total || s.dist <= 0) {
        s.dist = THREE.MathUtils.clamp(s.dist, 0, path.total);
        s.dir *= -1;
        s.pause = PAUSE_SECONDS;
        setAnim('idle');
      }
    }

    sampleAt(path, s.dist, pos.current);
    group.position.copy(pos.current);

    sampleAt(path, s.dist + s.dir * 0.5, ahead.current);
    const dx = ahead.current.x - pos.current.x;
    const dz = ahead.current.z - pos.current.z;
    if (dx * dx + dz * dz > 1e-4) {
      group.rotation.y = Math.atan2(dx, dz);
    }

    // NPC terus bergerak, jadi minta frame berikutnya walau frameloop "demand"
    invalidate();
  });

  return (
    <group ref={groupRef}>
      <RobloxCharacterMesh
        name={role.name}
        shirtColor={role.shirt}
        hairColor={role.hair}
        anim={anim}
        showNameplate={cameraMode !== 'first'}
        npc
      />
    </group>
  );
}

// Data rute statis, jadi jalur NPC cukup dihitung sekali saat modul dimuat
const WALKERS = (() => {
  const routed = CAMPUS_BUILDINGS.filter((b) => (b.rute?.length ?? 0) >= 3);
  if (routed.length === 0) return [];
  const step = Math.max(1, Math.floor(routed.length / NPC_ROLES.length));
  return NPC_ROLES.map((role, i) => {
    const building = routed[(i * step) % routed.length];
    return {
      key: `${role.name}-${building.id}`,
      role,
      path: buildPath(building.rute as Point[]),
      startFraction: ((i * 0.37) % 1) * 0.9 + 0.05,
    };
  }).filter((w) => w.path.total > 4);
})();

export function NpcVisitors() {
  return (
    <group>
      {WALKERS.map((w) => (
        <NpcWalker key={w.key} path={w.path} role={w.role} startFraction={w.startFraction} />
      ))}
    </group>
  );
}
