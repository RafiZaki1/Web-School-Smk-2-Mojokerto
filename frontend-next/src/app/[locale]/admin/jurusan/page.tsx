import type { Metadata } from "next";
import { JurusanAdminList } from "@/features/jurusan";

export const metadata: Metadata = { title: "Kelola Jurusan" };

export default function AdminJurusanPage() {
  return <JurusanAdminList />;
}
