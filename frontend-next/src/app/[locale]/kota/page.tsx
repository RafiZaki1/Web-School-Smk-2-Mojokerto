import type { Metadata } from 'next';
import { CampusSceneClient } from '@/features/peta-3d/components/CampusSceneClient';

export const metadata: Metadata = {
  title: 'Peta 3D Sekolah',
  description:
    'Jelajahi SMK Negeri 2 Mojokerto dalam 3D: ruang kelas, lab, kantin, dan lapangan, bersama pengunjung lain.',
  openGraph: {
    title: 'Peta 3D SMK Negeri 2 Mojokerto',
    description: 'Jelajahi kompleks sekolah dalam 3D bersama pengunjung lain.',
  },
};

export default function KotaPage() {
  return <CampusSceneClient />;
}
