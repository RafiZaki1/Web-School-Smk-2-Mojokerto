import type { Metadata } from "next";
import { TinjauKuisJurusan } from "@/features/kuis-jurusan";

export const metadata: Metadata = { title: "Tinjau Kuis Jurusan" };

export default async function AdminKuisJurusanTinjauPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TinjauKuisJurusan id={id} />;
}
