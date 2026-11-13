"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

/** Tombol "Bagikan Momen Ini": Web Share API, cadangan salin tautan. */
export default function ShareButton({ title }: { title: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // dibatalkan pengguna
      }
      return;
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={share}
      className="flex h-[72px] w-full cursor-pointer items-center justify-between rounded-full bg-[var(--color-navy)] px-8 text-lg font-medium text-white shadow-[0_12px_24px_rgba(11,59,102,0.25)] transition-colors hover:bg-navy-deep lg:h-[88px] lg:text-xl"
    >
      {t(copied ? "Tautan disalin" : "Bagikan Momen Ini")}
      <Share2 size={22} aria-hidden="true" />
    </button>
  );
}
