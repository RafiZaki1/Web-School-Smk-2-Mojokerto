"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, TextAlignEnd, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { MAIN_NAV, PPDB_HREF } from "@/lib/data/navigation";

const EMBLEM_SRC = "/images/brand/emblem-smkn2.png";

function Brand({ schoolName }) {
  return (
    <Link href="/" className="site-header__brand" aria-label={schoolName}>
      <img src={EMBLEM_SRC} alt="" width={52} height={52} />
      <span className="site-header__brand-text">
        <strong>SMK NEGERI 2</strong>
        <span>KOTA MOJOKERTO</span>
      </span>
    </Link>
  );
}

function MegaLink({ item, onNavigate, className }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      <span className="site-header__mega-icon">
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="site-header__mega-copy">
        <strong>{item.label}</strong>
        <small>{item.description}</small>
      </span>
    </Link>
  );
}

export default function Navbar({ variant = "transparent", schoolName = "SMK Negeri 2 Kota Mojokerto" }) {
  const headerRef = useRef(null);
  const id = useId();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(null);

  useEffect(() => {
    if (variant !== "transparent") return;
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpenMenu(null);
    };
    const onKeyDown = (event) => {
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
    if (!drawerOpen) return;
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
      <header ref={headerRef} className={`site-header ${isLight ? "site-header--light" : "site-header--transparent"}`}>
        <div className="page-container site-header__inner">
          <Brand schoolName={schoolName} />

          <nav className="site-header__nav" aria-label="Menu utama">
            {MAIN_NAV.map((item, index) =>
              item.children ? (
                <div
                  key={item.label}
                  className={`site-header__group${openMenu === item.label ? " is-open" : ""}`}
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null);
                  }}
                >
                  <button
                    type="button"
                    className="site-header__link"
                    aria-expanded={openMenu === item.label}
                    aria-controls={`${id}-mega-${index}`}
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown size={16} strokeWidth={2.5} aria-hidden="true" />
                  </button>
                  <div className="site-header__mega" id={`${id}-mega-${index}`}>
                    {item.children.map((child) => (
                      <MegaLink
                        key={child.label}
                        item={child}
                        className="site-header__mega-link"
                        onNavigate={() => setOpenMenu(null)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.label} href={item.href} className="site-header__link">
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="site-header__actions">
            <Button href={PPDB_HREF} variant="accent">
              Informasi PPDB
            </Button>
          </div>

          <button
            type="button"
            className="site-header__menu-button"
            aria-label="Buka menu"
            aria-expanded={drawerOpen}
            aria-controls={`${id}-drawer`}
            onClick={() => setDrawerOpen(true)}
          >
            <TextAlignEnd size={24} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={`site-header__overlay${drawerOpen ? " is-open" : ""}`} onClick={closeDrawer} aria-hidden="true" />
      <aside
        id={`${id}-drawer`}
        className={`site-header__drawer${drawerOpen ? " is-open" : ""}`}
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
        aria-label="Menu seluler"
      >
        <div className="site-header__drawer-head">
          <img src={EMBLEM_SRC} alt={schoolName} width={40} height={40} />
          <button type="button" className="site-header__drawer-close" onClick={closeDrawer} aria-label="Tutup menu">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="site-header__drawer-nav">
          {MAIN_NAV.map((item, index) =>
            item.children ? (
              <div key={item.label}>
                <button
                  type="button"
                  className="site-header__drawer-link"
                  aria-expanded={mobileMenu === item.label}
                  aria-controls={`${id}-mobile-${index}`}
                  onClick={() => setMobileMenu(mobileMenu === item.label ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
                {mobileMenu === item.label && (
                  <div className="site-header__drawer-sub" id={`${id}-mobile-${index}`}>
                    {item.children.map((child) => (
                      <MegaLink key={child.label} item={child} className="site-header__drawer-sublink" onNavigate={closeDrawer} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.label} href={item.href} className="site-header__drawer-link" onClick={closeDrawer}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <Button href={PPDB_HREF} variant="accent" block className="site-header__drawer-cta" onClick={closeDrawer}>
          Informasi PPDB
        </Button>
      </aside>
    </>
  );
}
