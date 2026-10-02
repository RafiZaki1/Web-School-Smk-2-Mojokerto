import Link from "next/link";
import { Loader2 } from "lucide-react";

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
  ...rest
}) {
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
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={rest.disabled || loading} {...rest}>
      {content}
    </button>
  );
}
