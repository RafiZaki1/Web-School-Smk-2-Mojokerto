import type { Metadata } from "next";
import { PrestasiForm } from "@/features/prestasi";

export const metadata: Metadata = { title: "Ubah Prestasi" };

export default async function AdminPrestasiUbahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PrestasiForm id={id} />;
}
