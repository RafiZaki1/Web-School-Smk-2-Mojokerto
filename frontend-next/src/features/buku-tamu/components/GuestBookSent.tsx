import { CheckCircle2 } from "lucide-react";

interface GuestBookSentProps {
  message: string;
  againLabel: string;
  onAgain: () => void;
}

/** Konfirmasi setelah pesan atau permohonan kunjungan terkirim. */
export function GuestBookSent({ message, againLabel, onAgain }: GuestBookSentProps) {
  return (
    <div role="status" className="flex flex-col items-start gap-3 py-2">
      <CheckCircle2 size={32} className="text-[#15803d] dark:text-[#86efac]" aria-hidden="true" />
      <p className="text-[18px] font-semibold text-heading">{message}</p>
      <button type="button" className="svc-link text-[15px]" onClick={onAgain}>
        {againLabel}
      </button>
    </div>
  );
}
