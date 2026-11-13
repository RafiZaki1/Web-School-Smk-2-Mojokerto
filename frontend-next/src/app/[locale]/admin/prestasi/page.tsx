import type { Metadata } from "next";
import { PrestasiAdminList } from "@/features/prestasi";

export const metadata: Metadata = { title: "Kelola Prestasi" };

export default function AdminPrestasiPage() {
  return <PrestasiAdminList />;
}
