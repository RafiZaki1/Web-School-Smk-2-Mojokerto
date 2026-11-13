import type { Metadata } from "next";
import { KuisJurusanAdminList } from "@/features/kuis-jurusan";

export const metadata: Metadata = { title: "Log Kuis Jurusan" };

export default function AdminKuisJurusanPage() {
  return <KuisJurusanAdminList />;
}
