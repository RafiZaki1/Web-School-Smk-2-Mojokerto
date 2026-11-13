import type { Metadata } from "next";
import { LokerAdminList } from "@/features/bkk";

export const metadata: Metadata = { title: "Kelola Loker & BKK" };

export default function AdminBkkPage() {
  return <LokerAdminList />;
}
