"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import useSadaChat from "@/features/chatbot/hooks/useSadaChat";
import { Avatar, ChatComposer, ChatNotice, ChatThread } from "@/features/chatbot/components/ChatParts";
import { useTranslation } from "@/shared/hooks/useTranslation";

/** Halaman penuh SADA Roomchat (Figma "SADA AI"); memakai logika yang sama dengan widget. */
export default function SadaRoom() {
  const { t } = useTranslation();
  const chat = useSadaChat();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[760px] flex-col bg-[var(--color-tint)]">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-tint)]/95 px-4 pt-[max(16px,env(safe-area-inset-top))] pb-4 backdrop-blur-sm sm:gap-4 sm:px-8">
        <Link
          href="/"
          aria-label={t("Kembali ke beranda")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-heading hover:bg-[var(--color-line)]"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold text-[var(--color-heading)] sm:text-2xl">SADA Roomchat</h1>
          <p className="flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" aria-hidden="true" />
            {t("Online")}
          </p>
        </div>
        <button
          type="button"
          onClick={chat.reset}
          aria-label={t("Mulai percakapan baru")}
          title={t("Mulai percakapan baru")}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-line)]"
        >
          <RefreshCw size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="flex-1 px-4 py-6 sm:px-8">
        <div className="mb-8 flex items-center gap-4 rounded-full bg-card px-4 py-3 sm:px-6">
          <Avatar />
          <p className="text-sm text-[var(--color-body)] sm:text-base">{t("SADA siap membantu menjawab pertanyaan seputar SMKN 2 Mojokerto ✨")}</p>
        </div>
        <ChatThread chat={chat} />
      </div>

      <div className="sticky bottom-0 bg-[var(--color-tint)] pt-2">
        <ChatNotice text={chat.notice} onClose={chat.dismissNotice} />
        <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] sm:px-8">
          <ChatComposer onSend={chat.send} disabled={chat.typing} autoFocus />
        </div>
      </div>
    </div>
  );
}
