import { Inter, Plus_Jakarta_Sans, Poppins } from "next/font/google";

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
  preload: false,
});

/** Kelas variabel font untuk <html>; dipakai root layout dan halaman 404 global. */
export const fontVariables = `${poppins.variable} ${jakarta.variable} ${inter.variable}`;
