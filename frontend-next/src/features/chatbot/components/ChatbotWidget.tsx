"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { X } from "lucide-react";
import useSadaChat from "../hooks/useSadaChat";
import { SADA_AVATAR } from "../utils/sada";
import { useHideOnScroll } from "@/shared/hooks/useHideOnScroll";
import { useTranslation } from "@/shared/hooks/useTranslation";

// Panel baru diunduh saat pertama kali dibuka; percakapannya tetap disimpan di widget ini
const ChatbotPanel = dynamic(() => import("./ChatbotPanel"), { ssr: false });

const isMobile = () => window.matchMedia("(max-width: 639px)").matches;

/**
 * Widget SADA mengambang. Desktop/tablet: panel 400×620 di pojok kanan bawah.
 * Mobile: lembar layar penuh bergaya "SADA Roomchat" (Figma).
 */
export default function ChatbotWidget() {
  const { t } = useTranslation();
  const chat = useSadaChat();
  const [open, setOpen] = useState(false);
  const scrollHidden = useHideOnScroll();

  useEffect(() => {
    const onToggle = (event: Event) => setOpen((event as CustomEvent<{ open?: boolean }>).detail?.open ?? true);
    window.addEventListener("sada:toggle-chatbot", onToggle);
    return () => window.removeEventListener("sada:toggle-chatbot", onToggle);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // Kunci scroll halaman hanya saat layar penuh (mobile)
    const previous = document.body.style.overflow;
    if (isMobile()) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Saat aksi denah dipilih dari chat, tutup panel di mobile agar peta terlihat
  useEffect(() => {
    const close = () => isMobile() && setOpen(false);
    window.addEventListener("sada:select-room", close);
    window.addEventListener("sada:show-route", close);
    return () => {
      window.removeEventListener("sada:select-room", close);
      window.removeEventListener("sada:show-route", close);
    };
  }, []);

  return (
    <>
      {open ? <ChatbotPanel chat={chat} onClose={() => setOpen(false)} /> : null}

      <div
        className={`fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[80] flex items-center gap-3 transition-[translate,opacity] duration-300 sm:right-6 sm:bottom-6 ${
          open ? "max-sm:hidden" : scrollHidden ? "pointer-events-none translate-y-[calc(100%+1.5rem)] opacity-0" : ""
        }`}
      >
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden cursor-pointer rounded-full border border-[var(--color-line)] bg-card px-4 py-2 text-sm font-semibold text-[var(--color-heading)] shadow-[0_4px_12px_rgba(19,35,44,0.08)] sm:block"
          >
            {t("Butuh Bantuan?")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={t(open ? "Tutup SADA" : "Buka SADA, asisten virtual sekolah")}
          aria-expanded={open}
          className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(30,58,159,0.25)] ring-4 ring-white transition-transform hover:scale-105 sm:h-16 sm:w-16"
        >
          {open ? (
            <X size={24} className="text-navy" aria-hidden="true" />
          ) : (
            <>
              <Image src={SADA_AVATAR} alt="" fill sizes="64px" className="rounded-full object-contain p-1" />
              <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22c55e]" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
