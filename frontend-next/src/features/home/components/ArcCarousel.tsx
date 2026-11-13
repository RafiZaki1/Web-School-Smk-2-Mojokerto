"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function ArcCarousel() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigateRef = useRef<(delta: number) => void>(() => {});

  useEffect(() => {
    const photos = Array.from({ length: 9 }, (_, i) => `/carousel/foto-${i + 1}.webp`);
    const N = photos.length;
    let continuousOffset = 4.0;
    const flowSpeed = 0.005;
    const tweenDuration = 600;
    let isPaused = false;
    let slideElements: HTMLElement[] = [];
    let animationFrameId: number | null = null;
    let tween: { from: number; to: number; start: number } | null = null;
    let containerWidthCache = 0;
    let lastSizedWidth = -1;
    let isVisible = true;
    // Putaran otomatis baru dimulai setelah halaman selesai dimuat, agar tidak berebut CPU
    // dengan pemuatan awal (terasa di HP). Foto sudah tampil di posisinya sejak awal.
    let autoFlow = false;

    const wrap = (value: number) => ((value % N) + N) % N;
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function shiftBy(delta: number) {
      tween = { from: continuousOffset, to: continuousOffset + delta, start: performance.now() };
    }

    function startLoop() {
      if (isVisible && animationFrameId === null) animationFrameId = requestAnimationFrame(flowLoop);
    }

    navigateRef.current = (direction) => {
      const base = tween ? tween.to : continuousOffset;
      // Ambil jalur terpendek agar tidak berputar penuh saat melewati batas wrap
      shiftBy(wrap(Math.round(base) + direction - continuousOffset + N / 2) - N / 2);
      startLoop();
    };

    function getContinuousTrackPoint(p: number, containerWidth: number) {
      const isMobile = containerWidth < 640;
      const isTablet = containerWidth < 1024;
      const absP = Math.abs(p);

      const baseW = isMobile ? (containerWidth < 390 ? 114 : 122) : isTablet ? 160 : 200;
      const baseH = isMobile ? (containerWidth < 390 ? 120 : 128) : isTablet ? 168 : 210;
      const gap = isMobile ? 8 : 12;
      const slotDistance = baseW + gap;

      const containerCenterX = containerWidth / 2;
      const left = containerCenterX + p * slotDistance - baseW / 2;

      const arcDrop = isMobile ? 54 : isTablet ? 85 : 105;
      const normP = p / 4.0;
      const dropY = arcDrop * (normP * normP);

      const scale = Math.max(0.74, 1.0 - normP * normP * 0.2);
      const rotateZ = normP * (isMobile ? 3.0 : 4.8);
      const rotateY = normP * (isMobile ? 6.0 : 9.5);

      let opacity = 1.0;
      if (absP <= 3.8) {
        opacity = Math.max(0.65, 1.0 - (absP / 4.0) * 0.28);
      } else if (absP <= 4.6) {
        opacity = Math.max(0, (0.72 * (4.6 - absP)) / 0.8);
      } else {
        opacity = 0;
      }

      const zIndex = Math.max(1, Math.round(50 - normP * normP * 40));

      return {
        left,
        width: baseW,
        height: baseH,
        dropY,
        scale,
        rotateZ,
        rotateY,
        opacity,
        zIndex,
      };
    }

    function renderFlow() {
      const container = containerRef.current;
      if (!container || !slideElements.length) return;

      if (!containerWidthCache) containerWidthCache = container.offsetWidth;
      const containerWidth = containerWidthCache || window.innerWidth;
      // Ukuran slide hanya berubah saat lebar layar berubah, jadi tidak perlu ditulis tiap frame
      const sizeChanged = containerWidth !== lastSizedWidth;
      lastSizedWidth = containerWidth;

      slideElements.forEach((el, photoIndex) => {
        let p = (photoIndex - continuousOffset) % N;
        if (p > N / 2) p -= N;
        if (p < -N / 2) p += N;

        const pt = getContinuousTrackPoint(p, containerWidth);

        if (sizeChanged) {
          el.style.width = `${pt.width}px`;
          el.style.height = `${pt.height}px`;
        }
        // Posisi horizontal lewat translateX (bukan `left`) agar browser tidak menghitung ulang layout tiap frame
        el.style.transform = `translateX(${pt.left}px) translateY(${pt.dropY}px) scale(${pt.scale}) rotateZ(${pt.rotateZ}deg) rotateY(${pt.rotateY}deg)`;
        el.style.opacity = String(pt.opacity);
        el.style.zIndex = String(pt.zIndex);
        el.dataset.p = p.toFixed(3);
      });
    }

    function flowLoop(now: number) {
      if (tween) {
        const t = Math.min(1, (now - tween.start) / tweenDuration);
        continuousOffset = wrap(tween.from + (tween.to - tween.from) * easeInOutCubic(t));
        if (t >= 1) tween = null;
        renderFlow();
      } else if (autoFlow && !isPaused) {
        continuousOffset = wrap(continuousOffset + flowSpeed);
        renderFlow();
      }
      animationFrameId = isVisible && (autoFlow || tween) ? requestAnimationFrame(flowLoop) : null;
    }

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    slideElements = [];

    photos.forEach((src, photoIndex) => {
      const el = document.createElement("div");
      el.className = "arc-slide";
      el.dataset.photoIndex = String(photoIndex);

      const img = document.createElement("img");
      img.src = src;
      img.alt = t("Foto Kegiatan {nomor} SMKN 2 Mojokerto", { nomor: photoIndex + 1 });
      img.loading = "eager";
      el.appendChild(img);

      el.addEventListener("click", () => {
        shiftBy(parseFloat(el.dataset.p || "0"));
        startLoop();
      });

      container.appendChild(el);
      slideElements.push(el);
    });

    renderFlow();

    // Safari belum punya requestIdleCallback, jadi memakai jeda biasa
    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    let idleId: number | null = null;
    const beginAutoFlow = () => {
      autoFlow = true;
      startLoop();
    };
    const scheduleAutoFlow = () => {
      idleId = hasIdleCallback ? window.requestIdleCallback(beginAutoFlow, { timeout: 2000 }) : window.setTimeout(beginAutoFlow, 1000);
    };
    if (document.readyState === "complete") scheduleAutoFlow();
    else window.addEventListener("load", scheduleAutoFlow, { once: true });

    const onMouseEnter = () => { isPaused = true; };
    const onMouseLeave = () => { isPaused = false; };
    const onTouchStart = () => { isPaused = true; };
    const onTouchEnd = () => { isPaused = false; };
    // Lebar dibaca ulang hanya saat ukuran carousel berubah, bukan setiap frame
    const resizeObserver = new ResizeObserver(() => {
      containerWidthCache = 0;
      renderFlow();
    });
    resizeObserver.observe(container);

    // Animasi berhenti saat carousel tidak terlihat di layar, lanjut lagi saat kembali terlihat
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (autoFlow) startLoop();
    });
    observer.observe(container);

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("load", scheduleAutoFlow);
      if (idleId !== null) {
        if (hasIdleCallback) window.cancelIdleCallback(idleId);
        else clearTimeout(idleId);
      }
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [t]);

  return (
    <div id="arc-carousel-section" className="relative mt-8 w-full pb-8 sm:mt-10 sm:pb-12">
      <div
        id="arc-carousel"
        ref={containerRef}
        className="relative h-[190px] w-full overflow-visible sm:h-[270px] lg:h-[320px]"
      />

      <div className="relative z-[60] -mt-[42px] flex items-center justify-center gap-3 sm:-mt-[78px] lg:-mt-[86px]">
        <button
          type="button"
          onClick={() => navigateRef.current(-1)}
          aria-label={t("Foto sebelumnya")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-11 sm:w-11"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => navigateRef.current(1)}
          aria-label={t("Foto berikutnya")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-11 sm:w-11"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
