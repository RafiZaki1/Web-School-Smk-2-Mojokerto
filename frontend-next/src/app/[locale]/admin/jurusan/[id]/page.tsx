import type { Metadata } from "next";
import { JurusanForm } from "@/features/jurusan";

export const metadata: Metadata = { title: "Ubah Jurusan" };

export default async function AdminJurusanUbahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JurusanForm id={id} />;
}
