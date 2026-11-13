import type { Metadata } from "next";
import { BeritaForm } from "@/features/berita";

export const metadata: Metadata = { title: "Tambah Berita" };

export default function AdminBeritaTambahPage() {
  return <BeritaForm />;
}
