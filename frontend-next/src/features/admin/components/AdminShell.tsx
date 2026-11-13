"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, LogOut, Menu, X } from "lucide-react";
import { useAdminSession } from "@/features/auth";
import { useAuthStore } from "@/shared/stores/auth.store";
import { stripLocalePrefix } from "@/shared/lib/i18n/config";
import { homePathFor, ROLES } from "@/shared/types/user.type";
import { isPathAllowed, menuForRole, type AdminMenuGroup } from "../constants/admin-menu";
import { useAdminSummary } from "../hooks/useAdminSummary";

// Butir dengan jalur terpanjang yang cocok yang aktif (pola AdminSidebar dealtech-ui)
function useActiveHref(pathname: string, menu: AdminMenuGroup[]): string {
  const all = menu.flatMap((group) => group.items.map((item) => item.href));
  return all
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .reduce((a, b) => (b.length > a.length ? b : a), "");
}

function Brand({ href, subtitle }: { href: string; subtitle: string }) {
  return (
    <Link href={href} className="sidebar-brand">
      <Image src="/images/brand/emblem-smkn2.png" alt="" width={44} height={44} />
      <span className="min-w-0">
        <strong>SMKN 2 Mojokerto</strong>
        <small>{subtitle}</small>
      </span>
    </Link>
  );
}

export default function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const pathname = stripLocalePrefix(usePathname());
  const hasToken = useAuthStore((state) => Boolean(state.token));
  const { user, ready, logout } = useAdminSession();
  const summary = useAdminSummary();
  const [open, setOpen] = useState(false);
  const role = user?.role;
  const isTu = role === ROLES.adminTu;
  const menu = menuForRole(role);
  const active = useActiveHref(pathname, menu);
  const allowed = isPathAllowed(role, pathname);
  const home = homePathFor(role);

  // Tanpa token, kembali ke login dan bawa alamat tujuan
  useEffect(() => {
    if (!hasToken) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [hasToken, pathname, router]);

  // Akun TU yang membuka halaman admin utama diarahkan ke meja kerja TU
  useEffect(() => {
    if (ready && !allowed) router.replace(home);
  }, [ready, allowed, home, router]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="admin-app app-shell">
      <div className={`sidebar-overlay${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <aside className={`app-sidebar${open ? " is-open" : ""}`} aria-label="Menu admin">
        <div className="sidebar-header">
          <Brand href={home} subtitle={isTu ? "Tata Usaha" : "Panel Admin"} />
          <button type="button" className="sidebar-close-btn" onClick={() => setOpen(false)} aria-label="Tutup menu">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar-nav-scroll">
          {menu.map((group) => (
            <div key={group.title}>
              <p className="sidebar-section-title">{group.title}</p>
              <ul className="sidebar-menu">
                {group.items.map(({ label, href, icon: Icon, badgeKey }) => {
                  // Jumlah data berstatus "new" dari ringkasan dashboard (kuis jurusan)
                  const newCount = badgeKey ? (summary.data?.[badgeKey]?.new ?? 0) : 0;
                  const badge = newCount ? `${newCount} baru` : null;
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
            <span className="sidebar-user-role block">{isTu ? "Tata Usaha" : "Administrator"}</span>
          </span>
          <button type="button" className="sidebar-logout-btn" onClick={logout} aria-label="Keluar" title="Keluar">
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </aside>

      <div className="app-content">
        <header className="app-topbar">
          <div className="app-topbar__left">
            <button type="button" onClick={() => setOpen(true)} aria-label="Buka menu" aria-expanded={open}>
              <Menu size={20} aria-hidden="true" />
            </button>
            <Brand href={home} subtitle={isTu ? "Tata Usaha" : "Panel Admin"} />
          </div>
          <button type="button" onClick={logout} aria-label="Keluar" title="Keluar">
            <LogOut size={18} aria-hidden="true" />
          </button>
        </header>
        <main className="app-main">
          {ready && allowed ? (
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
