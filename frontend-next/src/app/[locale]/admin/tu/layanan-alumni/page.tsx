import type { Metadata } from "next";
import { AlumniServiceQueue } from "@/features/layanan-alumni";

export const metadata: Metadata = { title: "Layanan Berkas Alumni" };

export default function AdminTuLayananAlumniPage() {
  return <AlumniServiceQueue />;
}
