import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { PublicChatbot } from "@/features/chatbot";
import { AppProviders } from "@/providers/app-providers";
import { I18nProvider } from "@/providers/i18n-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import ThemeColorFloating from "@/shared/components/layout/ThemeColorFloating";
import { env } from "@/shared/config/env";
import { LOCALES, LOCALE_TAGS } from "@/shared/lib/i18n/config";
import { getLocale, getTranslator } from "@/shared/lib/i18n/server";
import { fontVariables } from "@/shared/lib/fonts";
import { THEME_INIT_SCRIPT } from "@/shared/lib/theme/theme";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0c4a68",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslator();

  return {
    metadataBase: new URL(env.siteUrl),
    title: {
      default: "SMK Negeri 2 Kota Mojokerto",
      template: "%s | SMK Negeri 2 Kota Mojokerto",
    },
    description: t("Website Resmi SMK Negeri 2 Kota Mojokerto - Disiplin, Berakhlak, Berprestasi"),
    openGraph: {
      type: "website",
      locale: LOCALE_TAGS[locale].og,
      siteName: "SMK Negeri 2 Kota Mojokerto",
      images: ["/images/brand/logo-smkn2-full.png"],
    },
    icons: {
      icon: "/images/brand/emblem-smkn2.png",
      shortcut: "/favicon.ico",
      apple: "/images/brand/emblem-smkn2.png",
    },
  };
}

// Setiap halaman dibuat untuk kedua bahasa lalu di-cache, bukan dirender ulang tiap kunjungan
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html
      lang={LOCALE_TAGS[locale].lang}
      data-scroll-behavior="smooth"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-body antialiased selection:bg-primary selection:text-white">
        <I18nProvider locale={locale}>
          <ThemeProvider>
            {/* Chatbot memakai TanStack Query, jadi harus berada di dalam AppProviders */}
            <AppProviders>
              {children}
              <ThemeColorFloating />
              <PublicChatbot />
            </AppProviders>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
