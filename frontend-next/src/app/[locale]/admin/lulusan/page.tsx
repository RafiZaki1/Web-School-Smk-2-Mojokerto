import type { Metadata } from "next";
import { LulusanAdminList } from "@/features/lulusan";

export const metadata: Metadata = { title: "Kelola Lulusan" };

export default function AdminLulusanPage() {
  return <LulusanAdminList />;
}
