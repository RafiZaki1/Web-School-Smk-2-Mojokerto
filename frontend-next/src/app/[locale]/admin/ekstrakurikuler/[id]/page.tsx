import type { Metadata } from "next";
import { EkstrakurikulerForm } from "@/features/ekstrakurikuler";

export const metadata: Metadata = { title: "Ubah Ekstrakurikuler" };

export default async function AdminEkstrakurikulerUbahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EkstrakurikulerForm id={id} />;
}
