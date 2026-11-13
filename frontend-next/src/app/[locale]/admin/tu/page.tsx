import type { Metadata } from "next";
import { TuDashboard } from "@/features/tata-usaha";

export const metadata: Metadata = { title: "Ringkasan Tata Usaha" };

export default function AdminTuPage() {
  return <TuDashboard />;
}
