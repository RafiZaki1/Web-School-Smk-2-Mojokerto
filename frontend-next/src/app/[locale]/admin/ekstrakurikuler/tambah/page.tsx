import type { Metadata } from "next";
import { EkstrakurikulerForm } from "@/features/ekstrakurikuler";

export const metadata: Metadata = { title: "Tambah Ekstrakurikuler" };

export default function AdminEkstrakurikulerTambahPage() {
  return <EkstrakurikulerForm />;
}
