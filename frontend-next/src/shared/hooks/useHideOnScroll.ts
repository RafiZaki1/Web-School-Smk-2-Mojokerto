"use client";

import { useEffect, useState } from "react";

// true saat pengguna menggulir ke bawah di layar mobile, false lagi saat menggulir ke atas.
// Dipakai tombol mengambang agar tidak menutupi konten yang sedang dibaca.
export function useHideOnScroll(threshold = 8): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 639px)");
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (!mobile.matches || y < 120) setHidden(false);
      else if (y - lastY > threshold) setHidden(true);
      else if (lastY - y > threshold) setHidden(false);
      else return;
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    mobile.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mobile.removeEventListener("change", update);
      cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return hidden;
}
