'use client';

import { useMemo } from 'react';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { CampusBuilding } from '../data/campus';
import { useCampusStore } from '../store/useCampusStore';
import { getGrassTexture, getTileRoofTextures } from '../utils/textures';

interface BuildingProps {
  building: CampusBuilding;
}

const BORDER_COLOR = '#0f172a';
const TRIM_COLOR = '#f8fafc';
const GLASS_COLOR = '#38bdf8';

export function Building({ building }: BuildingProps) {
  const { invalidate } = useThree();
  const selectedId = useCampusStore((s) => s.selectedId);
  const hoveredId = useCampusStore((s) => s.hoveredId);
  const showLabels = useCampusStore((s) => s.showLabels);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const selectBuilding = useCampusStore((s) => s.selectBuilding);
  const setHoveredId = useCampusStore((s) => s.setHoveredId);

  const isSelected = selectedId === building.id;
  const isHovered = hoveredId === building.id;
  const isHighlighted = isSelected || isHovered;

  const [w, h, d] = building.ukuran;
  const variant = building.variant ?? 'standard';

  const orangeRoofTex = useMemo(
    () => getTileRoofTextures(['#c2410c', '#ea580c', '#f97316']),
    [],
  );
  const tealRoofTex = useMemo(
    () => getTileRoofTextures(['#0f766e', '#0d9488', '#14b8a6']),
    [],
  );

  const roofRadius = useMemo(() => Math.hypot(w, d) * 0.53, [w, d]);
  const roofHeight = useMemo(() => Math.min(2.6, Math.max(1.4, Math.min(w, d) * 0.28)), [w, d]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHoveredId(building.id);
    invalidate();
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    if (hoveredId === building.id) {
      setHoveredId(null);
    }
    invalidate();
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectBuilding(building);
    invalidate();
  };

  const outlineColor = isSelected ? '#facc15' : isHovered ? '#38bdf8' : BORDER_COLOR;
  const isFlatBlock = variant === 'standard' || variant === 'two_story';
  const showTag =
    (cameraMode === 'drone' && (isFlatBlock || showLabels || isHighlighted)) ||
    (cameraMode !== 'drone' && (showLabels || isHighlighted));

  const isAula = building.id === 'aula-smkn2';

  return (
    <group
      position={building.posisi}
      rotation={building.rotasi ?? [0, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {variant === 'lapangan' && (
        <LapanganMesh w={w} d={d} isHighlighted={isHighlighted} outlineColor={outlineColor} />
      )}

      {variant === 'taman' && (
        <TamanMesh w={w} d={d} isHighlighted={isHighlighted} outlineColor={outlineColor} />
      )}

      {variant === 'upacara' && (
        <UpacaraMesh w={w} d={d} isHighlighted={isHighlighted} outlineColor={outlineColor} />
      )}

      {variant === 'parkir_motor' && (
        <ParkirMotorMesh w={w} d={d} isHighlighted={isHighlighted} outlineColor={outlineColor} />
      )}

      {variant === 'parkir_mobil' && (
        <ParkirMobilMesh w={w} d={d} isHighlighted={isHighlighted} outlineColor={outlineColor} />
      )}

      {/* Bangunan kelas, lab, kios, dan pos satpam dengan atap genteng oranye */}
      {(variant === 'standard' || variant === 'two_story' || variant === 'pos_satpam') && (
        <group>
          {/* Pondasi tipis */}
          <mesh position={[0, 0.12, 0]} receiveShadow>
            <boxGeometry args={[w + 0.4, 0.24, d + 0.4]} />
            <meshStandardMaterial color="#d6d3d1" roughness={0.9} />
          </mesh>

          {/* Dinding */}
          <mesh position={[0, h / 2 + 0.24, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color={building.warna}
              roughness={0.78}
              emissive={isHighlighted ? outlineColor : '#000000'}
              emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
            />
            <Edges color={isHighlighted ? outlineColor : BORDER_COLOR} threshold={15} />
          </mesh>

          {/* Jendela biru tipis di sisi depan */}
          <mesh position={[0, h * 0.56 + 0.24, d / 2 + 0.03]}>
            <boxGeometry args={[w * 0.72, Math.min(0.85, h * 0.25), 0.06]} />
            <meshStandardMaterial color={GLASS_COLOR} roughness={0.25} metalness={0.15} />
          </mesh>
          {building.lantai === 2 && !isAula && (
            <mesh position={[0, h * 0.26 + 0.24, d / 2 + 0.03]}>
              <boxGeometry args={[w * 0.72, 0.75, 0.06]} />
              <meshStandardMaterial color={GLASS_COLOR} roughness={0.25} metalness={0.15} />
            </mesh>
          )}

          {/* Lis tepi atap putih/krem */}
          <mesh position={[0, h + 0.28, 0]} castShadow>
            <boxGeometry args={[w + 0.5, 0.16, d + 0.5]} />
            <meshStandardMaterial color={TRIM_COLOR} roughness={0.7} />
          </mesh>

          {/* Atap genteng miring (kecuali Aula karena LAB RPL 1-2 berada di atasnya) */}
          {!isAula && (
            <mesh
              position={[0, h + 0.36 + roofHeight / 2, 0]}
              rotation={[0, Math.PI / 4, 0]}
              castShadow
              receiveShadow
            >
              <coneGeometry args={[roofRadius, roofHeight, 4]} />
              <meshStandardMaterial
                color="#ffffff"
                map={orangeRoofTex?.map ?? null}
                bumpMap={orangeRoofTex?.bumpMap ?? null}
                bumpScale={0.14}
                roughness={0.72}
              />
            </mesh>
          )}

          {/* Tangga luar di pinggir depan Aula menuju LAB. RPL 1 & 2 */}
          {isAula && (
            <group position={[w / 2 - 2.2, 0, d / 2]}>
              {Array.from({ length: 12 }).map((_, idx) => {
                const stepH = h / 12;
                const stepD = 0.42;
                const yPos = stepH * (idx + 0.5);
                const zPos = (12 - idx) * stepD;
                return (
                  <mesh key={idx} position={[0, yPos, zPos]} castShadow receiveShadow>
                    <boxGeometry args={[3.4, stepH, stepD]} />
                    <meshStandardMaterial color="#cbd5e1" roughness={0.85} />
                    <Edges color={BORDER_COLOR} />
                  </mesh>
                );
              })}
              {[-1.75, 1.75].map((rx) => (
                <mesh
                  key={rx}
                  position={[rx, h * 0.5 + 0.55, 2.7]}
                  rotation={[Math.atan2(h, 5.04), 0, 0]}
                  castShadow
                >
                  <boxGeometry args={[0.14, 0.14, Math.hypot(h, 5.04)]} />
                  <meshStandardMaterial color={BORDER_COLOR} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      )}

      {/* Musholla: dinding krem, atap genteng hijau kebiruan + kubah hijau kebiruan */}
      {variant === 'musholla' && (
        <group>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color={building.warna}
              roughness={0.75}
              emissive={isHighlighted ? outlineColor : '#000000'}
              emissiveIntensity={isHighlighted ? 0.15 : 0}
            />
            <Edges color={BORDER_COLOR} threshold={15} />
          </mesh>
          <mesh position={[0, h + 0.2, 0]} castShadow>
            <boxGeometry args={[w + 0.5, 0.4, d + 0.5]} />
            <meshStandardMaterial
              color="#ffffff"
              map={tealRoofTex?.map ?? null}
              bumpMap={tealRoofTex?.bumpMap ?? null}
              bumpScale={0.12}
              roughness={0.65}
            />
          </mesh>
          <mesh position={[0, h + 0.4, 0]} castShadow>
            <sphereGeometry
              args={[Math.min(w, d) * 0.34, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial color="#0f766e" roughness={0.5} />
          </mesh>
          {/* Semak & pot bunga di depan Musholla */}
          {[-3.2, 3.2].map((sx) => (
            <mesh key={sx} position={[sx, 0.45, d / 2 + 0.6]} castShadow>
              <icosahedronGeometry args={[0.48, 0]} />
              <meshStandardMaterial color="#16a34a" roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}

      {/* Gedung Utama: atap genteng oranye, jendela biru tipis, kanopi pintu, pilar, & tiang bendera */}
      {variant === 'gedung_utama' && (
        <group>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color={building.warna}
              roughness={0.75}
              emissive={isHighlighted ? outlineColor : '#000000'}
              emissiveIntensity={isHighlighted ? 0.16 : 0}
            />
            <Edges color={BORDER_COLOR} threshold={15} />
          </mesh>
          {/* Jendela biru lantai 1 & 2 */}
          <mesh position={[0, h * 0.28, d / 2 + 0.03]}>
            <boxGeometry args={[w * 0.74, 1.35, 0.06]} />
            <meshStandardMaterial color={GLASS_COLOR} roughness={0.25} />
          </mesh>
          <mesh position={[0, h * 0.72, d / 2 + 0.03]}>
            <boxGeometry args={[w * 0.74, 1.35, 0.06]} />
            <meshStandardMaterial color={GLASS_COLOR} roughness={0.25} />
          </mesh>
          {/* Lis atap krem/putih */}
          <mesh position={[0, h + 0.14, 0]} castShadow>
            <boxGeometry args={[w + 0.7, 0.28, d + 0.7]} />
            <meshStandardMaterial color={TRIM_COLOR} roughness={0.7} />
          </mesh>
          {/* Atap genteng oranye miring */}
          <mesh position={[0, h + 0.28 + 1.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[roofRadius, 2.8, 4]} />
            <meshStandardMaterial
              color="#ffffff"
              map={orangeRoofTex?.map ?? null}
              bumpMap={orangeRoofTex?.bumpMap ?? null}
              bumpScale={0.16}
              roughness={0.72}
            />
          </mesh>
          {/* Kanopi tipis di atas pintu masuk */}
          <mesh position={[0, 3.2, d / 2 + 1.0]} castShadow>
            <boxGeometry args={[7.5, 0.25, 2.0]} />
            <meshStandardMaterial color="#ea580c" roughness={0.7} />
          </mesh>
          {/* Pilar depan */}
          {[-9, -4.5, 4.5, 9].map((px) => (
            <mesh key={px} position={[px, h * 0.45, d / 2 + 0.55]} castShadow>
              <cylinderGeometry args={[0.32, 0.38, h * 0.9, 8]} />
              <meshStandardMaterial color={TRIM_COLOR} roughness={0.6} />
            </mesh>
          ))}
          {/* Pot bunga & semak di depan Gedung Utama */}
          {[-6.5, -2.5, 2.5, 6.5].map((fx) => (
            <group key={fx} position={[fx, 0, d / 2 + 1.2]}>
              <mesh position={[0, 0.22, 0]} castShadow>
                <cylinderGeometry args={[0.36, 0.28, 0.44, 8]} />
                <meshStandardMaterial color="#b45309" />
              </mesh>
              <mesh position={[0, 0.55, 0]} castShadow>
                <icosahedronGeometry args={[0.38, 0]} />
                <meshStandardMaterial color="#16a34a" />
              </mesh>
            </group>
          ))}
          {/* Tiang bendera & bendera merah-putih */}
          <group position={[0, 0, d / 2 + 5.5]}>
            <mesh position={[0, 0.25, 0]} receiveShadow>
              <cylinderGeometry args={[1.1, 1.3, 0.5, 8]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
            </mesh>
            <mesh position={[0, 6.2, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.14, 12, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[1.35, 11.4, 0]} castShadow>
              <boxGeometry args={[2.5, 0.85, 0.08]} />
              <meshStandardMaterial color="#dc2626" roughness={0.6} />
            </mesh>
            <mesh position={[1.35, 10.55, 0]} castShadow>
              <boxGeometry args={[2.5, 0.85, 0.08]} />
              <meshStandardMaterial color="#ffffff" roughness={0.6} />
            </mesh>
          </group>
        </group>
      )}

      {/* Label nama gedung */}
      {showTag && (
        <Html
          position={[0, Math.max(h, 1.2) + (variant === 'musholla' ? 3.4 : isAula ? 1.15 : roofHeight + 1.2), 0]}
          center
          distanceFactor={88}
          zIndexRange={[8, 0]}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              selectBuilding(building);
            }}
            className={`pointer-events-auto whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-bold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              isSelected
                ? 'border-amber-300 bg-amber-400 text-slate-950'
                : isHovered
                  ? 'border-sky-300 bg-sky-600 text-white'
                  : 'border-white/25 bg-slate-950/90 text-white'
            }`}
          >
            {building.nama}
          </button>
        </Html>
      )}
    </group>
  );
}

function LapanganMesh({
  w,
  d,
  isHighlighted,
  outlineColor,
}: {
  w: number;
  d: number;
  isHighlighted: boolean;
  outlineColor: string;
}) {
  return (
    <group>
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[w, 0.35, d]} />
        <meshStandardMaterial
          color="#ea580c"
          roughness={0.85}
          emissive={isHighlighted ? outlineColor : '#000000'}
          emissiveIntensity={isHighlighted ? 0.16 : 0}
        />
        <Edges color={isHighlighted ? outlineColor : BORDER_COLOR} />
      </mesh>
      <mesh position={[0, 0.37, 0]} receiveShadow>
        <boxGeometry args={[w * 0.78, 0.04, d * 0.72]} />
        <meshStandardMaterial color="#2563eb" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.28, 0.04, d * 0.72]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.35, 24]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function UpacaraMesh({
  w,
  d,
  isHighlighted,
  outlineColor,
}: {
  w: number;
  d: number;
  isHighlighted: boolean;
  outlineColor: string;
}) {
  const grassTex = useMemo(() => getGrassTexture(), []);

  return (
    <group>
      {/* Permukaan rumput hijau rata */}
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[w, 0.35, d]} />
        <meshStandardMaterial
          color="#ffffff"
          map={grassTex}
          roughness={0.92}
          emissive={isHighlighted ? outlineColor : '#000000'}
          emissiveIntensity={isHighlighted ? 0.14 : 0}
        />
        <Edges color={isHighlighted ? outlineColor : BORDER_COLOR} />
      </mesh>

      {/* Garis putih tipis tepi & garis tengah lapangan upacara */}
      <group position={[0, 0.37, 0]}>
        <mesh position={[0, 0, -d / 2 + 0.8]}>
          <boxGeometry args={[w - 1.6, 0.03, 0.24]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, d / 2 - 0.8]}>
          <boxGeometry args={[w - 1.6, 0.03, 0.24]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-w / 2 + 0.8, 0, 0]}>
          <boxGeometry args={[0.24, 0.03, d - 1.6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[w / 2 - 0.8, 0, 0]}>
          <boxGeometry args={[0.24, 0.03, d - 1.6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 0.03, d - 1.6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Tiang bendera di sisi utara lapangan menghadap Gedung Utama */}
      <group position={[0, 0.35, -d / 2 + 2.2]}>
        <mesh position={[0, 0.2, 0]} receiveShadow>
          <boxGeometry args={[1.6, 0.4, 1.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        <mesh position={[0, 4.7, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.11, 9, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.95, 8.75, 0]} castShadow>
          <boxGeometry args={[1.8, 0.6, 0.06]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
        <mesh position={[0.95, 8.15, 0]} castShadow>
          <boxGeometry args={[1.8, 0.6, 0.06]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function TamanMesh({
  w,
  d,
  isHighlighted,
  outlineColor,
}: {
  w: number;
  d: number;
  isHighlighted: boolean;
  outlineColor: string;
}) {
  return (
    <group>
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[w, 0.35, d]} />
        <meshStandardMaterial
          color="#65a30d"
          roughness={0.95}
          emissive={isHighlighted ? outlineColor : '#000000'}
          emissiveIntensity={isHighlighted ? 0.16 : 0}
        />
        <Edges color={isHighlighted ? outlineColor : BORDER_COLOR} />
      </mesh>
      {/* Kolam kecil */}
      <mesh position={[1.5, 0.38, 0]} receiveShadow>
        <cylinderGeometry args={[3.4, 3.6, 0.12, 16]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.2} />
      </mesh>
      {/* Bebatuan abu-abu */}
      <mesh position={[-4.5, 0.9, -1]} castShadow>
        <dodecahedronGeometry args={[1.35, 0]} />
        <meshStandardMaterial color="#78716c" roughness={0.95} />
      </mesh>
      <mesh position={[-3.2, 0.65, 1.4]} castShadow>
        <dodecahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.95} />
      </mesh>
    </group>
  );
}

function ParkirMotorMesh({
  w,
  d,
  isHighlighted,
  outlineColor,
}: {
  w: number;
  d: number;
  isHighlighted: boolean;
  outlineColor: string;
}) {
  const rows = d > 15 ? [-8, -3, 2, 7] : [-1.8, 1.8];
  const cols = w > 16 ? [-5, -1.5, 2, 5.5] : [-3.5, 0, 3.5];

  return (
    <group>
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[w, 0.35, d]} />
        <meshStandardMaterial
          color="#64748b"
          roughness={0.9}
          emissive={isHighlighted ? outlineColor : '#000000'}
          emissiveIntensity={isHighlighted ? 0.15 : 0}
        />
        <Edges color={isHighlighted ? outlineColor : BORDER_COLOR} />
      </mesh>
      {/* Garis putih parkiran */}
      {rows.map((rz) => (
        <mesh key={rz} position={[0, 0.37, rz]}>
          <boxGeometry args={[w * 0.82, 0.03, 0.18]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {rows.map((rz, ri) =>
        cols.map((cx, ci) => (
          <mesh key={`${ri}-${ci}`} position={[cx, 0.68, rz]} castShadow>
            <boxGeometry args={[0.75, 0.65, 1.5]} />
            <meshStandardMaterial color={(ri + ci) % 2 === 0 ? '#1e293b' : '#dc2626'} />
          </mesh>
        )),
      )}
    </group>
  );
}

function ParkirMobilMesh({
  w,
  d,
  isHighlighted,
  outlineColor,
}: {
  w: number;
  d: number;
  isHighlighted: boolean;
  outlineColor: string;
}) {
  const carColors = ['#e2e8f0', '#3b82f6', '#475569', '#ef4444'];
  return (
    <group>
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[w, 0.35, d]} />
        <meshStandardMaterial
          color="#64748b"
          roughness={0.9}
          emissive={isHighlighted ? outlineColor : '#000000'}
          emissiveIntensity={isHighlighted ? 0.15 : 0}
        />
        <Edges color={isHighlighted ? outlineColor : BORDER_COLOR} />
      </mesh>
      {/* Garis putih batas slot mobil */}
      {[-7.4, -3.7, 0, 3.7, 7.4].map((lx) => (
        <mesh key={lx} position={[lx, 0.37, 0]}>
          <boxGeometry args={[0.18, 0.03, d * 0.78]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {[-5.5, -1.8, 1.9, 5.6].map((cx, idx) => (
        <group key={cx} position={[cx, 0.35, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[2.1, 0.8, 4.2]} />
            <meshStandardMaterial color={carColors[idx % carColors.length]} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.05, -0.2]} castShadow>
            <boxGeometry args={[1.7, 0.55, 2.2]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
