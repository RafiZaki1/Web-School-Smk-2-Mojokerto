import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";

export type AdminButtonVariant = "normal" | "ghost" | "text" | "danger";

interface AdminButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "type" | "onClick"> {
  variant?: AdminButtonVariant;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  children?: ReactNode;
}

/** Tombol admin dari dealtech-ui (Button): normal, ghost, text, danger. */
export default function AdminButton({
  variant = "normal",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  href,
  className = "",
  children,
  type = "button",
  disabled,
  onClick,
  ...rest
}: AdminButtonProps) {
  const classes = `adm-btn adm-btn--${variant} ${className}`;
  const content = (
    <>
      {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
      {!loading && Icon && iconPosition === "left" ? <Icon aria-hidden="true" /> : null}
      {children ? <span>{children}</span> : null}
      {!loading && Icon && iconPosition === "right" ? <Icon aria-hidden="true" /> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} aria-label={rest["aria-label"]}>
        {content}
      </Link>
    );
  }

  return (
    <button {...rest} type={type} className={classes} disabled={disabled || loading} onClick={onClick}>
      {content}
    </button>
  );
}
