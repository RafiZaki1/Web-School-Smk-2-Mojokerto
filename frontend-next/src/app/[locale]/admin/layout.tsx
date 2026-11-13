import "@/styles/admin/admin.css";
import type { ReactNode } from "react";
import { AdminShell } from "@/features/admin";

export const metadata = {
  title: {
    default: "Panel Admin - SMKN 2 Kota Mojokerto",
    template: "%s | Panel Admin SMKN 2 Kota Mojokerto",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
