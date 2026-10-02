/** Badge status dari dealtech-ui; variant: green, amber, red, blue, gray. */
export default function Badge({ variant = "gray", icon: Icon, children, className = "" }) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {Icon ? <Icon size={13} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

const STATUS_VARIANT = {
  Aktif: "green",
  Selesai: "green",
  Draf: "amber",
  Diproses: "blue",
  Tutup: "gray",
  Baru: "red",
};

export function StatusBadge({ status }) {
  return <Badge variant={STATUS_VARIANT[status] ?? "gray"}>{status}</Badge>;
}
