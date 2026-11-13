import type { Metadata } from "next";
import { BeritaForm } from "@/features/berita";

export const metadata: Metadata = { title: "Ubah Berita" };

export default async function AdminBeritaUbahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BeritaForm id={id} />;
}
