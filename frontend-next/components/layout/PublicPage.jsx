import Navbar from "./Navbar";
import Footer from "./Footer";

/** Kerangka halaman publik: navbar putih, isi, dan footer. */
export default function PublicPage({ children, className = "bg-page", contentClassName = "" }) {
  return (
    <>
      <Navbar variant="light" />
      <main className={`flex-1 pt-[100px] pb-20 lg:pt-[120px] lg:pb-[110px] ${className}`}>
        <div className={`page-container ${contentClassName}`}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
