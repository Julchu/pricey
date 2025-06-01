import type { Metadata } from "next";
import { geistMono, montserrat } from "@/components/fonts";
import "./globals.css";
import { Header } from "@/components/header";
import { UserStoreProvider } from "@/providers/user-store-provider";
import { ReactScan } from "@/components/react-scan";
import { cookies } from "next/headers";
import { UserFormData } from "@/utils/interfaces";

export const metadata: Metadata = {
  title: "The Pricey App",
  description: "Don't get ripped off by your groceries",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userInfo: UserFormData | undefined;

  const browserCookies = await cookies();
  const idToken = browserCookies.get("pricey_access_token")?.value;
  if (idToken) {
    try {
      const loginResponse = await fetch(
        `${process.env.PRICEY_BACKEND_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

      const { success, data } = await loginResponse.json();
      if (success) userInfo = data;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <html lang={"en"}>
      <body
        className={`${montserrat.className} ${geistMono.variable} antialiased`}
      >
        <ReactScan />
        <UserStoreProvider userInfo={userInfo} />
        <main
          className={
            "container mx-auto flex h-dvh w-screen flex-col gap-4 bg-gray-50 p-4"
          }
        >
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}