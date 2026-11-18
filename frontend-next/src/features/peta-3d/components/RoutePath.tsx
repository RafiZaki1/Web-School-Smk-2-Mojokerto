'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { DoorOpen, MapPin } from 'lucide-react';
import type { Line2 } from 'three-stdlib';
import { CAMPUS_BUILDINGS, GERBANG_UTAMA_POS } from '../data/campus';
import { useCampusStore } from '../store/useCampusStore';

export function RoutePath() {
  const { invalidate } = useThree();
  const selectedId = useCampusStore((s) => s.selectedId);
  const routeActive = useCampusStore((s) => s.routeActive);
  const liveCameraPosition = useCampusStore((s) => s.liveCameraPosition);
  const lineRef = useRef<Line2>(null);

  const selectedBuilding = useMemo(
    () => CAMPUS_BUILDINGS.find((b) => b.id === selectedId) ?? null,
    [selectedId],
  );

  const waypoints = useMemo(() => {
    if (!routeActive || !selectedBuilding?.rute || selectedBuilding.rute.length < 2) {
      return null;
    }
    return selectedBuilding.rute;
  }, [routeActive, selectedBuilding]);

  // Sembunyikan label Gerbang Utama saat kamera jauh agar tidak menempel di atap Gedung Utama
  const gateDist = Math.hypot(
    liveCameraPosition[0] - GERBANG_UTAMA_POS[0],
    liveCameraPosition[1] - 1.3,
    liveCameraPosition[2] - GERBANG_UTAMA_POS[2],
  );
  const showGateLabel = routeActive || gateDist < 72;

  useFrame((_, delta) => {
    if (!waypoints || !lineRef.current) return;
    const mat = lineRef.current.material as unknown as { dashOffset?: number };
    if (typeof mat.dashOffset === 'number') {
      mat.dashOffset -= delta * 2.5;
      invalidate();
    }
  });

  return (
    <group>
      {/* Marker Gerbang Utama tepat di depan pintu gerbang (sembunyi saat kamera jauh) */}
      {showGateLabel && (
        <Html
          position={[GERBANG_UTAMA_POS[0], 1.35, GERBANG_UTAMA_POS[2] - 1.2]}
          center
          distanceFactor={55}
          zIndexRange={[4, 0]}
        >
          <div className="pointer-events-none inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-sky-200 bg-white/95 px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-sm">
            <DoorOpen className="h-3 w-3 text-sky-600" />
            <span>Gerbang Utama</span>
          </div>
        </Html>
      )}

      {waypoints && selectedBuilding && (
        <group>
          {/* Garis rute biru putus-putus */}
          <Line
            ref={lineRef}
            points={waypoints}
            color="#2563eb"
            lineWidth={4}
            dashed
            dashSize={2}
            gapSize={1.2}
          />

          {/* Marker bernomor di setiap belokan / waypoint */}
          {waypoints.map((pt, index) => (
            <Html
              key={`${pt[0]}-${pt[2]}-${index}`}
              position={[pt[0], 1.8, pt[2]]}
              center
              distanceFactor={75}
              zIndexRange={[6, 0]}
            >
              <span className="pointer-events-none flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[11px] font-bold text-white shadow-md">
                {index + 1}
              </span>
            </Html>
          ))}

          {/* Pin merah di atas gedung tujuan */}
          <Html
            position={[
              selectedBuilding.posisi[0],
              Math.max(selectedBuilding.ukuran[1], 3) + 5.2,
              selectedBuilding.posisi[2],
            ]}
            center
            distanceFactor={75}
            zIndexRange={[7, 0]}
          >
            <div className="pointer-events-none flex flex-col items-center">
              <div className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-red-200 bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
                <MapPin className="h-3.5 w-3.5 fill-white text-red-600" />
                <span>{selectedBuilding.nama}</span>
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
