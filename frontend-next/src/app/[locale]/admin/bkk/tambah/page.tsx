import type { Metadata } from "next";
import { LokerForm } from "@/features/bkk";

export const metadata: Metadata = { title: "Tambah Lowongan" };

export default function AdminBkkTambahPage() {
  return <LokerForm />;
}
