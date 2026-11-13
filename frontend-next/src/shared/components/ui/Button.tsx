import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "accent" | "link";
export type ButtonSize = "md" | "sm";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  withArrow?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

/**
 * Tombol pil dari DealTech UI (ButtonV1) dengan varian desain JHIC:
 * primary, outline, accent (lime + bulatan panah), dan link.
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  block = false,
  withArrow = false,
  className = "",
  children,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) {
  const classes = ["btn", `btn--${variant}`, size === "sm" && "btn--sm", block && "btn--block", className].filter(Boolean).join(" ");

  const content = (
    <>
      <span>{children}</span>
      {variant === "accent" && (
        <span className="btn__bubble" aria-hidden="true">
          <ArrowUpRight size={size === "sm" ? 16 : 18} strokeWidth={2.25} />
        </span>
      )}
      {variant !== "accent" && withArrow && <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />}
    </>
  );

  if (href) {
    if (isExternal(href)) {
      return (
        <a className={classes} href={href} target="_blank" rel="noreferrer" onClick={onClick}>
          {content}
        </a>
      );
    }

    return (
      <Link className={classes} href={href} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button {...rest} className={classes} type={type} onClick={onClick}>
      {content}
    </button>
  );
}
