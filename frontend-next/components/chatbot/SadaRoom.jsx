"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import useSadaChat from "@/lib/chatbot/useSadaChat";
import { Avatar, ChatComposer, ChatNotice, ChatThread } from "./ChatParts";

/** Halaman penuh SADA Roomchat (Figma "SADA AI"); memakai logika yang sama dengan widget. */
export default function SadaRoom() {
  const chat = useSadaChat();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[760px] flex-col bg-[#eef3fa]">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#dbe4f0] bg-[#eef3fa]/95 px-4 pt-[max(16px,env(safe-area-inset-top))] pb-4 backdrop-blur-sm sm:gap-4 sm:px-8">
        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#2f3a5e] hover:bg-[#e2e8f0]"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold text-[#1e293b] sm:text-2xl">SADA Roomchat</h1>
          <p className="flex items-center gap-1.5 text-sm text-[#64748b]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" aria-hidden="true" />
            Online
          </p>
        </div>
        <button
          type="button"
          onClick={chat.reset}
          aria-label="Mulai percakapan baru"
          title="Mulai percakapan baru"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#475569] hover:bg-[#e2e8f0]"
        >
          <RefreshCw size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="flex-1 px-4 py-6 sm:px-8">
        <div className="mb-8 flex items-center gap-4 rounded-full bg-[#f6f8fb] px-4 py-3 sm:px-6">
          <Avatar />
          <p className="text-sm text-[#334155] sm:text-base">SADA siap membantu menjawab pertanyaan seputar SMKN 2 Mojokerto ✨</p>
        </div>
        <ChatThread chat={chat} />
      </div>

      <div className="sticky bottom-0 bg-[#eef3fa] pt-2">
        <ChatNotice text={chat.notice} onClose={chat.dismissNotice} />
        <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] sm:px-8">
          <ChatComposer onSend={chat.send} disabled={chat.typing} autoFocus />
        </div>
      </div>
    </div>
  );
}
