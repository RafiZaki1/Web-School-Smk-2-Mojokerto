import { MapPin } from "lucide-react";

/**
 * Penanda rute: titik awal (lingkaran), tujuan (pin), dan nomor tiap belokan.
 * Belokan yang dipilih di panel petunjuk arah diperbesar & berdenyut.
 */
export default function MarkerLayer({ origin, dest, steps = [], activeStep = null, onStepClick }) {
  if (!origin && !dest) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {steps.map((step, index) => {
        if (step.type === "depart" || step.type === "arrive") return null;
        const isActive = index === activeStep;
        return (
          <button
            key={step.index}
            type="button"
            onClick={() => onStepClick?.(index)}
            aria-label={`Langkah ${step.index}: ${step.title}`}
            style={{ left: `${step.point.x}%`, top: `${step.point.y}%` }}
            className={`pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-white font-bold text-white shadow-[0_2px_6px_rgba(15,23,42,0.35)] transition-all ${
              isActive ? "z-10 h-7 w-7 bg-[#ea580c] text-[12px] ring-4 ring-[#ea580c]/30 motion-safe:animate-pulse" : "h-5 w-5 bg-[#1d4ed8] text-[10px] hover:scale-110"
            }`}
          >
            {step.index}
          </button>
        );
      })}

      {origin ? (
        <span
          style={{ left: `${origin.x}%`, top: `${origin.y}%` }}
          className={`absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-white shadow-[0_2px_6px_rgba(22,163,74,0.45)] ${
            activeStep === 0 ? "border-[#ea580c] ring-4 ring-[#ea580c]/30" : "border-[#16a34a]"
          }`}
        />
      ) : null}

      {dest ? (
        <span style={{ left: `${dest.x}%`, top: `${dest.y}%` }} className="absolute -translate-x-1/2 -translate-y-full">
          <span className="relative flex flex-col items-center">
            <MapPin size={30} strokeWidth={2.2} className="fill-[#dc2626] text-white drop-shadow-[0_3px_4px_rgba(15,23,42,0.35)]" aria-hidden="true" />
            <span className="absolute top-[30px] h-2 w-2 rounded-full bg-[#dc2626]/40 motion-safe:animate-ping" />
          </span>
        </span>
      ) : null}
    </div>
  );
}
