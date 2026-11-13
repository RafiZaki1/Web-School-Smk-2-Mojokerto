"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, MapPin, SendHorizontal, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { chatComposerSchema, type ChatComposerValues } from "../validation/chatbot.schema";
import type { ChatMessageItem } from "../types/chatbot.type";
import { QUICK_PROMPTS, SADA_AVATAR, runAction } from "../utils/sada";

/** Teks balasan: **tebal**, baris baru, dan butir daftar "- " / "* ". */
function FormattedText({ text }: { text: string }) {
  const blocks = text.split("\n");
  return (
    <div className="space-y-1.5">
      {blocks.map((line, index) => {
        if (!line.trim()) return <span key={index} className="block h-1" />;
        const bullet = /^\s*[-*•]\s+/.test(line);
        const content = line.replace(/^\s*[-*•]\s+/, "");
        const parts: ReactNode[] = content.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
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

export function Avatar({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <Image
      src={SADA_AVATAR}
      alt=""
      width={40}
      height={40}
      className={`${dim} shrink-0 rounded-full bg-white object-contain p-0.5 shadow-[0_2px_6px_rgba(19,35,44,0.1)]`}
    />
  );
}

export function ChatMessage({ message }: { message: ChatMessageItem }) {
  const { t } = useTranslation();
  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[var(--color-navy)] px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line text-white">
          {message.content}
        </div>
        {message.time ? <span className="mt-1 text-[11px] text-[var(--color-muted)]">{message.time}</span> : null}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <Avatar size="sm" />
      <div className="min-w-0 max-w-[85%]">
        <p className="mb-1 text-xs font-bold text-navy-ink">SADA</p>
        <div
          className={`rounded-2xl rounded-tl-md px-4 py-3 text-[15px] leading-relaxed shadow-[0_1px_3px_rgba(19,35,44,0.06)] ${
            message.error ? "border border-[#fecaca] bg-[#fef2f2] text-[#991b1b] dark:border-red-400/30 dark:bg-red-950/40 dark:text-red-200" : "bg-card text-[var(--color-heading)]"
          }`}
        >
          {/* Pesan bawaan diterjemahkan; balasan SADA dari server tampil apa adanya */}
          <FormattedText text={t(message.content)} />
          {message.action ? (
            <button
              type="button"
              onClick={() => runAction(message.action)}
              className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--color-tint)] px-3 py-2 text-[13px] font-semibold text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-tint)]"
            >
              <MapPin size={15} aria-hidden="true" />
              {t(message.action.label)}
            </button>
          ) : null}
        </div>
        {message.time ? <span className="mt-1 block text-[11px] text-[var(--color-muted)]">{message.time}</span> : null}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  const { t } = useTranslation();
  return (
    <div role="status" className="flex w-fit items-center gap-2.5 rounded-full bg-card px-3 py-2 shadow-[0_1px_3px_rgba(19,35,44,0.06)]">
      <Avatar size="sm" />
      <span className="text-sm text-navy-ink">{t("SADA sedang mengetik")}</span>
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#93b8e6]" style={{ animationDelay: `${dot * 120}ms` }} />
        ))}
      </span>
    </div>
  );
}

export function QuickPrompts({ onPick, disabled }: { onPick: (prompt: string) => void; disabled: boolean }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-[var(--color-muted)]">{t("Coba tanyakan:")}</p>
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => onPick(t(item.prompt))}
            className="cursor-pointer rounded-full border border-[var(--color-line)] bg-card px-3.5 py-1.5 text-[13px] font-medium text-[var(--color-heading)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] disabled:opacity-50"
          >
            {t(item.label)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChatNotice({ text, onClose }: { text: string | null; onClose: () => void }) {
  const { t } = useTranslation();
  if (!text) return null;
  return (
    <div role="alert" className="mx-4 mb-2 flex items-start gap-2 rounded-xl bg-[#fffbeb] px-3 py-2 text-[13px] text-[#92400e] dark:bg-amber-400/15 dark:text-amber-200">
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span className="flex-1">{t(text)}</span>
      <button type="button" onClick={onClose} aria-label={t("Tutup pemberitahuan")} className="cursor-pointer text-[#b45309] dark:text-amber-300">
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

interface ChatComposerProps {
  onSend: (value: string) => boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  label?: string;
  maxLength?: number;
}

/** Kolom ketik berbentuk pil + tombol kirim bulat (sesuai Figma SADA Roomchat). Dikelola React Hook Form. */
export function ChatComposer({
  onSend,
  disabled = false,
  autoFocus = false,
  placeholder = "Ketik pesan...",
  label = "Ketik pesan untuk SADA",
  maxLength = 350,
}: ChatComposerProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<ChatComposerValues>({
    resolver: zodResolver(chatComposerSchema),
    defaultValues: { message: "" },
  });
  const message = useWatch({ control: form.control, name: "message" });
  const { ref, ...messageField } = form.register("message");

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const onSubmit = form.handleSubmit((values) => {
    if (onSend(values.message)) form.reset({ message: "" });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-card py-1.5 pr-1.5 pl-5 shadow-[0_4px_12px_rgba(19,35,44,0.06)]">
      <input
        {...messageField}
        ref={(element) => {
          ref(element);
          inputRef.current = element;
        }}
        placeholder={t(placeholder)}
        aria-label={t(label)}
        maxLength={maxLength}
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--color-heading)] outline-none placeholder:text-[var(--color-muted)]"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        aria-label={t("Kirim pesan")}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--color-navy)] text-white transition-colors hover:bg-[var(--color-navy-deep)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SendHorizontal size={18} aria-hidden="true" />
      </button>
    </form>
  );
}

/** Daftar pesan yang otomatis menggulir ke bawah. */
export function ChatThread({ chat, className = "" }: { chat: { messages: ChatMessageItem[]; typing: boolean; hasConversation: boolean; send: (text: string) => boolean }; className?: string }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat.messages, chat.typing]);

  return (
    <div className={`space-y-5 ${className}`} aria-live="polite">
      {chat.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {!chat.hasConversation ? <QuickPrompts onPick={(prompt) => chat.send(prompt)} disabled={chat.typing} /> : null}
      {chat.typing ? <TypingIndicator /> : null}
      <div ref={endRef} />
    </div>
  );
}
