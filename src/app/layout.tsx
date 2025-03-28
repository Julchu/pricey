import type { Metadata } from "next";
import { geistMono, montserrat } from "@/components/fonts";
import "./globals.css";
import { Header } from "@/components/header";
import { UserStoreProvider } from "@/providers/user-store-provider";
import { ReactScan } from "@/components/react-scan";

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
        <ReactScan />
        <UserStoreProvider>
          <main
            className={
              "container mx-auto flex h-dvh w-screen flex-col gap-4 p-4"
            }
          >
            <Header />
            {children}
          </main>
        </UserStoreProvider>
      </body>
    </html>
  );
}