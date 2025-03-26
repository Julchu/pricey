import type { Metadata } from "next";
import { geistMono, montserrat } from "@/components/fonts";
import "./globals.css";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "The Pricey App",
  description: "Don't get ripped off by your groceries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={"en"}>
      <body
        className={`${montserrat.className} ${geistMono.variable} antialiased`}
      >
        <main
          className={
            "container flex h-dvh w-screen flex-col gap-4 bg-gray-50 p-4 md:mx-auto"
          }
        >
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}