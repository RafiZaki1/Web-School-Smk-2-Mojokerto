import type { ReactNode } from "react";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import PageOrnaments, { type PageOrnamentTheme } from "@/shared/components/ui/PageOrnaments";

interface PublicPageProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Set ornamen bertema yang menghiasi tepi halaman. */
  ornaments?: PageOrnamentTheme;
}

/** Kerangka halaman publik: navbar putih, isi, dan footer. */
export default function PublicPage({ children, className = "bg-page", contentClassName = "", ornaments }: PublicPageProps) {
  return (
    <>
      <Navbar variant="light" />
      <main className={`relative isolate flex-1 pt-[100px] pb-20 lg:pt-[120px] lg:pb-[110px] ${className}`}>
        {ornaments && <PageOrnaments theme={ornaments} />}
        <div className={`page-container ${contentClassName}`}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
