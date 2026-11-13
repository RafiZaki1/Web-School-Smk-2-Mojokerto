import Link from "next/link";
import { getTranslator } from "@/shared/lib/i18n/server";

const NAV = [
  { label: "Beranda", href: "/bkk" },
  { label: "Lowongan", href: "/bkk/lowongan" },
  { label: "Perusahaan", href: "/bkk#mitra" },
  { label: "Tentang Kami", href: "/bkk#tentang" },
];

/** Header khusus portal BKK (halaman daftar lowongan). */
export async function BkkHeader({ active = "Lowongan" }: { active?: string }) {
  const t = await getTranslator();
  return (
    <header className="border-b border-[var(--color-line)] bg-card">
      <div className="page-container flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 lg:min-h-[72px]">
        <Link href="/bkk" className="text-base font-bold text-navy-ink sm:text-lg">
          BKK SMKN 2 Kota Mojokerto
        </Link>
        <nav aria-label={t("Menu BKK")} className="order-3 flex w-full flex-wrap gap-x-5 gap-y-1 text-[15px] sm:order-none sm:w-auto sm:gap-6 sm:text-base">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.label === active ? "page" : undefined}
              className={`border-b-2 py-1 whitespace-nowrap transition-colors ${
                item.label === active ? "border-navy-ink font-medium text-navy-ink" : "border-transparent text-[var(--color-body)] hover:text-navy-ink"
              }`}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
        <Link href="/login" className="rounded-lg bg-blue px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark">
          Login
        </Link>
      </div>
    </header>
  );
}

export async function BkkFooter() {
  const t = await getTranslator();
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface-alt)]">
      <div className="page-container flex flex-col gap-4 py-7 text-[13px] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-ink">© 2026 {t("Bursa Kerja Khusus SMKN 2 Kota Mojokerto. Seluruh hak cipta dilindungi.")}</p>
        <ul className="flex flex-wrap gap-6 text-[var(--color-body)]">
          <li>{t("Kebijakan Privasi")}</li>
          <li>{t("Syarat & Ketentuan")}</li>
          <li>
            <a href="mailto:bkk.smkn2mr@gmail.com" className="hover:text-blue">
              {t("Hubungi Kami")}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
