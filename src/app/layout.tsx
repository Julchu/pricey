import type { Metadata } from "next";
import { geistMono, montserrat } from "@/components/fonts";
import "./globals.css";
import { Header } from "@/components/header/header";
import { PropsWithChildren } from "react";
import { Providers } from "@/providers/providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "The Pricey App",
  description: "Don't get ripped off by your groceries",
};

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <html lang={"en"}>
      <head>
        <Script
          src="https://unpkg.com/react-scan@0.4.3/dist/auto.global.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${montserrat.className} ${geistMono.variable} antialiased`}
      >
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