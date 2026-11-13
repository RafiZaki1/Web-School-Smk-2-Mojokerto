import type { Metadata } from "next";
import { PrestasiForm } from "@/features/prestasi";

export const metadata: Metadata = { title: "Tambah Prestasi" };

export default function AdminPrestasiTambahPage() {
  return <PrestasiForm />;
}
