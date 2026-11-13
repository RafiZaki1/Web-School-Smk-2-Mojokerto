import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/globals.css";
import { cookies } from "next/headers";
import { I18nProvider } from "@/providers/i18n-provider";
import { EmptyState } from "@/shared/components/feedback/StatusState";
import { fontVariables } from "@/shared/lib/fonts";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_TAGS, isLocale } from "@/shared/lib/i18n/config";
import { createTranslator } from "@/shared/lib/i18n/translate";
import { THEME_INIT_SCRIPT } from "@/shared/lib/theme/theme";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan | SMK Negeri 2 Kota Mojokerto",
  robots: { index: false, follow: false },
};

// Alamat yang tidak cocok dengan halaman mana pun. Dirender di luar root layout [locale],
// sehingga bahasa dibaca langsung dari cookie dan statusnya tetap 404 (bukan 200).
export default async function GlobalNotFound() {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : DEFAULT_LOCALE;
  const t = createTranslator(locale);

  return (
    <html lang={LOCALE_TAGS[locale].lang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-body antialiased">
        <I18nProvider locale={locale}>
          <div className="px-4 py-16">
            <EmptyState
              title="Halaman tidak ditemukan"
              description="Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan."
              action={
                <Link href="/" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
                  {t("Kembali ke beranda")}
                </Link>
              }
            />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
