import type { Metadata } from "next";
import { DocumentationAdmin } from "@/features/kemitraan";

export const metadata: Metadata = { title: "Dokumentasi PKL" };

export default function AdminTuDokumentasiPklPage() {
  return <DocumentationAdmin />;
}
