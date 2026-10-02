import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const isExternal = (href) => /^https?:\/\//.test(href);

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
  ...rest
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    size === "sm" && "btn--sm",
    block && "btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
        <a className={classes} href={href} target="_blank" rel="noreferrer" {...rest}>
          {content}
        </a>
      );
    }

    return (
      <Link className={classes} href={href} {...rest}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest;
  return (
    <button className={classes} type={type} {...buttonProps}>
      {content}
    </button>
  );
}
