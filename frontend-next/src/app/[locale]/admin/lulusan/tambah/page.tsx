import type { Metadata } from "next";
import { LulusanForm } from "@/features/lulusan";

export const metadata: Metadata = { title: "Tambah Lulusan" };

export default function AdminLulusanTambahPage() {
  return <LulusanForm />;
}
