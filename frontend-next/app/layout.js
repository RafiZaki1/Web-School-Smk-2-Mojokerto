import { Inter, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";
import PublicChatbot from "@/components/chatbot/PublicChatbot";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#05529e",
};

export const metadata = {
  title: "SMK Negeri 2 Kota Mojokerto",
  description: "Website Resmi SMK Negeri 2 Kota Mojokerto - Disiplin, Berakhlak, Berprestasi",
  icons: {
    icon: "/images/brand/emblem-smkn2.png",
    shortcut: "/favicon.ico",
    apple: "/images/brand/emblem-smkn2.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`scroll-smooth ${poppins.variable} ${jakarta.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-body antialiased selection:bg-primary selection:text-white">
        {children}
        <PublicChatbot />
      </body>
    </html>
  );
}
