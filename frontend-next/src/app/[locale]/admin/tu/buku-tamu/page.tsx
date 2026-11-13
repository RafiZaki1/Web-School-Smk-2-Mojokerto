import type { Metadata } from "next";
import { BukuTamuAdmin } from "@/features/buku-tamu";

export const metadata: Metadata = { title: "Buku Tamu" };

export default function AdminTuBukuTamuPage() {
  return <BukuTamuAdmin />;
}
