"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Maximize2, RefreshCw, X } from "lucide-react";
import useSadaChat from "@/lib/chatbot/useSadaChat";
import { SADA_AVATAR } from "@/lib/chatbot/sada";
import { Avatar, ChatComposer, ChatNotice, ChatThread } from "./ChatParts";

const headerBtn =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#475569] transition-colors hover:bg-[#e2e8f0]";

/**
 * Widget SADA mengambang. Desktop/tablet: panel 400×620 di pojok kanan bawah.
 * Mobile: lembar layar penuh bergaya "SADA Roomchat" (Figma).
 */
export default function ChatbotWidget() {
  const chat = useSadaChat();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onToggle = (event) => setOpen(event.detail?.open ?? true);
    window.addEventListener("sada:toggle-chatbot", onToggle);
    return () => window.removeEventListener("sada:toggle-chatbot", onToggle);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // Kunci scroll halaman hanya saat layar penuh (mobile)
    const mobile = window.matchMedia("(max-width: 639px)").matches;
    const previous = document.body.style.overflow;
    if (mobile) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Saat aksi denah dipilih dari chat, tutup panel di mobile agar peta terlihat
  useEffect(() => {
    const close = () => window.matchMedia("(max-width: 639px)").matches && setOpen(false);
    window.addEventListener("sada:select-room", close);
    window.addEventListener("sada:show-route", close);
    return () => {
      window.removeEventListener("sada:select-room", close);
      window.removeEventListener("sada:show-route", close);
    };
  }, []);

  return (
    <>
      {open ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="SADA Roomchat"
          className="fixed inset-0 z-[90] flex flex-col bg-[#eef3fa] sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[min(620px,calc(100dvh-8rem))] sm:w-[400px] sm:overflow-hidden sm:rounded-3xl sm:border sm:border-[#dbe4f0] sm:shadow-[0_24px_48px_rgba(15,23,42,0.18)]"
        >
          <header className="flex items-center gap-3 border-b border-[#dbe4f0] bg-[#eef3fa] px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3">
            <Avatar />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-[#1e293b]">SADA Roomchat</h2>
              <p className="flex items-center gap-1.5 text-xs text-[#64748b]">
                <span className="h-2 w-2 rounded-full bg-[#22c55e]" aria-hidden="true" />
                Online · Asisten SMKN 2 Mojokerto
              </p>
            </div>
            <button
              type="button"
              onClick={chat.reset}
              aria-label="Mulai percakapan baru"
              title="Mulai percakapan baru"
              className={headerBtn}
            >
              <RefreshCw size={17} aria-hidden="true" />
            </button>
            <Link
              href="/sada"
              onClick={() => setOpen(false)}
              aria-label="Buka layar penuh"
              title="Buka layar penuh"
              className={`${headerBtn} hidden sm:flex`}
            >
              <Maximize2 size={17} aria-hidden="true" />
            </Link>
            <button type="button" onClick={() => setOpen(false)} aria-label="Tutup SADA" className={headerBtn}>
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <ChatThread chat={chat} className="flex-1 overflow-y-auto overscroll-contain px-4 py-5" />

          <ChatNotice text={chat.notice} onClose={chat.dismissNotice} />
          <div className="px-4 pt-1 pb-[max(16px,env(safe-area-inset-bottom))]">
            <ChatComposer onSend={chat.send} disabled={chat.typing} autoFocus />
          </div>
        </section>
      ) : null}

      <div className={`fixed right-4 bottom-4 z-[80] flex items-center gap-3 sm:right-6 sm:bottom-6 ${open ? "max-sm:hidden" : ""}`}>
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden cursor-pointer rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold text-[#1e293b] shadow-[0_4px_12px_rgba(15,23,42,0.08)] sm:block"
          >
            Butuh Bantuan?
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Tutup SADA" : "Buka SADA, asisten virtual sekolah"}
          aria-expanded={open}
          className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(30,58,159,0.25)] ring-4 ring-white transition-transform hover:scale-105 sm:h-16 sm:w-16"
        >
          {open ? (
            <X size={24} className="text-[#1e3a9f]" aria-hidden="true" />
          ) : (
            <>
              <img src={SADA_AVATAR} alt="" className="h-full w-full rounded-full object-contain p-1" />
              <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22c55e]" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
