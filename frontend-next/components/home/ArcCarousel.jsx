"use client";

import { useEffect, useRef } from "react";

export default function ArcCarousel() {
  const containerRef = useRef(null);

  useEffect(() => {
    const photos = [
      "foto 1.png",
      "foto 2.png",
      "foto 3.png",
      "foto 4.png",
      "foto 5.png",
      "foto 6.png",
      "foto 7.png",
      "foto 8.png",
      "foto 9.png",
    ];
    const N = photos.length;
    let continuousOffset = 4.0;
    const flowSpeed = 0.005;
    let isPaused = false;
    let slideElements = [];
    let animationFrameId = null;

    function getContinuousTrackPoint(p, containerWidth) {
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

      const containerWidth = container.offsetWidth || window.innerWidth;

      slideElements.forEach((el, photoIndex) => {
        let p = (photoIndex - continuousOffset) % N;
        if (p > N / 2) p -= N;
        if (p < -N / 2) p += N;

        const pt = getContinuousTrackPoint(p, containerWidth);

        el.style.left = `${pt.left}px`;
        el.style.width = `${pt.width}px`;
        el.style.height = `${pt.height}px`;
        el.style.transform = `translateY(${pt.dropY}px) scale(${pt.scale}) rotateZ(${pt.rotateZ}deg) rotateY(${pt.rotateY}deg)`;
        el.style.opacity = pt.opacity;
        el.style.zIndex = pt.zIndex;
        el.dataset.p = p.toFixed(3);
      });
    }

    function flowLoop() {
      if (!isPaused) {
        continuousOffset = (continuousOffset + flowSpeed) % N;
        renderFlow();
      }
      animationFrameId = requestAnimationFrame(flowLoop);
    }

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    slideElements = [];

    photos.forEach((src, photoIndex) => {
      const el = document.createElement("div");
      el.className = "arc-slide";
      el.dataset.photoIndex = photoIndex;

      const img = document.createElement("img");
      img.src = `/${encodeURIComponent(src)}`;
      img.alt = `Foto Kegiatan ${photoIndex + 1} SMKN 2 Mojokerto`;
      img.loading = "eager";
      el.appendChild(img);

      el.addEventListener("click", () => {
        const p = parseFloat(el.dataset.p || "0");
        continuousOffset = ((continuousOffset + p) % N + N) % N;
        renderFlow();
      });

      container.appendChild(el);
      slideElements.push(el);
    });

    renderFlow();
    animationFrameId = requestAnimationFrame(flowLoop);

    const onMouseEnter = () => { isPaused = true; };
    const onMouseLeave = () => { isPaused = false; };
    const onTouchStart = () => { isPaused = true; };
    const onTouchEnd = () => { isPaused = false; };
    const onResize = () => { renderFlow(); };

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div id="arc-carousel-section" className="relative mt-8 w-full pb-8 sm:mt-10 sm:pb-12">
      <div
        id="arc-carousel"
        ref={containerRef}
        className="relative h-[190px] w-full overflow-visible sm:h-[270px] lg:h-[320px]"
      />
    </div>
  );
}
