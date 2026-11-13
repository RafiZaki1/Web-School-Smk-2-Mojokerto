"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { LOCALE_TAGS, type Locale } from "@/shared/lib/i18n/config";

interface StatCounterProps {
  target?: number | string;
  duration?: number;
  suffix?: string;
  formatThousands?: boolean;
  label?: string;
  icon?: ReactNode;
  tone?: string;
  className?: string;
}

const format = (value: number, formatThousands: boolean, locale: Locale) =>
  formatThousands ? new Intl.NumberFormat(LOCALE_TAGS[locale].intl).format(value) : String(value);

/** Sel statistik dengan angka yang menghitung naik saat pertama kali terlihat. */
export default function StatCounter({
  target = 0,
  duration = 1600,
  suffix = "",
  formatThousands = true,
  label = "",
  icon,
  tone = "text-primary",
  className = "",
}: StatCounterProps) {
  const { locale } = useTranslation();
  const endValue = Number(target) || 0;
  const [display, setDisplay] = useState(format(endValue, formatThousands, locale));
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!element || reduceMotion || !("IntersectionObserver" in window)) return;

    let frameId = 0;
    const animate = () => {
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(format(Math.round(endValue * eased), formatThousands, locale));
        if (progress < 1) frameId = requestAnimationFrame(step);
      };
      frameId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    setDisplay(format(0, formatThousands, locale));
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [endValue, duration, formatThousands, locale]);

  return (
    <div ref={elementRef} className={`flex h-full flex-col ${className}`}>
      <p className="font-heading text-[28px] leading-none font-bold text-heading tabular-nums sm:text-[32px]">
        {display}
        {suffix && <span className="text-primary">{suffix}</span>}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-[13px] leading-snug text-muted sm:text-[14px]">
        {icon && (
          <span className={`shrink-0 ${tone}`} aria-hidden="true">
            {icon}
          </span>
        )}
        {label}
      </p>
    </div>
  );
}
