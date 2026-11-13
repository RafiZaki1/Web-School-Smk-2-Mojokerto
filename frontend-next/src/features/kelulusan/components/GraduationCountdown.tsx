"use client";

import { useEffect, useState } from "react";
import { splitSeconds } from "../utils/countdown";

interface GraduationCountdownProps {
  // Detik tersisa saat status diambil dari server, dan kapan status itu diambil (ms)
  secondsUntilRelease: number;
  fetchedAt: number;
  onElapsed: () => void;
}

const UNITS = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

/**
 * Hitung mundur ke waktu rilis. Acuannya sisa detik dari server, bukan jam perangkat, jadi
 * jam HP yang tidak tepat tidak membuka form lebih awal. Saat habis, status diambil ulang.
 */
export function GraduationCountdown({ secondsUntilRelease, fetchedAt, onElapsed }: GraduationCountdownProps) {
  const target = fetchedAt + secondsUntilRelease * 1000;
  const [now, setNow] = useState(fetchedAt);
  const remaining = Math.max(0, Math.ceil((target - now) / 1000));

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (remaining === 0) onElapsed();
  }, [remaining, onElapsed]);

  const parts = splitSeconds(remaining);

  return (
    <div>
      <div className="mx-auto grid max-w-[440px] grid-cols-4 gap-2 sm:gap-3" role="timer" aria-label={`Sisa waktu ${parts.days} hari ${parts.hours} jam ${parts.minutes} menit`}>
        {UNITS.map((unit) => (
          <div key={unit.key} className="rounded-2xl border border-line bg-[var(--color-surface-alt)] px-2 py-3 text-center">
            <span className="block text-[26px] leading-none font-bold text-heading tabular-nums sm:text-[30px]">{String(parts[unit.key]).padStart(2, "0")}</span>
            <span className="mt-1.5 block text-[12px] font-medium text-muted">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
