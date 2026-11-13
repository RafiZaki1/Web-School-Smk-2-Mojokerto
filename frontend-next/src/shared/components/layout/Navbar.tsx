"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ExternalLink, TextAlignEnd, X } from "lucide-react";
import NotificationBell from "@/shared/components/layout/NotificationBell";
import {
    DrawerPreferences,
    HeaderPreferences,
} from "@/shared/components/layout/PreferenceControls";
import Button from "@/shared/components/ui/Button";
import { usePortalLinks } from "@/shared/hooks/usePortalLinks";
import { useTranslation } from "@/shared/hooks/useTranslation";
import {
    MAIN_NAV,
    PORTAL_NAV_GROUP,
    PPDB_HREF,
    type NavChild,
    type NavItem,
} from "@/shared/constants/navigation";

const EMBLEM_SRC = "/images/brand/emblem-smkn2.png";

interface NavbarProps {
    variant?: "transparent" | "light";
    schoolName?: string;
}

function Brand({ schoolName }: { schoolName: string }) {
    return (
        <Link href="/" className="site-header__brand" aria-label={schoolName}>
            <Image
                src={EMBLEM_SRC}
                alt=""
                width={46}
                height={46}
                className="site-header__brand-logo"
            />
            <span className="site-header__brand-text">
                <strong>SMK NEGERI 2</strong>
                <span>KOTA MOJOKERTO</span>
            </span>
        </Link>
    );
}

function MegaLink({
    item,
    onNavigate,
    className,
}: {
    item: NavChild;
    onNavigate: () => void;
    className: string;
}) {
    const { t } = useTranslation();
    const Icon = item.icon;
    const content = (
        <>
            <span className="site-header__mega-icon">
                <Icon size={20} aria-hidden="true" />
            </span>
            <span className="site-header__mega-copy">
                <strong>{t(item.label)}</strong>
                <small>{t(item.description)}</small>
            </span>
        </>
    );

    if (item.external) {
        return (
            <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={className}
                onClick={onNavigate}
            >
                {content}
            </a>
        );
    }

    return (
        <Link href={item.href} className={className} onClick={onNavigate}>
            {content}
        </Link>
    );
}

const hostOf = (url: string) => {
    try {
        return new URL(url).host;
    } catch {
        return url;
    }
};

// Pintasan portal dari pengaturan TU ditambahkan ke grup Kesiswaan; selama belum termuat, menu tetap utuh.
function useNavItems(): NavItem[] {
    const portals = usePortalLinks();
    return useMemo(() => {
        const extra: NavChild[] = (portals.data ?? []).map((link) => ({
            label: link.label,
            description: `Buka ${hostOf(link.url)}`,
            href: link.url,
            icon: ExternalLink,
            external: true,
        }));
        if (extra.length === 0) return MAIN_NAV;
        return MAIN_NAV.map((item) =>
            item.label === PORTAL_NAV_GROUP && item.children
                ? { ...item, children: [...item.children, ...extra] }
                : item,
        );
    }, [portals.data]);
}

