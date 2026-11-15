import type { Metadata } from "next";
import { BankMiniAkses } from "@/features/bank-mini";

export const metadata: Metadata = { title: "Bank Mini & SPP" };

export default function AdminBankMiniPage() {
  return <BankMiniAkses />;
}
