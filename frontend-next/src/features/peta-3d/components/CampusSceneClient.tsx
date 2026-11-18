'use client';

import dynamic from 'next/dynamic';

const CampusScene = dynamic(
  () => import('./CampusScene').then((mod) => mod.CampusScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-sky-100 text-slate-700">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
        <p className="text-sm font-semibold">Menyiapkan kanvas 3D...</p>
      </div>
    ),
  },
);

export function CampusSceneClient() {
  return <CampusScene />;
}
