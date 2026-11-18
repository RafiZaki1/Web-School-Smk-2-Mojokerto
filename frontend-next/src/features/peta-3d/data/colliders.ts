import { CAMPUS_BUILDINGS } from './campus';

export interface CylinderCollider {
  id: string;
  x: number;
  z: number;
  radius: number;
}

export interface BoxCollider {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  height: number;
}

export const GREEN_TREE_POSITIONS: Array<[number, number, number]> = [
  [-92, 0, -50], [-80, 0, -50], [-56, 0, -50], [-44, 0, -50],
  [44, 0, -50], [56, 0, -50], [80, 0, -50], [92, 0, -50],
  [-92, 0, 50], [-60, 0, 50], [-34, 0, 50], [52, 0, 50], [92, 0, 50],
  [-95, 0, -34], [-95, 0, -18], [-95, 0, 4], [-95, 0, 22], [-95, 0, 38],
  [95, 0, -34], [95, 0, -18], [95, 0, 4], [95, 0, 22], [95, 0, 38],
  [-27, 0, -14], [-27, 0, 10], [37, 0, -14], [37, 0, 10],
  [-36, 0, -35], [20, 0, -35], [-70, 0, -21], [41, 0, -21],
  [-70, 0, 13], [41, 0, 13], [-52, 0, 33], [52, 0, 33],
];

export const YELLOW_TREE_POSITIONS: Array<[number, number, number]> = [
  [-68, 0, -50], [68, 0, -50],
  [-76, 0, 50], [72, 0, 50],
  [-27, 0, -2], [37, 0, -2],
  [-20, 0, -35], [38, 0, -35],
];

export const PALM_TREE_POSITIONS: Array<[number, number, number]> = [
  [-9, 0, -43], [9, 0, -43],
  [-34, 0, -21], [-3, 0, -21],
  [-34, 0, 13], [-3, 0, 13],
];

export const LAMP_POSITIONS: Array<[number, number, number]> = [
  [-6, 0, -44], [6, 0, -44],
  [-60, 0, -34], [-22, 0, -34], [22, 0, -34], [60, 0, -34],
  [-64, 0, -18], [-32, 0, -18], [0, 0, -18], [44, 0, -18], [72, 0, -18],
  [-64, 0, 14], [-32, 0, 14], [0, 0, 14], [44, 0, 14], [72, 0, 14],
  [-36, 0, 30], [4, 0, 30], [46, 0, 30],
];

export const BENCH_POSITIONS: Array<[number, number, number]> = [
  [-30, 0, -17], [2, 0, -17],
  [-30, 0, 17], [2, 0, 17],
  [41, 0, -17], [41, 0, 17],
];

// Collider silinder untuk batang pohon (radius 0.6 unit, tajuk tidak menjadi collider)
export const TREE_COLLIDERS: CylinderCollider[] = [
  ...GREEN_TREE_POSITIONS.map(([x, , z], i) => ({
    id: `tree-green-${i}`,
    x,
    z,
    radius: 0.6,
  })),
  ...YELLOW_TREE_POSITIONS.map(([x, , z], i) => ({
    id: `tree-yellow-${i}`,
    x,
    z,
    radius: 0.6,
  })),
  ...PALM_TREE_POSITIONS.map(([x, , z], i) => ({
    id: `tree-palm-${i}`,
    x,
    z,
    radius: 0.6,
  })),
];

// Collider silinder untuk tiang lampu (radius 0.3 unit)
export const LAMP_COLLIDERS: CylinderCollider[] = LAMP_POSITIONS.map(([x, , z], i) => ({
  id: `lamp-${i}`,
  x,
  z,
  radius: 0.3,
}));

// Collider kotak tipis untuk bangku (tinggi 0.45 < 0.5, boleh dilewati)
export const BENCH_COLLIDERS: BoxCollider[] = BENCH_POSITIONS.map(([x, , z], i) => ({
  id: `bench-${i}`,
  minX: x - 1.1,
  maxX: x + 1.1,
  minZ: z - 0.425,
  maxZ: z + 0.425,
  height: 0.45,
}));

// Collider pagar keliling dengan celah lebar di Gerbang Utama (x: -8 .. +8)
export const FENCE_COLLIDERS: BoxCollider[] = [
  { id: 'fence-north-west', minX: -100, maxX: -8, minZ: -54.4, maxZ: -53.6, height: 2.2 },
  { id: 'fence-north-east', minX: 8, maxX: 100, minZ: -54.4, maxZ: -53.6, height: 2.2 },
  { id: 'fence-south', minX: -100, maxX: 100, minZ: 53.6, maxZ: 54.4, height: 2.2 },
  { id: 'fence-west', minX: -100.4, maxX: -99.6, minZ: -54, maxZ: 54, height: 2.2 },
  { id: 'fence-east', minX: 99.6, maxX: 100.4, minZ: -54, maxZ: 54, height: 2.2 },
];

// Collider kolam jika ada entri bertipe 'taman' dengan kolam
export const POOL_COLLIDERS: BoxCollider[] = CAMPUS_BUILDINGS.filter(
  (b) => b.variant === 'taman',
).map((b) => ({
  id: `pool-${b.id}`,
  minX: b.posisi[0] - 2.2,
  maxX: b.posisi[0] + 5.0,
  minZ: b.posisi[2] - 3.6,
  maxZ: b.posisi[2] + 3.6,
  height: 1.0,
}));