export default function Navbar({
    variant = "transparent",
    schoolName = "SMK Negeri 2 Kota Mojokerto",
}: NavbarProps) {
    const { t } = useTranslation();
    const headerRef = useRef<HTMLElement>(null);
    const id = useId();
    const [isScrolled, setIsScrolled] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState<string | null>(null);
    const navItems = useNavItems();

    useEffect(() => {
        if (variant !== "transparent") return undefined;
        const onScroll = () => setIsScrolled(window.scrollY > 30);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [variant]);

    useEffect(() => {
        const onPointerDown = (event: PointerEvent) => {
            if (!headerRef.current?.contains(event.target as Node))
                setOpenMenu(null);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpenMenu(null);
                setDrawerOpen(false);
            }
        };
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!drawerOpen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [drawerOpen]);

    const closeDrawer = () => {
        setDrawerOpen(false);
        setMobileMenu(null);
    };

    const isLight = variant === "light" || isScrolled;

    return (
        <>
            <header
                ref={headerRef}
                className={`site-header ${isLight ? "site-header--light" : "site-header--transparent"}`}
            >
                <div className="page-container site-header__inner">
                    <Brand schoolName={schoolName} />

                    <nav
                        className="site-header__nav"
                        aria-label={t("Menu utama")}
                    >
                        {navItems.map((item, index) =>
                            item.children ? (
                                <div
                                    key={item.label}
                                    className={`site-header__group${openMenu === item.label ? " is-open" : ""}`}
                                    onMouseEnter={() => setOpenMenu(item.label)}
                                    onMouseLeave={() => setOpenMenu(null)}
                                    onBlur={(e) =>
                                        !e.currentTarget.contains(
                                            e.relatedTarget as Node | null,
                                        ) && setOpenMenu(null)
                                    }
                                >
                                    <button
                                        type="button"
                                        className="site-header__link"
                                        aria-expanded={openMenu === item.label}
                                        aria-controls={`${id}-mega-${index}`}
                                        onClick={() =>
                                            setOpenMenu(
                                                openMenu === item.label
                                                    ? null
                                                    : item.label,
                                            )
                                        }
                                    >
                                        <span>{t(item.label)}</span>
                                        <ChevronDown
                                            size={15}
                                            strokeWidth={2.5}
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <div
                                        className={`site-header__mega${item.children.length > 6 ? " site-header__mega--wide" : ""}`}
                                        id={`${id}-mega-${index}`}
                                    >
                                        {item.children.map((child) => (
                                            <MegaLink
                                                key={child.label}
                                                item={child}
                                                className="site-header__mega-link"
                                                onNavigate={() =>
                                                    setOpenMenu(null)
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={item.label}
                                    href={item.href ?? "/"}
                                    className="site-header__link"
                                >
                                    {t(item.label)}
                                </Link>
                            ),
                        )}
                    </nav>

                    <div className="site-header__actions">
                        <HeaderPreferences />
                        <Button href={PPDB_HREF} variant="accent" size="sm">
                            {t("Informasi PPDB")}
                        </Button>
                    </div>

                    {/* Lonceng tetap tampil di HP, menempel di samping tombol menu */}
                    <div className="site-header__tools">
                        <NotificationBell
                            tone={isLight ? "light" : "transparent"}
                        />

                        <button
                            type="button"
                            className="site-header__menu-button"
                            aria-label={t("Buka menu")}
                            aria-expanded={drawerOpen}
                            aria-controls={`${id}-drawer`}
                            onClick={() => setDrawerOpen(true)}
                        >
                            <TextAlignEnd size={24} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={`site-header__overlay${drawerOpen ? " is-open" : ""}`}
                onClick={closeDrawer}
                aria-hidden="true"
            />
            <aside
                id={`${id}-drawer`}
                className={`site-header__drawer${drawerOpen ? " is-open" : ""}`}
                aria-hidden={!drawerOpen}
                inert={!drawerOpen}
                aria-label={t("Menu seluler")}
            >
                <div className="site-header__drawer-head">
                    <div className="flex items-center gap-2.5">
                        <Image
                            src={EMBLEM_SRC}
                            alt={schoolName}
                            width={38}
                            height={38}
                        />
                        <span className="site-header__brand-text">
                            <strong>SMK NEGERI 2</strong>
                            <span>KOTA MOJOKERTO</span>
                        </span>
                    </div>
                    <button
                        type="button"
                        className="site-header__drawer-close"
                        onClick={closeDrawer}
                        aria-label={t("Tutup menu")}
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>

                <nav className="site-header__drawer-nav">
                    {navItems.map((item, index) =>
                        item.children ? (
                            <div key={item.label}>
                                <button
                                    type="button"
                                    className="site-header__drawer-link"
                                    aria-expanded={mobileMenu === item.label}
                                    aria-controls={`${id}-mobile-${index}`}
                                    onClick={() =>
                                        setMobileMenu(
                                            mobileMenu === item.label
                                                ? null
                                                : item.label,
                                        )
                                    }
                                >
                                    {t(item.label)}
                                    <ChevronDown size={18} aria-hidden="true" />
                                </button>
                                {mobileMenu === item.label && (
                                    <div
                                        className="site-header__drawer-sub"
                                        id={`${id}-mobile-${index}`}
                                    >
                                        {item.children.map((child) => (
                                            <MegaLink
                                                key={child.label}
                                                item={child}
                                                className="site-header__drawer-sublink"
                                                onNavigate={closeDrawer}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href ?? "/"}
                                className="site-header__drawer-link"
                                onClick={closeDrawer}
                            >
                                {t(item.label)}
                            </Link>
                        ),
                    )}
                </nav>

                <DrawerPreferences />

                <Button
                    href={PPDB_HREF}
                    variant="accent"
                    block
                    className="site-header__drawer-cta"
                    onClick={closeDrawer}
                >
                    {t("Informasi PPDB")}
                </Button>
            </aside>
        </>
    );
}
