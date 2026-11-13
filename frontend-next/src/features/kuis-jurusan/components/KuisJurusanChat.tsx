"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw, RotateCw, SkipForward } from "lucide-react";
import { ChatComposer, ChatMessage, TypingIndicator, type ChatMessageItem } from "@/features/chatbot";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { Translator } from "@/shared/lib/i18n/translate";
import { toast } from "@/shared/lib/toast";
import { useSubmitKuis } from "../hooks/useSubmitKuis";
import type { QuizQuestion, QuizResult } from "../types/kuis.type";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BOT_DELAY_MS = 600;

type Phase = "chat" | "submitting" | "done" | "failed";

interface Profile {
  name: string;
  email: string;
}

interface ChatStep {
  key: string;
  skippable: boolean;
  placeholder: string;
  soal?: QuizQuestion;
}

let messageId = 0;
const bot = (content: string, extra: Partial<ChatMessageItem> = {}): ChatMessageItem => ({ id: ++messageId, role: "bot", content, ...extra });
const user = (content: string): ChatMessageItem => ({ id: ++messageId, role: "user", content });

/**
 * Langkah percakapan: nama → email → tiap pertanyaan. Nama, email, dan
 * pertanyaan yang tidak wajib bisa dilewati.
 */
function buildSteps(questions: QuizQuestion[], t: Translator): ChatStep[] {
  return [
    { key: "name", skippable: true, placeholder: t("Ketik nama kamu...") },
    { key: "email", skippable: true, placeholder: t("Ketik email kamu...") },
    ...questions.map((soal) => ({ key: `q${soal.id}`, soal, skippable: !soal.required, placeholder: t("Ketik jawabanmu...") })),
  ];
}

function introMessages(total: number, t: Translator): ChatMessageItem[] {
  return [
    bot(
      t(
        "Hai! Aku **SADA** 👋 Aku bakal bantu kamu menemukan jurusan yang cocok lewat obrolan singkat.\n\nAda {total} pertanyaan tentang hobi dan minatmu. Jawab saja dengan kata-katamu sendiri, tidak ada jawaban benar atau salah.",
        { total },
      ),
    ),
    bot(t("Sebelum mulai, boleh tahu nama kamu? Kalau tidak mau, tekan **Lewati** saja.")),
  ];
}

function questionMessage(step: ChatStep, index: number, total: number, t: Translator): ChatMessageItem {
  return bot(`**${t("Pertanyaan {nomor} dari {total}", { nomor: index + 1, total })}**\n${t(step.soal?.question)}`, { hint: step.soal?.hint && t(step.soal.hint) });
}

