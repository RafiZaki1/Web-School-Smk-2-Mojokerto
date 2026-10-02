import "../../styles/admin/admin.css";
import AdminShell from "@/components/admin/layout/AdminShell";

export const metadata = {
  title: {
    default: "Panel Admin - SMKN 2 Kota Mojokerto",
    template: "%s | Panel Admin SMKN 2 Kota Mojokerto",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
