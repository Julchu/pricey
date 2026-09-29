import type { Metadata } from "next";
import { geistMono, montserrat } from "@/components/fonts";
import "./globals.css";
import { Header } from "@/components/header/header";
import { PropsWithChildren } from "react";
import { Providers } from "@/providers/providers";
import Script from "next/script";
import { PantryDrawer } from "@/components/pantry/pantry-drawer";

export const metadata: Metadata = {
  title: "The Pricey App",
  description: "Don't get ripped off by your groceries",
};

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <html lang={"en"} className={"bg-background-grey"}>
      <head>
        <Script
          src="//unpkg.com/react-scan/dist/auto.global.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${montserrat.className} ${geistMono.variable} antialiased`}
      >
        <main className={"flex h-dvh w-screen flex-row"}>
          {/*<ReactQueryProvider dehydratedState={dehydratedState}>*/}

          <Providers>
            <div className={"container mx-auto flex flex-col gap-4 p-4"}>
              <Header />
              {children}
            </div>

            <PantryDrawer />
          </Providers>

          {/*</ReactQueryProvider>*/}
        </main>
      </body>
    </html>
  );
}