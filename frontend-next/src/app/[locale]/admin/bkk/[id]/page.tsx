import type { Metadata } from "next";
import { LokerForm } from "@/features/bkk";

export const metadata: Metadata = { title: "Ubah Lowongan" };

export default async function AdminBkkUbahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LokerForm id={id} />;
}
