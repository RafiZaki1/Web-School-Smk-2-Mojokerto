import type { Metadata } from "next";
import { LulusanForm } from "@/features/lulusan";

export const metadata: Metadata = { title: "Ubah Lulusan" };

export default async function AdminLulusanUbahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LulusanForm id={id} />;
}
