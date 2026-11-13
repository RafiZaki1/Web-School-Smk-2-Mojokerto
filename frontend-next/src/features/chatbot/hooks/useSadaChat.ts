"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postChatbotMessageApi } from "../api/chatbot.api";
import { POLITE_REPLY, WELCOME_TEXT, containsBlockedWord, createMessage, createRateLimiter, extractAction } from "../utils/sada";
import { ApiError } from "@/shared/lib/http/api-error";
import type { ChatHistoryItem, ChatMessageItem } from "../types/chatbot.type";

const welcome = (): ChatMessageItem => ({ ...createMessage("bot", WELCOME_TEXT), id: "welcome", time: "" });

/** State percakapan SADA: kirim pesan, riwayat, indikator mengetik, dan pembatas spam. */
export default function useSadaChat() {
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => [welcome()]);
  const [notice, setNotice] = useState<string | null>(null);
  const limiter = useMemo(() => createRateLimiter(), []);
  const lastTextRef = useRef("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const warn = useCallback((text: string) => {
    setNotice(text);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 5000);
  }, []);

  // Jawaban dan pesan gagal ditampilkan sebagai balasan bot, jadi error global dilewati
  const chat = useMutation({
    mutationFn: ({ text, history }: { text: string; history: ChatHistoryItem[] }) => postChatbotMessageApi(text, history),
    meta: { skipGlobalError: true },
    onSuccess: (response) => {
      const reply = response?.reply || response?.answer || "Terima kasih! SADA siap membantu.";
      setMessages((prev) => [...prev, createMessage("bot", reply, { action: extractAction(response) })]);
    },
    onError: (error) => {
      const message = error instanceof ApiError || error instanceof Error ? error.message : "";
      setMessages((prev) => [
        ...prev,
        createMessage("bot", message || "Maaf, SADA sedang tidak bisa terhubung. Coba lagi beberapa saat lagi ya.", { error: true }),
      ]);
    },
  });
  const typing = chat.isPending;
  const request = chat.mutate;

  // Validasi langsung (mengembalikan true bila pesan diterima), lalu kirim ke API di latar
  const send = useCallback(
    (raw: string): boolean => {
      const text = raw.trim();
      if (!text) return false;
      if (typing) {
        warn("Tunggu sebentar ya, SADA sedang menyiapkan jawaban.");
        return false;
      }
      if (text === lastTextRef.current) {
        warn("Pertanyaan yang sama baru saja dikirim. Coba tanyakan hal lain ya.");
        return false;
      }
      const wait = limiter();
      if (wait) {
        warn(`Terlalu banyak pesan. Coba lagi dalam ${wait} detik.`);
        return false;
      }
      lastTextRef.current = text;

      if (containsBlockedWord(text)) {
        setMessages((prev) => [...prev, createMessage("user", text), createMessage("bot", POLITE_REPLY)]);
        return true;
      }

      const history: ChatHistoryItem[] = messages
        .filter((message) => message.id !== "welcome")
        .slice(-6)
        .map((message) => ({ role: message.role === "user" ? "user" : "assistant", content: message.content }));

      setMessages((prev) => [...prev, createMessage("user", text)]);
      request({ text, history });
      return true;
    },
    [messages, typing, limiter, warn, request],
  );

  const reset = useCallback(() => {
    lastTextRef.current = "";
    setMessages([welcome()]);
  }, []);

  return { messages, typing, notice, dismissNotice: () => setNotice(null), send, reset, hasConversation: messages.length > 1 };
}
