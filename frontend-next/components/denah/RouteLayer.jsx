/** Titik rute (persen 0-100 dari backend) menjadi atribut d SVG. */
export const toPathD = (points) =>
  points.length ? points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") : "";

/** Potongan rute milik satu langkah petunjuk arah (dari path_index langkah itu sampai langkah berikutnya). */
export function stepSegment(points, steps, index) {
  const step = steps[index];
  if (!step || step.type === "arrive") return [];
  const end = steps[index + 1]?.path_index ?? points.length - 1;
  return points.slice(step.path_index, Math.max(step.path_index, end) + 1);
}

/**
 * Garis rute di atas denah. Jalurnya sudah ortogonal mengikuti koridor (dihitung backend),
 * jadi tinggal digambar. Panah putih bergerak menunjukkan arah jalan; potongan langkah
 * yang sedang dipilih disorot oranye.
 */
export default function RouteLayer({ points, activeSegment = [] }) {
  if (!points?.length) return null;
  const d = toPathD(points);
  const activeD = toPathD(activeSegment);
  const dimmed = activeSegment.length > 1;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-10 h-full w-full" aria-hidden="true">
      <path d={d} fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" vectorEffect="non-scaling-stroke" />
      <path
        d={d}
        fill="none"
        stroke="#2563eb"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={dimmed ? 0.45 : 1}
        vectorEffect="non-scaling-stroke"
        className="transition-opacity duration-300"
      />
      <path
        d={d}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 11"
        vectorEffect="non-scaling-stroke"
        className="denah-route-flow"
      />
      {dimmed ? (
        <>
          <path d={activeD} fill="none" stroke="#fdba74" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" vectorEffect="non-scaling-stroke" />
          <path d={activeD} fill="none" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path
            d={activeD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 11"
            vectorEffect="non-scaling-stroke"
            className="denah-route-flow"
          />
        </>
      ) : null}
    </svg>
  );
}
