'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CAMPUS_BOUNDS } from '../data/campus';
import {
  BENCH_POSITIONS,
  GREEN_TREE_POSITIONS,
  LAMP_POSITIONS,
  PALM_TREE_POSITIONS,
  YELLOW_TREE_POSITIONS,
} from '../data/colliders';
import { useCampusStore } from '../store/useCampusStore';
import { getGrassTexture, getPavingTexture } from '../utils/textures';

const TRASH_BIN_POSITIONS: Array<[number, number, number]> = [
  [-31, 0, -16],
  [-31, 0, 18.5],
  [42, 0, -18.5],
];

const FLOWER_DATA: Array<{ pos: [number, number, number]; color: string }> = [
  { pos: [-51, 0.25, -21], color: '#f43f5e' },
  { pos: [-49, 0.25, -21], color: '#facc15' },
  { pos: [-50, 0.25, -20], color: '#a855f7' },
  { pos: [57, 0.25, -21], color: '#fb7185' },
  { pos: [59, 0.25, -21], color: '#facc15' },
  { pos: [58, 0.25, -20], color: '#a855f7' },
  { pos: [-28, 0.25, 13], color: '#ef4444' },
  { pos: [-26, 0.25, 13], color: '#facc15' },
  { pos: [-27, 0.25, 14], color: '#a855f7' },
];

const ROAD_DASHES: Array<{ pos: [number, number, number]; rotY: number }> = [
  // Jalan utama utara (-Z ke gedung utama)
  ...[-49, -45, -41, -37].map((z) => ({ pos: [0, 0.04, z] as [number, number, number], rotY: Math.PI / 2 })),
  // Jalan horizontal tengah atas & bawah
  ...[-75, -60, -45, -20, 15, 30, 55, 70].map((x) => ({ pos: [x, 0.04, -33.5] as [number, number, number], rotY: 0 })),
  ...[-75, -60, -45, -20, 15, 30, 55, 70].map((x) => ({ pos: [x, 0.04, -19] as [number, number, number], rotY: 0 })),
  ...[-75, -60, -45, -20, 15, 30, 55, 70].map((x) => ({ pos: [x, 0.04, 15.5] as [number, number, number], rotY: 0 })),
];

const FENCE_POSTS: Array<[number, number, number]> = [
  ...[-98, -78, -58, -38, -18, 18, 38, 58, 78, 98].map((x) => [x, 1.2, -54] as [number, number, number]),
  ...[-98, -74, -50, -26, 0, 26, 50, 74, 98].map((x) => [x, 1.2, 54] as [number, number, number]),
  ...[-36, -18, 0, 18, 36].map((z) => [-100, 1.2, z] as [number, number, number]),
  ...[-36, -18, 0, 18, 36].map((z) => [100, 1.2, z] as [number, number, number]),
];

