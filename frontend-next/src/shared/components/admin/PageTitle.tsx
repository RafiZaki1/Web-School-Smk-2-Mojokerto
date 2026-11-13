import type { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

/** Judul halaman admin dari dealtech-ui (PageTitle). */
export default function PageTitle({ title, subtitle, action, className = "" }: PageTitleProps) {
  return (
    <div className={`pagetitle ${className}`}>
      <div className="min-w-0">
        <h1 className="pagetitle__title">{title}</h1>
        {subtitle ? <p className="pagetitle__subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="pagetitle__action">{action}</div> : null}
    </div>
  );
}
