import {
  Montserrat,
  Amatic_SC,
  Inter,
  Urbanist,
  Geist,
  Geist_Mono,
} from "next/font/google";

export const montserrat = Montserrat({ subsets: ["latin"] });

export const urbanist = Urbanist({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const amaticSC = Amatic_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});