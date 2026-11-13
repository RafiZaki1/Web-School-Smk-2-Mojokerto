"use client";

import { usePathname } from "next/navigation";
import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";

const HIDDEN_PREFIXES = ["/admin", "/login", "/sada"];
// Halaman kuis jurusan sudah berupa chat SADA, widget melayang hanya akan menutupi kolom ketik
const HIDDEN_PATHS = ["/kuis-jurusan"];

/** SADA hanya muncul di halaman publik. */
export default function PublicChatbot() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.includes(pathname) || HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return null;
  return <ChatbotWidget />;
}
