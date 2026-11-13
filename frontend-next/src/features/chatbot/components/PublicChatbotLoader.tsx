"use client";

import dynamic from "next/dynamic";

// Widget SADA dimuat setelah halaman siap, jadi kode chatbot tidak ikut di bundle awal setiap halaman.
const PublicChatbot = dynamic(() => import("./PublicChatbot"), { ssr: false });

export default function PublicChatbotLoader() {
  return <PublicChatbot />;
}
