import type { Metadata } from "next";
import { KelulusanAdmin } from "@/features/kelulusan";

export const metadata: Metadata = { title: "Kelulusan" };

export default function AdminTuKelulusanPage() {
  return <KelulusanAdmin />;
}
