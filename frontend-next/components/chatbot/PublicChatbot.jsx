"use client";

import { usePathname } from "next/navigation";
import ChatbotWidget from "./ChatbotWidget";

const HIDDEN_PREFIXES = ["/admin", "/login", "/sada"];

/** SADA hanya muncul di halaman publik. */
export default function PublicChatbot() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return null;
  return <ChatbotWidget />;
}
