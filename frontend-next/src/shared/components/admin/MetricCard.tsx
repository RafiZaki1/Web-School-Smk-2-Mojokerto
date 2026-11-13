export interface MetricItem {
  label: string;
  value: string | number;
}

/** Kartu angka ringkas di atas tabel (pola StatCard dealtech-ui). */
export default function MetricCard({ value, label }: MetricItem) {
  return (
    <div className="app-card metric-card">
      <span className="metric-card__value">{value}</span>
      <span className="metric-card__label">{label}</span>
    </div>
  );
}

export function MetricGrid({ items }: { items: MetricItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4 lg:gap-6">
      {items.map((item) => (
        <MetricCard key={item.label} {...item} />
      ))}
    </div>
  );
}
