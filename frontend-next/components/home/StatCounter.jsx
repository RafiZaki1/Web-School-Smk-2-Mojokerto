"use client";

import { useEffect, useRef, useState } from "react";

const format = (value, formatThousands) =>
  formatThousands ? new Intl.NumberFormat("id-ID").format(value) : String(value);

export default function StatCounter({
  target = 0,
  duration = 2000,
  suffix = "",
  formatThousands = true,
  label = "",
  icon,
  tone = "bg-white/15 text-white",
}) {
  const endValue = Number(target) || 0;
  const [display, setDisplay] = useState(format(endValue, formatThousands) + suffix);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!element || reduceMotion || !("IntersectionObserver" in window)) return;

    let frameId;
    const animate = () => {
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(format(Math.round(endValue * eased), formatThousands) + suffix);
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
    setDisplay(format(0, formatThousands) + suffix);
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [endValue, duration, suffix, formatThousands]);

  return (
    <div ref={elementRef} className="flex items-center gap-3">
      {icon && (
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tone}`} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-heading text-lg leading-tight font-bold text-white tabular-nums sm:text-[22px]">{display}</p>
        <p className="mt-0.5 font-heading text-xs text-white/90 sm:text-[13px]">{label}</p>
      </div>
    </div>
  );
}
