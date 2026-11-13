import type { Metadata } from "next";
import { PortalLinkAdmin } from "@/features/tata-usaha";

export const metadata: Metadata = { title: "Pintasan Portal" };

export default function AdminTuPortalPage() {
  return <PortalLinkAdmin />;
}
