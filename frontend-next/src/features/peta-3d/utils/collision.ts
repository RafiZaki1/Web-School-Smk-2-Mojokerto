import { CAMPUS_BOUNDS, CAMPUS_BUILDINGS, type BuildingVariant } from '../data/campus';
import {
  BENCH_COLLIDERS,
  FENCE_COLLIDERS,
  LAMP_COLLIDERS,
  POOL_COLLIDERS,
  TREE_COLLIDERS,
} from '../data/colliders';

const WALKABLE_VARIANTS = new Set<BuildingVariant>([
  'lapangan',
  'upacara',
  'taman',
  'parkir_motor',
  'parkir_mobil',
]);

export interface AABB {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  maxY: number;
}

// Bangun daftar AABB gedung solid sekali saja untuk deteksi tabrakan avatar & kamera
export const SOLID_BUILDING_BOXES: AABB[] = CAMPUS_BUILDINGS.filter(
  (b) => b.id !== 'gerbang-utama' && !WALKABLE_VARIANTS.has(b.variant ?? 'standard'),
).map((b) => {
  const halfW = b.ukuran[0] / 2;
  const halfD = b.ukuran[2] / 2;
  return {
    id: b.id,
    minX: b.posisi[0] - halfW,
    maxX: b.posisi[0] + halfW,
    minZ: b.posisi[2] - halfD,
    maxZ: b.posisi[2] + halfD,
    maxY: b.ukuran[1] + 0.5,
  };
});

const FENCE_LIMIT_X = CAMPUS_BOUNDS.width / 2 - 1.2;
const FENCE_LIMIT_Z = CAMPUS_BOUNDS.depth / 2 - 1.2;
const MAX_SUBSTEP_DIST = 0.2;

