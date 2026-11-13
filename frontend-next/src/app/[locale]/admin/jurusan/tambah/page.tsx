import type { Metadata } from "next";
import { JurusanForm } from "@/features/jurusan";

export const metadata: Metadata = { title: "Tambah Jurusan" };

export default function AdminJurusanTambahPage() {
  return <JurusanForm />;
}
