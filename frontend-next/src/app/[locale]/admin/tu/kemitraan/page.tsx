import type { Metadata } from "next";
import { PartnerAdmin } from "@/features/kemitraan";

export const metadata: Metadata = { title: "Mitra DU/DI" };

export default function AdminTuKemitraanPage() {
  return <PartnerAdmin />;
}
