import type { Metadata } from "next";
import { EkstrakurikulerAdminList } from "@/features/ekstrakurikuler";

export const metadata: Metadata = { title: "Kelola Ekstrakurikuler" };

export default function AdminEkstrakurikulerPage() {
  return <EkstrakurikulerAdminList />;
}
