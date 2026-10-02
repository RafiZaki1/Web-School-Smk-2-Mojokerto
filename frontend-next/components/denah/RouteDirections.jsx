"use client";

import {
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock3,
  CornerUpLeft,
  CornerUpRight,
  Footprints,
  MapPin,
  Route,
  Undo2,
} from "lucide-react";

const STEP_STYLE = {
  depart: { icon: CircleDot, tone: "bg-[#dcfce7] text-[#15803d]" },
  arrive: { icon: MapPin, tone: "bg-[#fee2e2] text-[#b91c1c]" },
  "turn-left": { icon: CornerUpLeft, tone: "bg-[#dbeafe] text-[#1d4ed8]" },
  "turn-right": { icon: CornerUpRight, tone: "bg-[#dbeafe] text-[#1d4ed8]" },
  "slight-left": { icon: ArrowUpLeft, tone: "bg-[#dbeafe] text-[#1d4ed8]" },
  "slight-right": { icon: ArrowUpRight, tone: "bg-[#dbeafe] text-[#1d4ed8]" },
  straight: { icon: ArrowUp, tone: "bg-[#dbeafe] text-[#1d4ed8]" },
  "u-turn": { icon: Undo2, tone: "bg-[#fef3c7] text-[#b45309]" },
};

/**
 * Petunjuk arah langkah demi langkah dari backend: lewat jalur mana, belok di mana,
 * dan ruangan apa yang dilewati. Klik langkah untuk menyorot potongan rutenya di peta.
 */
export default function RouteDirections({ route, activeStep, onSelect, onPrev, onNext }) {
  const { steps, via, info } = route;
  const current = activeStep === null ? null : steps[activeStep];

  return (
    <div className="mt-4 grid gap-4 border-t border-[#eef2f6] pt-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-6">
      <div className="space-y-3">
        <div className="flex gap-2">
          <p className="flex flex-1 items-center gap-2.5 rounded-xl bg-[#eff6ff] px-3.5 py-3">
            <Footprints size={18} className="shrink-0 text-blue" aria-hidden="true" />
            <span>
              <span className="block text-lg leading-none font-bold text-ink">±{info.distance} m</span>
              <span className="text-xs text-[#64748b]">jarak jalan kaki</span>
            </span>
          </p>
          <p className="flex flex-1 items-center gap-2.5 rounded-xl bg-[#eff6ff] px-3.5 py-3">
            <Clock3 size={18} className="shrink-0 text-blue" aria-hidden="true" />
            <span>
              <span className="block text-lg leading-none font-bold text-ink">±{info.minutes} menit</span>
              <span className="text-xs text-[#64748b]">estimasi waktu</span>
            </span>
          </p>
        </div>

        {via.length ? (
          <div className="rounded-xl border border-[#e2e8f0] px-3.5 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#475569] uppercase">
              <Route size={14} aria-hidden="true" />
              Jalur yang dilewati
            </p>
            <ol className="mt-2.5 space-y-1.5">
              {via.map((name, index) => (
                <li key={name} className="flex items-center gap-2.5 text-sm text-ink">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${index === 0 ? "bg-[#16a34a]" : index === via.length - 1 ? "bg-[#dc2626]" : "bg-[#93c5fd]"}`}
                    aria-hidden="true"
                  />
                  {name}
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2 rounded-xl bg-[#f8fafc] px-3 py-2 text-sm text-[#475569]" aria-live="polite">
          <span className="truncate">{current ? `Langkah ${current.index} dari ${steps.length}` : "Pilih langkah untuk menyorot di peta"}</span>
          <span className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={onPrev}
              disabled={activeStep === 0}
              aria-label="Langkah sebelumnya"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white text-ink shadow-sm hover:bg-[#eef2f7] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={activeStep === steps.length - 1}
              aria-label="Langkah berikutnya"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white text-ink shadow-sm hover:bg-[#eef2f7] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>

      <ol aria-label="Petunjuk arah" className="relative space-y-1">
        {steps.map((step, index) => {
          const { icon: Icon, tone } = STEP_STYLE[step.type] ?? STEP_STYLE.straight;
          const isActive = index === activeStep;
          const isLast = index === steps.length - 1;
          return (
            <li key={step.index} className="relative">
              {!isLast ? <span className="absolute top-11 bottom-[-6px] left-[27px] w-0.5 bg-[#e2e8f0]" aria-hidden="true" /> : null}
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? "step" : undefined}
                className={`relative flex w-full cursor-pointer items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors ${
                  isActive ? "bg-[#fff7ed] ring-1 ring-[#fdba74]" : "hover:bg-[#f8fafc]"
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isActive ? "bg-[#ea580c] text-white" : tone}`}>
                  <Icon size={17} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 pt-0.5">
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-sm leading-snug font-semibold text-ink">{step.title}</span>
                    {step.distance > 0 ? (
                      <span className="shrink-0 rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">±{step.distance} m</span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-[#64748b]">{step.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
