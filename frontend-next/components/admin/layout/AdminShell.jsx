"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, LogOut, Menu, X } from "lucide-react";
import { ADMIN_MENU } from "@/lib/data/adminMenu";
import { AdminSessionProvider, useAdminSession } from "../AdminSession";

// Butir dengan jalur terpanjang yang cocok yang aktif (pola AdminSidebar dealtech-ui)
function useActiveHref(pathname) {
  const all = ADMIN_MENU.flatMap((group) => group.items.map((item) => item.href));
  return all
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .reduce((a, b) => (b.length > a.length ? b : a), "");
}

function Brand() {
  return (
    <Link href="/admin" className="sidebar-brand">
      <img src="/images/brand/emblem-smkn2.png" alt="" />
      <span>
        <strong>SMKN 2 Mojokerto</strong>
        <small>Panel Admin</small>
      </span>
    </Link>
  );
}

export default function AdminShell({ children }) {
  return (
    <AdminSessionProvider>
      <ShellFrame>{children}</ShellFrame>
    </AdminSessionProvider>
  );
}

function ShellFrame({ children }) {
  const pathname = usePathname();
  const { user, summary, ready, logout } = useAdminSession();
  const [open, setOpen] = useState(false);
  const newAspirations = summary?.aspirations?.new ?? 0;
  const active = useActiveHref(pathname);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="admin-app app-shell">
      <div className={`sidebar-overlay${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <aside className={`app-sidebar${open ? " is-open" : ""}`} aria-label="Menu admin">
        <div className="sidebar-header">
          <Brand />
          <button type="button" className="sidebar-close-btn" onClick={() => setOpen(false)} aria-label="Tutup menu">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar-nav-scroll">
          {ADMIN_MENU.map((group) => (
            <div key={group.title}>
              <p className="sidebar-section-title">{group.title}</p>
              <ul className="sidebar-menu">
                {group.items.map(({ label, href, icon: Icon, badgeKey }) => {
                  const badge = badgeKey === "aspirations" && newAspirations ? `${newAspirations} baru` : null;
                  return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={href === active ? "page" : undefined}
                      className={`sidebar-menu-btn${href === active ? " active" : ""}`}
                    >
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                      {badge ? <span className="sidebar-menu-badge">{badge}</span> : null}
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-user-avatar" aria-hidden="true">
            {user?.initials ?? "A"}
          </span>
          <span className="min-w-0">
            <span className="sidebar-user-name block truncate">{user?.name ?? "Admin"}</span>
            <span className="sidebar-user-role block">Administrator</span>
          </span>
          <button type="button" className="sidebar-logout-btn" onClick={logout} aria-label="Keluar" title="Keluar">
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </aside>

      <div className="app-content">
        <header className="app-topbar">
          <button type="button" onClick={() => setOpen(true)} aria-label="Buka menu" aria-expanded={open}>
            <Menu size={20} aria-hidden="true" />
          </button>
          <Brand />
        </header>
        <main className="app-main">
          {ready ? (
            children
          ) : (
            <p className="flex items-center justify-center gap-2 py-24 text-[15px] text-[#64748b]" role="status">
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              Memeriksa sesi admin...
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
