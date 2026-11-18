import type { Metadata } from 'next';
import { CampusSceneClient } from '@/features/peta-3d/components/CampusSceneClient';

export const metadata: Metadata = {
  title: {
    absolute: 'Peta 3D Denah Sekolah | SMK Negeri 2 Mojokerto',
  },
  description:
    'Peta 3D interaktif denah ruang pembelajaran SMK Negeri 2 Mojokerto.',
};

export default function Peta3DPage() {
  return <CampusSceneClient />;
}