export function isInsideSolidBuilding(
  x: number,
  z: number,
  radius = 0.55,
  currentY = 0,
): boolean {
  // 1. Gedung solid
  for (const box of SOLID_BUILDING_BOXES) {
    if (currentY >= box.maxY - 1.5) continue;
    if (
      x + radius > box.minX &&
      x - radius < box.maxX &&
      z + radius > box.minZ &&
      z - radius < box.maxZ
    ) {
      return true;
    }
  }

  // 2. Pagar keliling (dengan celah di gerbang utama)
  for (const fence of FENCE_COLLIDERS) {
    if (currentY >= fence.height) continue;
    if (
      x + radius > fence.minX &&
      x - radius < fence.maxX &&
      z + radius > fence.minZ &&
      z - radius < fence.maxZ
    ) {
      return true;
    }
  }

  // 3. Kolam air
  for (const pool of POOL_COLLIDERS) {
    if (
      x + radius > pool.minX &&
      x - radius < pool.maxX &&
      z + radius > pool.minZ &&
      z - radius < pool.maxZ
    ) {
      return true;
    }
  }

  // 4. Batang pohon (radius 0.6, tajuk tidak menjadi collider)
  for (const tree of TREE_COLLIDERS) {
    const dist = Math.hypot(x - tree.x, z - tree.z);
    if (dist < radius + tree.radius) {
      return true;
    }
  }

  // 5. Tiang lampu (radius 0.3)
  for (const lamp of LAMP_COLLIDERS) {
    const dist = Math.hypot(x - lamp.x, z - lamp.z);
    if (dist < radius + lamp.radius) {
      return true;
    }
  }

  // 6. Bangku (tinggi < 0.5 boleh dilewati / step-up)
  for (const bench of BENCH_COLLIDERS) {
    if (bench.height < 0.5) continue;
    if (
      x + radius > bench.minX &&
      x - radius < bench.maxX &&
      z + radius > bench.minZ &&
      z - radius < bench.maxZ
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Menghitung tinggi permukaan yang dapat dinaiki (< 0.4 unit untuk trotoar/bangku rendah,
 * serta tangga dan atap Aula menuju LAB. RPL 1 & 2).
 */
export function getStepSurfaceY(x: number, z: number, currentY: number): number {
  let surfaceY = 0;

  // Tangga luar Aula & atap Aula
  if (x >= -6.0 && x <= -2.4 && z >= 30 && z <= 35.1) {
    return Math.max(0, Math.min(7.2, ((35.1 - z) / 5.1) * 7.2));
  }
  if (x >= -30 && x <= -2 && z >= 18 && z <= 30 && currentY >= 5.5) {
    return 7.2;
  }

  // Bangku rendah (< 0.5 unit) atau tepi lapangan/trotoar (< 0.4 unit)
  for (const bench of BENCH_COLLIDERS) {
    if (
      bench.height < 0.5 &&
      x >= bench.minX &&
      x <= bench.maxX &&
      z >= bench.minZ &&
      z <= bench.maxZ
    ) {
      surfaceY = Math.max(surfaceY, bench.height);
    }
  }

  // Area lapangan / parkiran / upacara (tinggi 0.35 < 0.4)
  for (const b of CAMPUS_BUILDINGS) {
    if (!WALKABLE_VARIANTS.has(b.variant ?? 'standard')) continue;
    const hw = b.ukuran[0] / 2;
    const hd = b.ukuran[2] / 2;
    if (Math.abs(x - b.posisi[0]) <= hw && Math.abs(z - b.posisi[2]) <= hd) {
      surfaceY = Math.max(surfaceY, Math.min(0.35, b.ukuran[1]));
    }
  }

  return surfaceY;
}

/**
 * Menggerakkan avatar dari (curX, curZ) menuju (nextX, nextZ) dengan sub-stepping
 * (maks 0,2 unit per langkah) dan wall sliding terpisah untuk sumbu X dan Z.
 */
export function resolveAvatarMovement(
  curX: number,
  curZ: number,
  nextX: number,
  nextZ: number,
  radius = 0.55,
  currentY = 0,
): [number, number] {
  const targetX = Math.max(-FENCE_LIMIT_X, Math.min(FENCE_LIMIT_X, nextX));
  const targetZ = Math.max(-FENCE_LIMIT_Z, Math.min(FENCE_LIMIT_Z, nextZ));

  const totalDx = targetX - curX;
  const totalDz = targetZ - curZ;
  const totalDist = Math.hypot(totalDx, totalDz);
  if (totalDist < 1e-5) return [curX, curZ];

  const steps = Math.max(1, Math.ceil(totalDist / MAX_SUBSTEP_DIST));
  const stepDx = totalDx / steps;
  const stepDz = totalDz / steps;

  let x = curX;
  let z = curZ;

  for (let i = 0; i < steps; i++) {
    const tryX = Math.max(-FENCE_LIMIT_X, Math.min(FENCE_LIMIT_X, x + stepDx));
    if (!isInsideSolidBuilding(tryX, z, radius, currentY)) {
      x = tryX;
    }

    const tryZ = Math.max(-FENCE_LIMIT_Z, Math.min(FENCE_LIMIT_Z, z + stepDz));
    if (!isInsideSolidBuilding(x, tryZ, radius, currentY)) {
      z = tryZ;
    }
  }

  return [x, z];
}

/**
 * Mendorong avatar ke titik terdekat yang kosong jika berada di dalam bangunan saat ganti mode.
 */
export function pushOutOfObstacles(
  x: number,
  z: number,
  radius = 0.55,
  currentY = 0,
): [number, number] {
  if (!isInsideSolidBuilding(x, z, radius, currentY)) return [x, z];

  for (let dist = 0.5; dist <= 12; dist += 0.5) {
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const candX = Math.max(-FENCE_LIMIT_X, Math.min(FENCE_LIMIT_X, x + Math.cos(angle) * dist));
      const candZ = Math.max(-FENCE_LIMIT_Z, Math.min(FENCE_LIMIT_Z, z + Math.sin(angle) * dist));
      if (!isInsideSolidBuilding(candX, candZ, radius, currentY)) {
        return [candX, candZ];
      }
    }
  }
  return [0, -50.5];
}

/**
 * Mencegah kamera First Person menembus dinding dengan mendorong mundur/menjauh
 * bila titik di depan mata berada terlalu dekat atau di dalam AABB bangunan.
 */
export function clampFirstPersonCamera(
  headPos: [number, number, number],
  fwdX: number,
  fwdZ: number,
): [number, number, number] {
  const [hx, hy, hz] = headPos;
  const probeDist = 0.4;
  const px = hx + fwdX * probeDist;
  const pz = hz + fwdZ * probeDist;

  for (const box of SOLID_BUILDING_BOXES) {
    if (hy >= box.maxY) continue;
    if (px > box.minX && px < box.maxX && pz > box.minZ && pz < box.maxZ) {
      // Tarik kamera sedikit mundur dari arah dinding agar tidak menembus
      return [hx - fwdX * 0.28, hy, hz - fwdZ * 0.28];
    }
  }
  return headPos;
}

/**
 * Mencegah kamera Third Person menembus dinding bangunan dengan menarik kamera
 * lebih dekat ke kepala avatar jika titik kamera terhalang AABB bangunan.
 */
export function clampThirdPersonCamera(
  headPos: [number, number, number],
  desiredCamPos: [number, number, number],
): [number, number, number] {
  const steps = 10;
  let safePos: [number, number, number] = headPos;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const px = headPos[0] + (desiredCamPos[0] - headPos[0]) * t;
    const py = headPos[1] + (desiredCamPos[1] - headPos[1]) * t;
    const pz = headPos[2] + (desiredCamPos[2] - headPos[2]) * t;

    let blocked = false;
    for (const box of SOLID_BUILDING_BOXES) {
      if (
        px > box.minX - 0.35 &&
        px < box.maxX + 0.35 &&
        pz > box.minZ - 0.35 &&
        pz < box.maxZ + 0.35 &&
        py < box.maxY + 0.5
      ) {
        blocked = true;
        break;
      }
    }

    if (blocked) {
      break;
    }
    safePos = [px, Math.max(0.8, py), pz];
  }

  return safePos;
}
