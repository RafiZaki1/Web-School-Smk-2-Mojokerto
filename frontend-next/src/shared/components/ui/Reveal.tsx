"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

interface RevealProps {
  id?: string;
  as?: ElementType;
  stagger?: number;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/**
 * Wadah animasi "muncul saat di-scroll". Elemen ber-class `reveal-item` di dalamnya
 * dianimasikan bergiliran menurut CSS variable `--i` (lihat styles/ui/motion.css).
 * Hanya wadah yang masih di bawah layar yang disembunyikan, jadi konten tidak berkedip
 * sebelum JavaScript siap dan tetap tampil tanpa JavaScript.
 */
export default function Reveal({ as: Tag = "div", stagger = 90, style, children, id, className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!element || reduceMotion || !("IntersectionObserver" in window)) return undefined;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return undefined;

    element.dataset.reveal = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} id={id} className={className} style={{ "--reveal-stagger": `${stagger}ms`, ...style } as CSSProperties}>
      {children}
    </Tag>
  );
}
