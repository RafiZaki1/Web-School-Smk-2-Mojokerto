/** Kartu angka ringkas di atas tabel (pola StatCard dealtech-ui). */
export default function MetricCard({ value, label }) {
  return (
    <div className="app-card metric-card">
      <span className="metric-card__value">{value}</span>
      <span className="metric-card__label">{label}</span>
    </div>
  );
}

export function MetricGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-[27px]">
      {items.map((item) => (
        <MetricCard key={item.label} {...item} />
      ))}
    </div>
  );
}
