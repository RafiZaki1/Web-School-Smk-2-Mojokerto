"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { chatbotApi } from "@/lib/api/chatbotApi";
import { POLITE_REPLY, WELCOME_TEXT, containsBlockedWord, createMessage, createRateLimiter, extractAction } from "./sada";

const welcome = () => ({ ...createMessage("bot", WELCOME_TEXT), id: "welcome", time: "" });

/** State percakapan SADA: kirim pesan, riwayat, indikator mengetik, dan pembatas spam. */
export default function useSadaChat() {
  const [messages, setMessages] = useState(() => [welcome()]);
  const [typing, setTyping] = useState(false);
  const [notice, setNotice] = useState(null);
  const limiter = useMemo(() => createRateLimiter(), []);
  const lastTextRef = useRef("");
  const noticeTimer = useRef(null);

  const warn = useCallback((text) => {
    setNotice(text);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 5000);
  }, []);

  const request = useCallback(async (text, history) => {
    setTyping(true);
    try {
      const response = await chatbotApi.sendMessage(text, history);
      const reply = response?.reply || response?.answer || (typeof response === "string" ? response : "Terima kasih! SADA siap membantu.");
      setMessages((prev) => [...prev, createMessage("bot", reply, { action: extractAction(response) })]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        createMessage("bot", error.message || "Maaf, SADA sedang tidak bisa terhubung. Coba lagi beberapa saat lagi ya.", {
          error: true,
        }),
      ]);
    } finally {
      setTyping(false);
    }
  }, []);

  // Validasi langsung (mengembalikan true bila pesan diterima), lalu kirim ke API di latar
  const send = useCallback(
    (raw) => {
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

      const history = messages
        .filter((message) => message.id !== "welcome")
        .slice(-6)
        .map((message) => ({ role: message.role === "user" ? "user" : "assistant", content: message.content }));

      setMessages((prev) => [...prev, createMessage("user", text)]);
      request(text, history);
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