/** Kuis minat jurusan berbentuk chat: pertanyaan dari sekolah, jawaban diketik siswa. */
export default function KuisJurusanChat({
  questions,
  maxLength = 500,
  offline = false,
}: {
  questions: QuizQuestion[];
  maxLength?: number;
  offline?: boolean;
}) {
  const { t } = useTranslation();
  const steps = buildSteps(questions, t);
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => introMessages(questions.length, t));
  const [stepIndex, setStepIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [profile, setProfile] = useState<Profile>({ name: "", email: "" });
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [phase, setPhase] = useState<Phase>("chat");
  const submission = useSubmitKuis();
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const step = steps[stepIndex];
  const questionIndex = stepIndex - 2;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Balasan bot muncul setelah jeda "mengetik" supaya terasa seperti chat
  const botReply = (items: ChatMessageItem[], after?: () => void) => {
    setTyping(true);
    const timer = setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, ...items]);
      after?.();
    }, BOT_DELAY_MS);
    timers.current.push(timer);
  };

  const submit = async (finalAnswers: Record<number, string>, finalProfile: Profile) => {
    setPhase("submitting");
    setTyping(true);
    try {
      const result: QuizResult = await submission.mutateAsync({ ...finalProfile, answers: finalAnswers });
      setTyping(false);
      setPhase("done");
      const { major, percentage, evidence, points, maxPoints } = result.primary ?? {
        major: null,
        percentage: 0,
        evidence: [],
        points: null,
        maxPoints: null,
      };
      const why =
        evidence.length && points !== null && maxPoints !== null
          ? `\n\n${t(
              "**Kenapa bisa {persen}%?** {cocok} dari {total} jawabanmu berkaitan dengan {kode}, totalnya {poin} dari {maks} poin ({poin} ÷ {maks} × 100%). Rincian tiap jurusan ada di hasil lengkap.",
              { persen: percentage, cocok: evidence.length, total: result.totalAnswered, kode: major?.code ?? "", poin: points, maks: maxPoints },
            )}`
          : "";
      setMessages((prev) => [
        ...prev,
        bot(
          `${finalProfile.name ? t("Hasilnya sudah keluar! 🎉 Jurusan yang paling cocok untuk {nama}:", { nama: finalProfile.name }) : t("Hasilnya sudah keluar! 🎉 Jurusan yang paling cocok untukmu:")}\n**${major?.code} — ${t(major?.fullName)}** (${t("{persen}% cocok", { persen: percentage })})` +
            why +
            (result.analysis ? `\n\n${result.analysis}` : ""),
        ),
        bot(t("Kode hasilmu: **{kode}**\nSimpan kode ini untuk membuka lagi jawaban dan hasilmu kapan saja. Guru BK juga akan meninjau hasil ini.", { kode: result.code }), {
          resultCode: result.code,
        }),
      ]);
    } catch (error) {
      setTyping(false);
      setPhase("failed");
      const message = t(error instanceof Error && error.message ? error.message : "Maaf, jawabanmu gagal dikirim. Coba kirim ulang ya.");
      setMessages((prev) => [...prev, bot(message, { error: true })]);
      toast.error(message);
    }
  };

  const advance = (nextProfile: Profile, nextAnswers: Record<number, string>) => {
    const nextIndex = stepIndex + 1;
    const next = steps[nextIndex];

    if (!next) {
      botReply([bot(t("Makasih sudah cerita! Tunggu sebentar ya, aku cocokkan jawabanmu dengan jurusan yang ada..."))], () => submit(nextAnswers, nextProfile));
      setStepIndex(nextIndex);
      return;
    }

    const items: ChatMessageItem[] = [];
    if (step.key === "name") {
      items.push(
        bot(
          `${nextProfile.name ? t("Senang kenalan, **{nama}**!", { nama: nextProfile.name }) : t("Oke, tidak apa-apa!")} ${t("Kalau mau, tulis email kamu supaya hasilnya gampang dicari lagi. Boleh juga dilewati.")}`,
        ),
      );
    } else if (next.soal && step.key === "email") {
      items.push(bot(t("Sip! Kita mulai ya.")));
      items.push(questionMessage(next, 0, questions.length, t));
    } else {
      items.push(questionMessage(next, nextIndex - 2, questions.length, t));
    }

    setStepIndex(nextIndex);
    botReply(items);
  };

  const handleSend = (value: string): boolean => {
    const text = value.trim();
    if (!text || typing || phase !== "chat" || !step) return false;

    if (step.key === "email" && !EMAIL_PATTERN.test(text)) {
      setMessages((prev) => [...prev, user(text)]);
      botReply([bot(t("Sepertinya format emailnya belum benar, misalnya **nama@email.com**. Coba ketik lagi, atau tekan **Lewati**."))]);
      return true;
    }

    setMessages((prev) => [...prev, user(text)]);

    if (step.key === "name" || step.key === "email") {
      const nextProfile = { ...profile, [step.key]: text };
      setProfile(nextProfile);
      advance(nextProfile, answers);
    } else if (step.soal) {
      const nextAnswers = { ...answers, [step.soal.id]: text };
      setAnswers(nextAnswers);
      advance(profile, nextAnswers);
    }
    return true;
  };

  const handleSkip = () => {
    if (!step?.skippable || typing || phase !== "chat") return;
    setMessages((prev) => [...prev, user(t("Lewati"))]);
    advance(profile, answers);
  };

  const restart = () => {
    timers.current.forEach(clearTimeout);
    setMessages(introMessages(questions.length, t));
    setStepIndex(0);
    setTyping(false);
    setProfile({ name: "", email: "" });
    setAnswers({});
    setPhase("chat");
  };

  const progress = Math.round((Math.max(0, Math.min(questionIndex, questions.length)) / questions.length) * 100);

  return (
    <section className="flex h-[min(720px,calc(100dvh-140px))] min-h-[520px] flex-col overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-tint)]">
      <header className="flex items-center gap-3 border-b border-[var(--color-line)] bg-card/70 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-[var(--color-heading)] sm:text-lg">{t("Ngobrol dengan SADA")}</h2>
          <div className="mt-1.5 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-line)]" aria-hidden="true">
              <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${phase === "done" ? 100 : progress}%` }} />
            </div>
            <span className="shrink-0 text-xs font-semibold text-[var(--color-muted)]">
              {phase === "done" ? t("Selesai") : t("{jawab}/{total} pertanyaan", { jawab: Math.max(0, Math.min(questionIndex, questions.length)), total: questions.length })}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={restart}
          aria-label={t("Mulai ulang kuis")}
          title={t("Mulai ulang kuis")}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-line)]"
        >
          <RefreshCw size={18} aria-hidden="true" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6" aria-live="polite">
        {offline && (
          <p className="rounded-xl bg-[#fffbeb] px-3 py-2 text-[13px] text-[#92400e] dark:bg-amber-400/15 dark:text-amber-200">
            {t("Server sedang tidak bisa dihubungi. Kamu tetap bisa menjawab, tetapi hasil baru bisa dihitung setelah server kembali normal.")}
          </p>
        )}
        {messages.map((message) => (
          <div key={message.id}>
            <ChatMessage message={message} />
            {message.hint && <p className="mt-1.5 ml-[42px] text-[13px] text-[var(--color-muted)] italic">{message.hint}</p>}
            {message.resultCode && (
              <Link
                href={`/kuis-jurusan/hasil/${message.resultCode}`}
                className="mt-3 ml-[42px] inline-flex items-center gap-2 rounded-full bg-[var(--color-navy)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-navy-deep)]"
              >
                {t("Lihat hasil lengkap")}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </div>
        ))}
        {typing && <TypingIndicator />}
      </div>

      <div className="border-t border-[var(--color-line)] bg-[var(--color-tint)] px-4 pt-3 pb-4 sm:px-6">
        {phase === "chat" && step ? (
          <>
            {step.skippable && (
              <button
                type="button"
                onClick={handleSkip}
                disabled={typing}
                className="mb-2.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-card px-3.5 py-1.5 text-[13px] font-medium text-[var(--color-heading)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] disabled:opacity-50"
              >
                <SkipForward size={14} aria-hidden="true" />
                {t("Lewati")}
              </button>
            )}
            <ChatComposer
              key={step.key}
              onSend={handleSend}
              disabled={typing}
              placeholder={step.placeholder}
              label={step.soal ? t("Jawaban untuk: {soal}", { soal: t(step.soal.question) }) : step.placeholder}
              maxLength={step.soal ? maxLength : step.key === "email" ? 150 : 100}
              autoFocus={stepIndex > 0}
            />
          </>
        ) : phase === "failed" ? (
          <button
            type="button"
            onClick={() => submit(answers, profile)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-navy-deep)]"
          >
            <RotateCw size={16} aria-hidden="true" />
            {t("Kirim ulang jawaban")}
          </button>
        ) : phase === "done" ? (
          <button
            type="button"
            onClick={restart}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-line)] bg-card px-5 py-2.5 text-sm font-semibold text-[var(--color-heading)] hover:border-[var(--color-primary)]"
          >
            <RefreshCw size={16} aria-hidden="true" />
            {t("Mulai kuis baru")}
          </button>
        ) : (
          <p className="py-2 text-center text-sm text-[var(--color-muted)]">{t("SADA sedang mencocokkan jawabanmu...")}</p>
        )}
      </div>
    </section>
  );
}
