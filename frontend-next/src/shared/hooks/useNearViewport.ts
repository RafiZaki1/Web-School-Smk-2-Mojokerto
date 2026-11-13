"use client";

import { useEffect, useState, type RefObject } from "react";

// true setelah elemen pertama kali mendekati layar (sejauh `margin`), lalu tetap true.
// Dipakai untuk menunda pengambilan data section yang letaknya jauh di bawah halaman.
export function useNearViewport(ref: RefObject<Element | null>, margin = "600px"): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (near || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: margin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, margin, near]);

  return near;
}
