import type { Metadata } from "next";
import { geistMono, montserrat } from "@/components/fonts";
import "./globals.css";
import { Header } from "@/components/header/header";
import { PropsWithChildren } from "react";
import { Providers } from "@/providers/providers";

export const metadata: Metadata = {
  title: "The Pricey App",
  description: "Don't get ripped off by your groceries",
};

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <html lang={"en"}>
      <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
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
