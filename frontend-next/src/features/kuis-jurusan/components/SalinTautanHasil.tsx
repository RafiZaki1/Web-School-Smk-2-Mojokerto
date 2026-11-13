"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

/** Salin link halaman hasil supaya bisa dibuka lagi kapan saja. */
export default function SalinTautanHasil({ code }: { code: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/kuis-jurusan/hasil/${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t("Salin link hasil kuis:"), url);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {t(copied ? "Link tersalin" : "Salin link hasil")}
    </button>
  );
}
