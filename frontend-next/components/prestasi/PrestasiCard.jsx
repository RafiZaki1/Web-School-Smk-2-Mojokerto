import Link from "next/link";
import { Trophy } from "lucide-react";

const TONES = {
  blue: "from-[#2563eb] to-[#1e3a8a]",
  teal: "from-[#0d9488] to-[#0f766e]",
  indigo: "from-[#4f46e5] to-[#312e81]",
  sky: "from-[#0284c7] to-[#075985]",
};

export default function PrestasiCard({ item }) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className={`flex h-48 flex-col justify-between bg-gradient-to-br p-5 lg:h-[216px] ${TONES[item.tone] ?? TONES.blue}`}>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#facc15] px-3 py-1 text-xs font-semibold text-[#713f12]">
          <Trophy size={12} strokeWidth={2.5} aria-hidden="true" />
          {item.badge}
        </span>
        <p className="text-lg leading-snug font-semibold text-white sm:text-xl">{item.cardTitle}</p>
      </div>
      <div className="p-6 lg:px-7 lg:py-7">
        <p className="text-xs font-bold tracking-[0.06em] text-[#4b5563] uppercase">
          {item.date} • {item.level}
        </p>
        <h2 className="mt-2 text-lg leading-snug font-semibold text-blue sm:text-xl">
          <Link href={`/prestasi/${item.slug}`} className="hover:underline">
            {item.title}
          </Link>
        </h2>
        <p className="mt-4 text-sm text-[#4b5563]">{item.subtitle}</p>
      </div>
    </article>
  );
}
