import type { Metadata } from "next";
import { BeritaAdminList } from "@/features/berita";

export const metadata: Metadata = { title: "Kelola Berita & Artikel" };

export default function AdminBeritaPage() {
  return <BeritaAdminList />;
}
