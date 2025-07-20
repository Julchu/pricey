import type { Metadata } from "next";
import { geistMono, montserrat } from "@/components/fonts";
import "./globals.css";
import { Header } from "@/components/header/header";
import { ReactScan } from "@/components/react-scan";
import { PropsWithChildren } from "react";
import { Providers } from "@/providers/providers";

export const metadata: Metadata = {
  title: "The Pricey App",
  description: "Don't get ripped off by your groceries",
};

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <html lang={"en"}>
      <body
        className={`${montserrat.className} ${geistMono.variable} antialiased`}
      >
        <ReactScan />
        <main
          className={"container mx-auto flex h-dvh w-screen flex-col gap-4 p-4"}
        >
          {/*<ReactQueryProvider dehydratedState={dehydratedState}>*/}

          <Providers>
            <Header />
            {children}
          </Providers>

          {/*</ReactQueryProvider>*/}
        </main>
      </body>
    </html>
  );
}