export function Environment() {
  const isNight = useCampusStore((s) => s.isNight);

  const pavingTex = useMemo(() => getPavingTexture(), []);
  const grassTex = useMemo(() => getGrassTexture(), []);

  const greenTrunkRef = useRef<THREE.InstancedMesh>(null);
  const greenCrownRef = useRef<THREE.InstancedMesh>(null);
  const yellowTrunkRef = useRef<THREE.InstancedMesh>(null);
  const yellowCrownRef = useRef<THREE.InstancedMesh>(null);
  const palmTrunkRef = useRef<THREE.InstancedMesh>(null);
  const palmCrownRef = useRef<THREE.InstancedMesh>(null);

  const lampPoleRef = useRef<THREE.InstancedMesh>(null);
  const lampBulbRef = useRef<THREE.InstancedMesh>(null);
  const benchSeatRef = useRef<THREE.InstancedMesh>(null);
  const trashBinRef = useRef<THREE.InstancedMesh>(null);
  const flowerRef = useRef<THREE.InstancedMesh>(null);
  const dashRef = useRef<THREE.InstancedMesh>(null);
  const fencePostRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    if (greenTrunkRef.current && greenCrownRef.current) {
      GREEN_TREE_POSITIONS.forEach(([x, y, z], i) => {
        dummy.position.set(x, y + 1.2, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        greenTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 3.4, z);
        const s = 0.85 + (i % 4) * 0.12;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        greenCrownRef.current!.setMatrixAt(i, dummy.matrix);
      });
      greenTrunkRef.current.instanceMatrix.needsUpdate = true;
      greenCrownRef.current.instanceMatrix.needsUpdate = true;
    }

    if (yellowTrunkRef.current && yellowCrownRef.current) {
      YELLOW_TREE_POSITIONS.forEach(([x, y, z], i) => {
        dummy.position.set(x, y + 1.1, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        yellowTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 3.1, z);
        const s = 0.8 + (i % 3) * 0.14;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        yellowCrownRef.current!.setMatrixAt(i, dummy.matrix);
      });
      yellowTrunkRef.current.instanceMatrix.needsUpdate = true;
      yellowCrownRef.current.instanceMatrix.needsUpdate = true;
    }

    if (palmTrunkRef.current && palmCrownRef.current) {
      PALM_TREE_POSITIONS.forEach(([x, y, z], i) => {
        dummy.position.set(x, y + 2.8, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        palmTrunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 5.7, z);
        dummy.scale.set(1.25, 0.55, 1.25);
        dummy.updateMatrix();
        palmCrownRef.current!.setMatrixAt(i, dummy.matrix);
      });
      palmTrunkRef.current.instanceMatrix.needsUpdate = true;
      palmCrownRef.current.instanceMatrix.needsUpdate = true;
    }

    if (lampPoleRef.current && lampBulbRef.current) {
      LAMP_POSITIONS.forEach(([x, y, z], i) => {
        dummy.position.set(x, y + 2.3, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        lampPoleRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(x, y + 4.7, z);
        dummy.updateMatrix();
        lampBulbRef.current!.setMatrixAt(i, dummy.matrix);
      });
      lampPoleRef.current.instanceMatrix.needsUpdate = true;
      lampBulbRef.current.instanceMatrix.needsUpdate = true;
    }

    if (benchSeatRef.current) {
      BENCH_POSITIONS.forEach(([x, y, z], i) => {
        dummy.position.set(x, y + 0.55, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        benchSeatRef.current!.setMatrixAt(i, dummy.matrix);
      });
      benchSeatRef.current.instanceMatrix.needsUpdate = true;
    }

    if (trashBinRef.current) {
      TRASH_BIN_POSITIONS.forEach(([x, y, z], i) => {
        dummy.position.set(x, y + 0.45, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        trashBinRef.current!.setMatrixAt(i, dummy.matrix);
      });
      trashBinRef.current.instanceMatrix.needsUpdate = true;
    }

    if (flowerRef.current) {
      const col = new THREE.Color();
      FLOWER_DATA.forEach((f, i) => {
        dummy.position.set(...f.pos);
        dummy.rotation.set(0, i * 0.5, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        flowerRef.current!.setMatrixAt(i, dummy.matrix);
        col.set(f.color);
        flowerRef.current!.setColorAt(i, col);
      });
      flowerRef.current.instanceMatrix.needsUpdate = true;
      if (flowerRef.current.instanceColor) {
        flowerRef.current.instanceColor.needsUpdate = true;
      }
    }

    if (dashRef.current) {
      ROAD_DASHES.forEach((d, i) => {
        dummy.position.set(...d.pos);
        dummy.rotation.set(-Math.PI / 2, 0, d.rotY);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        dashRef.current!.setMatrixAt(i, dummy.matrix);
      });
      dashRef.current.instanceMatrix.needsUpdate = true;
    }

    if (fencePostRef.current) {
      FENCE_POSTS.forEach(([x, y, z], i) => {
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        fencePostRef.current!.setMatrixAt(i, dummy.matrix);
      });
      fencePostRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  const skyColor = isNight ? '#0b132b' : '#bae6fd';
  const fogColor = isNight ? '#0f172a' : '#dbeafe';
  const roadColor = isNight ? '#1e293b' : '#475569';
  const sidewalkColor = isNight ? '#475569' : '#cbd5e1';
  const courtyardColor = isNight ? '#2b3340' : '#f3efe6';

  return (
    <group>
      {/* Langit & Kabut tipis */}
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[fogColor, 145, 290]} />

      {/* Pencahayaan Siang / Malam (tetap terang dan seimbang) */}
      <ambientLight intensity={isNight ? 0.35 : 0.55} />
      <hemisphereLight
        args={[
          isNight ? '#334155' : '#f0f9ff',
          isNight ? '#1e293b' : '#84cc16',
          isNight ? 0.42 : 0.65,
        ]}
      />
      <directionalLight
        position={isNight ? [-45, 55, -35] : [60, 88, 55]}
        intensity={isNight ? 0.65 : 1.35}
        color={isNight ? '#93c5fd' : '#fffbeb'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-camera-near={10}
        shadow-camera-far={240}
        shadow-bias={-0.0004}
      />

      {/* Rumput hijau cerah prosedural di tepi luar */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <planeGeometry args={[CAMPUS_BOUNDS.width + 24, CAMPUS_BOUNDS.depth + 24]} />
        <meshStandardMaterial
          color={isNight ? '#14532d' : '#ffffff'}
          map={grassTex}
          roughness={1}
        />
      </mesh>

      {/* Halaman terbuka krem terang (200 x 110) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[CAMPUS_BOUNDS.width, CAMPUS_BOUNDS.depth]} />
        <meshStandardMaterial color={courtyardColor} roughness={0.95} />
      </mesh>

      {/* Paving krem berpola halus di halaman depan Gedung Utama */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -21]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color={isNight ? '#475569' : '#ffffff'} map={pavingTex} roughness={0.9} />
      </mesh>

      {/* Trotoar abu-abu terang & Jalan aspal abu-abu gelap */}
      <group position={[0, 0.015, 0]}>
        {/* Trotoar dasar */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]} receiveShadow>
          <planeGeometry args={[16.5, 24]} />
          <meshStandardMaterial color={sidewalkColor} roughness={0.92} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -33.5]} receiveShadow>
          <planeGeometry args={[178, 6.8]} />
          <meshStandardMaterial color={sidewalkColor} roughness={0.92} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -19]} receiveShadow>
          <planeGeometry args={[178, 6.4]} />
          <meshStandardMaterial color={sidewalkColor} roughness={0.92} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 15.5]} receiveShadow>
          <planeGeometry args={[178, 6.4]} />
          <meshStandardMaterial color={sidewalkColor} roughness={0.92} />
        </mesh>

        {/* Jalan aspal abu-abu gelap */}
        <group position={[0, 0.012, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]} receiveShadow>
            <planeGeometry args={[13, 24]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -33.5]} receiveShadow>
            <planeGeometry args={[175, 4.4]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -19]} receiveShadow>
            <planeGeometry args={[175, 4.2]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 15.5]} receiveShadow>
            <planeGeometry args={[175, 4.2]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-60, 0, 31]} receiveShadow>
            <planeGeometry args={[56, 3.8]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[33.5, 0, 31]} receiveShadow>
            <planeGeometry args={[69, 3.8]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
          {/* Jalan kecil */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-16.5, 0.005, 36.5]} receiveShadow>
            <planeGeometry args={[31, 4]} />
            <meshStandardMaterial color="#64748b" roughness={0.92} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[21.25, 0.005, 43]} receiveShadow>
            <planeGeometry args={[44.5, 4]} />
            <meshStandardMaterial color="#64748b" roughness={0.92} />
          </mesh>
          {/* Koridor vertikal */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-68, 0, -4]} receiveShadow>
            <planeGeometry args={[4.2, 56]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-32, 0, 4]} receiveShadow>
            <planeGeometry args={[4.2, 76]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0, -28]} receiveShadow>
            <planeGeometry args={[4.2, 18]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0, 32]} receiveShadow>
            <planeGeometry args={[4.2, 33]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[43.5, 0, 4]} receiveShadow>
            <planeGeometry args={[4.2, 76]} />
            <meshStandardMaterial color={roadColor} roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Garis putus-putus putih jalan utama (InstancedMesh) */}
      <instancedMesh ref={dashRef} args={[undefined, undefined, ROAD_DASHES.length]}>
        <planeGeometry args={[2.8, 0.25]} />
        <meshBasicMaterial color="#f8fafc" />
      </instancedMesh>

      {/* Pagar Keliling Sekolah: palang besi + tiang beton (InstancedMesh) */}
      <group>
        <mesh position={[-54, 1.0, -54]} castShadow>
          <boxGeometry args={[92, 1.6, 0.22]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[54, 1.0, -54]} castShadow>
          <boxGeometry args={[92, 1.6, 0.22]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.0, 54]} castShadow>
          <boxGeometry args={[200, 1.6, 0.22]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[-100, 1.0, 0]} castShadow>
          <boxGeometry args={[0.22, 1.6, 108]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[100, 1.0, 0]} castShadow>
          <boxGeometry args={[0.22, 1.6, 108]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>
      <instancedMesh ref={fencePostRef} args={[undefined, undefined, FENCE_POSTS.length]} castShadow>
        <boxGeometry args={[0.7, 2.4, 0.7]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.85} />
      </instancedMesh>

      {/* Pohon Bulat Hijau (InstancedMesh) */}
      <instancedMesh ref={greenTrunkRef} args={[undefined, undefined, GREEN_TREE_POSITIONS.length]} castShadow>
        <cylinderGeometry args={[0.26, 0.4, 2.4, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={greenCrownRef} args={[undefined, undefined, GREEN_TREE_POSITIONS.length]} castShadow>
        <icosahedronGeometry args={[2.0, 1]} />
        <meshStandardMaterial color={isNight ? '#14532d' : '#16a34a'} roughness={0.85} />
      </instancedMesh>

      {/* Pohon Kuning Aksen (InstancedMesh) */}
      <instancedMesh ref={yellowTrunkRef} args={[undefined, undefined, YELLOW_TREE_POSITIONS.length]} castShadow>
        <cylinderGeometry args={[0.22, 0.34, 2.2, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={yellowCrownRef} args={[undefined, undefined, YELLOW_TREE_POSITIONS.length]} castShadow>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial color={isNight ? '#a16207' : '#eab308'} roughness={0.85} />
      </instancedMesh>

      {/* Pohon Palem Tinggi di Tepi Jalan (InstancedMesh) */}
      <instancedMesh ref={palmTrunkRef} args={[undefined, undefined, PALM_TREE_POSITIONS.length]} castShadow>
        <cylinderGeometry args={[0.18, 0.3, 5.6, 6]} />
        <meshStandardMaterial color="#92400e" roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={palmCrownRef} args={[undefined, undefined, PALM_TREE_POSITIONS.length]} castShadow>
        <dodecahedronGeometry args={[1.9, 0]} />
        <meshStandardMaterial color={isNight ? '#15803d' : '#22c55e'} roughness={0.85} />
      </instancedMesh>

      {/* Bunga warna-warni di taman & sudut halaman (InstancedMesh) */}
      <instancedMesh ref={flowerRef} args={[undefined, undefined, FLOWER_DATA.length]}>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>

      {/* Lampu Jalan Tipis dengan Ujung Kuning (InstancedMesh) */}
      <instancedMesh ref={lampPoleRef} args={[undefined, undefined, LAMP_POSITIONS.length]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 4.6, 6]} />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={lampBulbRef} args={[undefined, undefined, LAMP_POSITIONS.length]}>
        <sphereGeometry args={[0.34, 8, 8]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={isNight ? 2.6 : 0.9}
        />
      </instancedMesh>

      {/* Bangku Taman Kayu Cokelat (InstancedMesh) */}
      <instancedMesh ref={benchSeatRef} args={[undefined, undefined, BENCH_POSITIONS.length]} castShadow>
        <boxGeometry args={[2.2, 0.45, 0.85]} />
        <meshStandardMaterial color="#92400e" roughness={0.85} />
      </instancedMesh>

      {/* Tempat Sampah Kecil di Sudut Taman (InstancedMesh) */}
      <instancedMesh ref={trashBinRef} args={[undefined, undefined, TRASH_BIN_POSITIONS.length]} castShadow>
        <cylinderGeometry args={[0.32, 0.28, 0.9, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </instancedMesh>
    </group>
  );
}
