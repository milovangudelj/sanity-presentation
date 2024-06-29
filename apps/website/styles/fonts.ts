import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const geist = localFont({
  src: "../public/fonts/GeistVF.woff2",
  display: "swap",
  variable: "--font-geist",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
