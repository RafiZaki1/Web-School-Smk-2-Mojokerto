import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type BadgeVariant = "green" | "amber" | "red" | "blue" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

/** Badge status dari dealtech-ui. */
export default function Badge({ variant = "gray", icon: Icon, children, className = "" }: BadgeProps) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {Icon ? <Icon size={13} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  Aktif: "green",
  Selesai: "green",
  Draf: "amber",
  Diproses: "blue",
  Tutup: "gray",
  Baru: "red",
  Ditinjau: "green",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={STATUS_VARIANT[status] ?? "gray"}>{status}</Badge>;
}
