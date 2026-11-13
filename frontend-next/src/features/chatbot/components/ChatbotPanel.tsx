"use client";

import Link from "next/link";
import { Maximize2, RefreshCw, X } from "lucide-react";
import type useSadaChat from "../hooks/useSadaChat";
import { Avatar, ChatComposer, ChatNotice, ChatThread } from "./ChatParts";
import { useTranslation } from "@/shared/hooks/useTranslation";

const headerBtn = "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-line)]";

/**
 * Isi panel SADA (percakapan dan kolom ketik). Dimuat terpisah oleh ChatbotWidget saat panel
 * pertama kali dibuka, sehingga kode form dan validasinya tidak diunduh di setiap halaman.
 */
export default function ChatbotPanel({ chat, onClose }: { chat: ReturnType<typeof useSadaChat>; onClose: () => void }) {
  const { t } = useTranslation();

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-label="SADA Roomchat"
      // Di atas header situs (z-index 100), karena di HP panel ini layar penuh
      className="fixed inset-0 z-[110] flex flex-col bg-[var(--color-tint)] sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[min(620px,calc(100dvh-8rem))] sm:w-[400px] sm:overflow-hidden sm:rounded-3xl sm:border sm:border-[var(--color-line)] sm:shadow-[0_24px_48px_rgba(19,35,44,0.18)]"
    >
      <header className="flex items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-tint)] px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3">
        <Avatar />
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-[var(--color-heading)]">SADA Roomchat</h2>
          <p className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" aria-hidden="true" />
            {t("Online · Asisten SMKN 2 Mojokerto")}
          </p>
        </div>
        <button type="button" onClick={chat.reset} aria-label={t("Mulai percakapan baru")} title={t("Mulai percakapan baru")} className={headerBtn}>
          <RefreshCw size={17} aria-hidden="true" />
        </button>
        <Link
          href="/sada"
          onClick={onClose}
          aria-label={t("Buka layar penuh")}
          title={t("Buka layar penuh")}
          className={`${headerBtn} hidden sm:flex`}
        >
          <Maximize2 size={17} aria-hidden="true" />
        </Link>
        <button type="button" onClick={onClose} aria-label={t("Tutup SADA")} className={headerBtn}>
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <ChatThread chat={chat} className="flex-1 overflow-y-auto overscroll-contain px-4 py-5" />

      <ChatNotice text={chat.notice} onClose={chat.dismissNotice} />
      <div className="px-4 pt-1 pb-[max(16px,env(safe-area-inset-bottom))]">
        <ChatComposer onSend={chat.send} disabled={chat.typing} autoFocus />
      </div>
    </section>
  );
}
