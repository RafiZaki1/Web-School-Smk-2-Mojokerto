"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, MapPin, SendHorizontal, X } from "lucide-react";
import { QUICK_PROMPTS, SADA_AVATAR, runAction } from "@/lib/chatbot/sada";

/** Teks balasan: **tebal**, baris baru, dan butir daftar "- " / "* ". */
function FormattedText({ text }) {
  const blocks = text.split("\n");
  return (
    <div className="space-y-1.5">
      {blocks.map((line, index) => {
        if (!line.trim()) return <span key={index} className="block h-1" />;
        const bullet = /^\s*[-*•]\s+/.test(line);
        const content = line.replace(/^\s*[-*•]\s+/, "");
        const parts = content.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part.replace(/\*/g, "")
          ),
        );
        return bullet ? (
          <p key={index} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" aria-hidden="true" />
            <span>{parts}</span>
          </p>
        ) : (
          <p key={index}>{parts}</p>
        );
      })}
    </div>
  );
}

export function Avatar({ size = "md" }) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <img
      src={SADA_AVATAR}
      alt=""
      className={`${dim} shrink-0 rounded-full bg-white object-contain p-0.5 shadow-[0_2px_6px_rgba(15,23,42,0.1)]`}
    />
  );
}

export function ChatMessage({ message }) {
  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[#1e3a9f] px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line text-white">
          {message.content}
        </div>
        {message.time ? <span className="mt-1 text-[11px] text-[#94a3b8]">{message.time}</span> : null}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <Avatar size="sm" />
      <div className="min-w-0 max-w-[85%]">
        <p className="mb-1 text-xs font-bold text-[#2f80d1]">SADA</p>
        <div
          className={`rounded-2xl rounded-tl-md px-4 py-3 text-[15px] leading-relaxed shadow-[0_1px_3px_rgba(15,23,42,0.06)] ${
            message.error ? "border border-[#fecaca] bg-[#fef2f2] text-[#991b1b]" : "bg-white text-[#1e293b]"
          }`}
        >
          <FormattedText text={message.content} />
          {message.action ? (
            <button
              type="button"
              onClick={() => runAction(message.action)}
              className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl bg-[#eff6ff] px-3 py-2 text-[13px] font-semibold text-[#1d4ed8] transition-colors hover:bg-[#dbeafe]"
            >
              <MapPin size={15} aria-hidden="true" />
              {message.action.label}
            </button>
          ) : null}
        </div>
        {message.time ? <span className="mt-1 block text-[11px] text-[#94a3b8]">{message.time}</span> : null}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div role="status" className="flex w-fit items-center gap-2.5 rounded-full bg-white px-3 py-2 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <Avatar size="sm" />
      <span className="text-sm text-[#2f80d1]">SADA sedang mengetik</span>
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#93b8e6]" style={{ animationDelay: `${dot * 120}ms` }} />
        ))}
      </span>
    </div>
  );
}

export function QuickPrompts({ onPick, disabled }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-[#64748b]">Coba tanyakan:</p>
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => onPick(item.prompt)}
            className="cursor-pointer rounded-full border border-[#dbe4f0] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#1e293b] transition-colors hover:border-[#2563eb] hover:text-[#1d4ed8] disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChatNotice({ text, onClose }) {
  if (!text) return null;
  return (
    <div role="alert" className="mx-4 mb-2 flex items-start gap-2 rounded-xl bg-[#fffbeb] px-3 py-2 text-[13px] text-[#92400e]">
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span className="flex-1">{text}</span>
      <button type="button" onClick={onClose} aria-label="Tutup pemberitahuan" className="cursor-pointer text-[#b45309]">
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

/** Kolom ketik berbentuk pil + tombol kirim bulat (sesuai Figma SADA Roomchat). */
export function ChatComposer({ onSend, disabled, autoFocus = false }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = (event) => {
    event.preventDefault();
    if (onSend(value)) setValue("");
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white py-1.5 pr-1.5 pl-5 shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ketik pesan..."
        aria-label="Ketik pesan untuk SADA"
        maxLength={350}
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-[#1e293b] outline-none placeholder:text-[#94a3b8]"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Kirim pesan"
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1e3a9f] text-white transition-colors hover:bg-[#172f85] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SendHorizontal size={18} aria-hidden="true" />
      </button>
    </form>
  );
}

/** Daftar pesan yang otomatis menggulir ke bawah. */
export function ChatThread({ chat, className = "" }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat.messages, chat.typing]);

  return (
    <div className={`space-y-5 ${className}`} aria-live="polite">
      {chat.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {!chat.hasConversation ? <QuickPrompts onPick={chat.send} disabled={chat.typing} /> : null}
      {chat.typing ? <TypingIndicator /> : null}
      <div ref={endRef} />
    </div>
  );
}
