import type { Metadata } from "next";
import { TataTertibAdmin } from "@/features/tata-tertib";

export const metadata: Metadata = { title: "Tata Tertib & Seragam" };

export default function AdminTuTataTertibPage() {
  return <TataTertibAdmin />;
}
